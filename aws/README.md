# Hosting on AWS (S3 + CloudFront)

```
visitor ──HTTPS──► CloudFront ──► S3 bucket (private)      the website pages, images, CSS/JS
   www.whiztutors.co.za │
                        └─/api/*─► API Gateway ─► Lambda   /api/enquiry  → emails via Resend
                                                           /api/reviews  → Google reviews
```

Everything is defined in [template.yaml](template.yaml) and deployed by [deploy.js](deploy.js).
The API code is the same code as `netlify/functions/`; [lambda/index.js](lambda/index.js) just adapts it to AWS.

## One-time setup

1. **Use an IAM user or IAM Identity Center, not the root account.** Give it `AdministratorAccess`
   (or at least CloudFormation, S3, CloudFront, Lambda, API Gateway, IAM, ACM, Logs; plus Route 53 if used).
2. **Log in the AWS CLI:** `aws login` (or `aws configure sso`). Check with `aws sts get-caller-identity`.
3. **Secrets go in `.env`** (never committed). The deploy reads:
   `RESEND_API_KEY`, `FROM_EMAIL`, `NOTIFY_EMAIL`, `REPLY_TO_EMAIL`, `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`,
   `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `TURNSTILE_SECRET`. Anything missing falls back to
   [deploy.config.json](deploy.config.json) or is simply switched off.
4. **Verify `whiztutors.co.za` in Resend** (Resend → Domains → add the DNS records it shows), then set
   `FROM_EMAIL=Whiz Tutoring <enquiries@whiztutors.co.za>` in `.env`. Until then Resend's test sender
   (`onboarding@resend.dev`) only delivers to the Resend account's own email address — the other inboxes
   and the parent's confirmation email will not arrive.

## Deploy

```
npm run deploy:aws          # build + update AWS + upload + clear cache   (first run ~10–30 min)
npm run deploy:aws:site     # content-only change: build + upload + clear cache   (~1 min)
```

### First deploy with the domain (`domainName` set in deploy.config.json)

AWS issues a free HTTPS certificate, but must first see a DNS record proving you own the domain.

- **If the domain's DNS is in Route 53:** put the hosted zone ID in `hostedZoneId`. The certificate and
  the `www` / bare-domain records are created automatically.
- **Otherwise:** the deploy prints `CNAME _xxxx.whiztutors.co.za → _yyyy.acm-validations.aws` lines.
  Add them at your DNS provider and leave the deploy running; it continues once AWS sees them.
  When it finishes, point the domain at CloudFront (the deploy prints the `dxxxx.cloudfront.net` address):
  - `www` → **CNAME** to `dxxxx.cloudfront.net`
  - bare `whiztutors.co.za` → **ALIAS / ANAME / CNAME-flattening** to the same address. Many registrars
    can't do this at the bare domain; if yours can't, move DNS to Route 53 (≈ $0.50/month).

**When moving DNS, copy every existing record first** — especially the **MX** records for the
`mukundi@` / `enquiries@` mailboxes and Resend's **SPF/DKIM** records — or email will stop working.

Want to test before touching DNS? Set `domainName` and `apexDomain` to `""`, deploy, and use the
`https://dxxxx.cloudfront.net` address it prints. Fill them in and deploy again when ready.

## Good to know

- **Cost** for a site this size is typically well under $2/month (mostly free tier): CloudFront and
  S3 by traffic, Lambda/API Gateway per enquiry, Route 53 $0.50/month if used.
- **Cache:** pages are cached at CloudFront until the next deploy (each deploy clears it), so changes
  appear within a minute of `npm run deploy:aws:site`. CSS/JS URLs carry a content hash.
- **Redirects** live in the CloudFront function inside `template.yaml` (bare domain → www,
  `/pricing` → `/contact/`, `/about` → `/about/`). `dist/_redirects` and `netlify.toml` are Netlify-only.
- **Logs:** CloudWatch → Log groups → `/aws/lambda/whiztutors-site-EnquiryFunction…` (kept 30 days).
- **Form abuse:** the API is throttled to 10 requests/second; the form itself has a honeypot,
  a time trap and a per-IP limit.
- **First create failed?** CloudFormation rolls back and the stack must be deleted before retrying:
  `aws cloudformation delete-stack --stack-name whiztutors-site --region us-east-1`
  (the website bucket is kept on delete, so no content is lost).
