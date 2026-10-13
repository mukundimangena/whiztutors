// ============ WHIZ TUTORING — DEPLOY TO AWS (S3 + CloudFront + Lambda) ============
// npm run deploy:aws          → build, update the AWS stack, upload the site, clear the CDN cache
// npm run deploy:aws -- --site-only   → skip the stack update (just upload new pages; much faster)
//
// Settings: aws/deploy.config.json (domain, emails).  Secrets: .env (never committed).
// Needs the AWS CLI v2, logged in to the account (`aws login` / `aws configure sso`).
const fs = require('fs');
const path = require('path');
const { execFileSync, spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'deploy.config.json'), 'utf8'));
const REGION = cfg.region || 'us-east-1';
const STACK = cfg.stackName;
const siteOnly = process.argv.includes('--site-only');

// ---------- helpers ----------
const env = {};
if (fs.existsSync(path.join(ROOT, '.env'))) {
  for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const aws = (...args) => execFileSync('aws', [...args, '--region', REGION], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const awsLive = (...args) => new Promise((resolve, reject) => {
  const p = spawn('aws', [...args, '--region', REGION], { stdio: 'inherit' });
  p.on('exit', code => code === 0 ? resolve() : reject(new Error(`aws ${args[0]} ${args[1]} failed (exit ${code})`)));
});
const step = msg => console.log(`\n▶ ${msg}`);
const fail = msg => { console.error(`\n✖ ${msg}`); process.exit(1); };

function stackOutputs() {
  const out = JSON.parse(aws('cloudformation', 'describe-stacks', '--stack-name', STACK, '--query', 'Stacks[0].Outputs', '--output', 'json'));
  return Object.fromEntries((out || []).map(o => [o.OutputKey, o.OutputValue]));
}
function stackStatus() {
  try { return aws('cloudformation', 'describe-stacks', '--stack-name', STACK, '--query', 'Stacks[0].StackStatus', '--output', 'text'); }
  catch { return null; }
}

// While the certificate waits for DNS validation, show the record the domain needs (once).
function watchCertificate() {
  if (!cfg.domainName || cfg.hostedZoneId) return () => {};
  let shown = false;
  const t = setInterval(() => {
    if (shown) return;
    try {
      const arn = aws('cloudformation', 'describe-stack-resource', '--stack-name', STACK, '--logical-resource-id', 'Certificate',
        '--query', 'StackResourceDetail.PhysicalResourceId', '--output', 'text');
      if (!arn.startsWith('arn:')) return;
      const recs = JSON.parse(aws('acm', 'describe-certificate', '--certificate-arn', arn,
        '--query', 'Certificate.DomainValidationOptions[].{status:ValidationStatus,record:ResourceRecord}', '--output', 'json'));
      if (!recs.length || !recs.every(r => r.record)) return;
      shown = true;
      if (recs.every(r => r.status === 'SUCCESS')) return;
      console.log('\n  ┌─ ACTION NEEDED: add these DNS records where whiztutors.co.za\'s DNS is managed ─');
      for (const { record: r } of new Map(recs.map(x => [x.record.Name, x])).values())
        console.log(`  │  ${r.Type}  ${r.Name}  →  ${r.Value}`);
      console.log('  └─ The deploy continues automatically once AWS sees them (usually 5–30 min after adding).\n');
    } catch { /* resource not created yet */ }
  }, 15000);
  return () => clearInterval(t);
}

// ---------- main ----------
(async () => {
  try { aws('sts', 'get-caller-identity'); }
  catch (e) { fail('The AWS CLI is not logged in. Run `aws login` (or `aws configure sso`) and try again.\n' + (e.stderr || '')); }
  const account = aws('sts', 'get-caller-identity', '--query', 'Account', '--output', 'text');

  step('Building the site');
  execFileSync(process.execPath, ['build.js'], { cwd: ROOT, stdio: 'inherit' });

  if (!siteOnly) {
    const status = stackStatus();
    if (status === 'ROLLBACK_COMPLETE')
      fail(`The stack "${STACK}" failed on its first create and must be deleted before retrying:\n  aws cloudformation delete-stack --stack-name ${STACK} --region ${REGION}`);

    step('Packaging the API functions');
    const build = path.join(__dirname, '.build', 'lambda');
    fs.rmSync(build, { recursive: true, force: true });
    fs.mkdirSync(build, { recursive: true });
    fs.copyFileSync(path.join(__dirname, 'lambda', 'index.js'), path.join(build, 'index.js'));
    for (const f of ['enquiry.js', 'reviews.js']) fs.copyFileSync(path.join(ROOT, 'netlify', 'functions', f), path.join(build, f));

    const artifacts = `${STACK}-artifacts-${account}-${REGION}`;
    try { aws('s3api', 'head-bucket', '--bucket', artifacts); }
    catch {
      console.log(`  creating deployment bucket ${artifacts}`);
      aws('s3api', 'create-bucket', '--bucket', artifacts, ...(REGION === 'us-east-1' ? [] : ['--create-bucket-configuration', `LocationConstraint=${REGION}`]));
      aws('s3api', 'put-public-access-block', '--bucket', artifacts, '--public-access-block-configuration',
        'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true');
    }
    const packaged = path.join(__dirname, '.build', 'packaged.yaml');
    aws('cloudformation', 'package', '--template-file', path.join(__dirname, 'template.yaml'),
      '--s3-bucket', artifacts, '--s3-prefix', 'lambda', '--output-template-file', packaged);

    step(`Updating AWS stack "${STACK}" (first run takes ~5–10 min; CloudFront is slow to create)`);
    const params = {
      DomainName: cfg.domainName || '',
      ApexDomain: cfg.apexDomain || '',
      HostedZoneId: cfg.hostedZoneId || '',
      FromEmail: env.FROM_EMAIL || cfg.fromEmail,
      NotifyEmail: env.NOTIFY_EMAIL || cfg.notifyEmail,
      ReplyToEmail: env.REPLY_TO_EMAIL || cfg.replyToEmail,
      ResendApiKey: env.RESEND_API_KEY || '',
      SupabaseUrl: env.SUPABASE_URL || '',
      SupabaseServiceKey: env.SUPABASE_SERVICE_KEY || '',
      TurnstileSecret: env.TURNSTILE_SECRET || '',
      GooglePlacesApiKey: env.GOOGLE_PLACES_API_KEY || '',
      GooglePlaceId: env.GOOGLE_PLACE_ID || ''
    };
    if (!params.ResendApiKey) console.log('  ⚠ RESEND_API_KEY is not set in .env — enquiries will be accepted but no emails sent.');
    const stopWatch = watchCertificate();
    try {
      await awsLive('cloudformation', 'deploy', '--stack-name', STACK, '--template-file', packaged,
        '--capabilities', 'CAPABILITY_IAM', '--no-fail-on-empty-changeset',
        '--parameter-overrides', ...Object.entries(params).map(([k, v]) => `${k}=${v}`));
    } finally { stopWatch(); }
  }

  const out = stackOutputs();
  if (!out.BucketName) fail(`Stack "${STACK}" has no outputs yet — run without --site-only first.`);

  step(`Uploading the site to s3://${out.BucketName}`);
  const dist = path.join(ROOT, 'dist');
  const dest = `s3://${out.BucketName}`;
  // CSS/JS are linked with ?v=<hash>, so they can be cached for a year.
  await awsLive('s3', 'sync', dist, dest, '--delete', '--only-show-errors', '--exclude', '*',
    '--include', 'assets/style.css', '--include', 'assets/main.js',
    '--cache-control', 'public, max-age=31536000, immutable');
  await awsLive('s3', 'sync', dist, dest, '--delete', '--only-show-errors', '--exclude', '*', '--include', 'assets/img/*',
    '--cache-control', 'public, max-age=86400');
  // Pages: browsers always re-check; CloudFront keeps a copy until the next deploy clears it.
  await awsLive('s3', 'sync', dist, dest, '--delete', '--only-show-errors',
    '--exclude', 'assets/style.css', '--exclude', 'assets/main.js', '--exclude', 'assets/img/*', '--exclude', '_redirects',
    '--cache-control', 'public, max-age=0, s-maxage=86400, must-revalidate');

  step('Clearing the CloudFront cache');
  aws('cloudfront', 'create-invalidation', '--distribution-id', out.DistributionId, '--paths', '/*', '--query', 'Invalidation.Id', '--output', 'text');

  console.log(`\n✔ Deployed. ${out.WebsiteUrl}`);
  if (cfg.domainName && !cfg.hostedZoneId)
    console.log(`  DNS: point ${cfg.domainName} (CNAME)${cfg.apexDomain ? ` and ${cfg.apexDomain} (ALIAS/ANAME)` : ''} to ${out.CloudFrontDomain}`);
})().catch(e => fail(e.message));
