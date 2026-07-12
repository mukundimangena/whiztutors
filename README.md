# Whiz Tutoring — Lead-Generation Website

A statically generated, SEO-optimised website with serverless functions for enquiry
emails, lead storage, and live Google Business Profile reviews.

## What's here

```
build.js                     Static site generator (node build.js → dist/)
src/data.js                  ALL content: subjects, suburbs, blog posts, FAQs, contact details
src/base.css, extra.css      Design system
src/main.js                  Client JS: forms, validation, reviews widget, popups
netlify/functions/enquiry.js POST /api/enquiry — emails + stores every lead
netlify/functions/reviews.js GET  /api/reviews — live Google reviews (cached 6h)
netlify.toml                 Build + /api/* routing config
dist/                        The built site (40 pages, sitemap.xml, robots.txt)
```

**40 generated pages:** home · 11 subject landing pages (Maths/Physics/English/
Accounting/Private/Online/IGCSE/Cambridge/Matric/Grade-12-Maths/Engineering Tutor
Cape Town) · 12 suburb pages (Claremont → Somerset West) · 8 blog articles ·
subjects/areas/tutors/pricing/about/blog/contact/become-a-tutor.

## Deploy (Netlify — free tier is enough)

1. Push this folder to GitHub, then "Add new site → Import from Git" on netlify.com.
   Build command `node build.js`, publish directory `dist` (already in netlify.toml).
2. Set environment variables (Site settings → Environment variables):

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | From resend.com — sends both emails. Verify your domain there so mail comes from @whiztutoring.co.za |
| `FROM_EMAIL` | e.g. `Whiz Tutoring <hello@whiztutoring.co.za>` |
| `NOTIFY_EMAIL` | `whiztutors@gmail.com` |
| `GOOGLE_PLACES_API_KEY` | Google Cloud key with **Places API** enabled |
| `GOOGLE_PLACE_ID` | Your business's Place ID (Google's Place ID Finder) |
| `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` | *(optional)* lead database |
| `TURNSTILE_SECRET` | *(optional)* Cloudflare Turnstile CAPTCHA |

3. **Supabase table** (if storing leads): create table `leads` with columns
   `id uuid default gen_random_uuid() primary key`, `type text`, `payload jsonb`,
   `page text`, `created_at timestamptz`. Leads are also always emailed, so the
   database is a bonus, not a dependency.

4. **Update `src/data.js`** before going live: real WhatsApp/phone numbers, the
   Google review link (`SITE.googleReviewUrl` — from your Business Profile "Ask for
   reviews" share link), and your final domain in `SITE.domain`, then re-run
   `node build.js`.

## How the enquiry flow works

Every "Book a Tutor" button opens the full enquiry modal (student, parent, email,
phone, WhatsApp, grade, school, subjects, online/in-person, suburb, preferred
days/times, notes). On submit:

1. Client-side validation (required fields, email/phone format, inline errors).
2. Spam checks: hidden honeypot field, a time-trap (submissions under 2.5s are
   dropped), per-IP rate limiting, and optional Turnstile CAPTCHA verification.
3. `/api/enquiry` emails a formatted lead to whiztutors@gmail.com (reply-to set to
   the client), emails the client a branded confirmation with next steps, and
   inserts the lead into Supabase.
4. The visitor sees: *"Thank you! We'll contact you within 24 hours to match you
   with the perfect tutor."*

If the backend is unreachable (e.g. previewing dist/ locally), the form falls back
to opening a prefilled email to whiztutors@gmail.com so no lead is ever lost.

## Google reviews

`/api/reviews` calls the Google Places API (Place Details) — the standard,
ToS-compliant way to show your own Business Profile reviews — and caches results
for 6 hours. The widget shows live rating, review count and the latest reviews;
until the API keys are configured, the page shows the built-in seed reviews, so
nothing looks broken. "Read more reviews" and "Leave a review" buttons deep-link
to your profile. (For full review history beyond Google's five most relevant, the
Business Profile API with owner OAuth is the upgrade path.)

## SEO notes

- Every page has a unique title, meta description, canonical URL, OG/Twitter tags,
  and geo tags for Cape Town.
- JSON-LD on every page: `EducationalOrganization`+`LocalBusiness` (with
  `AggregateRating`), `WebSite`, plus per-page `BreadcrumbList`, `Service`,
  `FAQPage`, `Review` and `Article` schema. Validate at search.google.com/test/rich-results.
- `sitemap.xml` (40 URLs) and `robots.txt` are generated on every build — submit
  the sitemap in Google Search Console after launch.
- Also create a **Google Business Profile** if you haven't: for "maths tutor cape
  town" searches, the map pack converts as well as the organic results.

## Local preview

```
node build.js
npx serve dist        # or: python3 -m http.server -d dist 8000
```
