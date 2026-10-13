// ============ ONE-TIME: let GitHub Actions deploy the site ============
// npm run setup:github
// Creates (or updates) the "whiztutors-github" stack from aws/github-oidc.yaml, filling in the
// bucket and CloudFront distribution from the site stack, then prints the role to give GitHub.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'deploy.config.json'), 'utf8'));
const REGION = cfg.region || 'us-east-1';
const aws = (...args) => execFileSync('aws', [...args, '--region', REGION], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();

const outputs = JSON.parse(aws('cloudformation', 'describe-stacks', '--stack-name', cfg.stackName, '--query', 'Stacks[0].Outputs', '--output', 'json'));
const out = Object.fromEntries(outputs.map(o => [o.OutputKey, o.OutputValue]));

console.log('▶ Creating the GitHub deploy role (about a minute)…');
execFileSync('aws', ['cloudformation', 'deploy', '--stack-name', 'whiztutors-github',
  '--template-file', path.join(__dirname, 'github-oidc.yaml'), '--capabilities', 'CAPABILITY_NAMED_IAM',
  '--no-fail-on-empty-changeset', '--region', REGION, '--parameter-overrides',
  `SiteStackName=${cfg.stackName}`, `SiteBucketName=${out.BucketName}`, `DistributionId=${out.DistributionId}`], { stdio: 'inherit' });

const roleArn = aws('cloudformation', 'describe-stacks', '--stack-name', 'whiztutors-github',
  '--query', "Stacks[0].Outputs[?OutputKey=='RoleArn'].OutputValue", '--output', 'text');
console.log(`\n✔ Done. In GitHub: repo → Settings → Secrets and variables → Actions → Variables → New repository variable
    Name:  AWS_DEPLOY_ROLE_ARN
    Value: ${roleArn}`);
