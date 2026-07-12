// ============ WHIZ TUTORING — STATIC SITE GENERATOR ============
// node build.js  →  writes the full site into dist/
const fs = require('fs');
const path = require('path');
const { SITE, SUBJECT_PAGES, SUBURBS, POSTS, TUTORS, STORIES, SEED_REVIEWS, FAQS, SUBJECT_CARDS } = require('./src/data');

const DIST = path.join(__dirname, 'dist');
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });

// ---------- assets ----------
const css = fs.readFileSync('src/base.css', 'utf8') + fs.readFileSync('src/extra.css', 'utf8');
fs.writeFileSync(path.join(DIST, 'assets/style.css'), css);
fs.copyFileSync('src/main.js', path.join(DIST, 'assets/main.js'));

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>';
const WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1.2-.2.7-.9.9-1.2.2-.3.4-.2.6-.1l1.9.9c.2.1.4.2.5.3 0 .1 0 .8-.3 1.6z"/></svg>';
const jsonld = obj => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;

// ---------- shared structured data ----------
const orgSchema = {
  '@context': 'https://schema.org', '@type': ['EducationalOrganization', 'LocalBusiness'],
  '@id': SITE.domain + '/#organization',
  name: SITE.name, url: SITE.domain, email: SITE.email, telephone: SITE.phone,
  description: 'Premium one-on-one tutoring from South Africa\u2019s top university students and graduates. Online and in person across Cape Town.',
  address: { '@type': 'PostalAddress', addressLocality: 'Cape Town', addressRegion: 'Western Cape', addressCountry: 'ZA' },
  areaServed: [{ '@type': 'City', name: 'Cape Town' }, { '@type': 'Country', name: 'South Africa' }, { '@type': 'Country', name: 'Zambia' }],
  priceRange: 'R280–R395 per hour',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: SITE.rating, reviewCount: SITE.reviewCount, bestRating: 5 },
  sameAs: [SITE.googleMapsUrl]
};
const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', url: SITE.domain, name: SITE.name, publisher: { '@id': SITE.domain + '/#organization' } };
const breadcrumb = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: SITE.domain + it[1] })) });
const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
const reviewsSchema = SEED_REVIEWS.map(r => ({ '@context': 'https://schema.org', '@type': 'Review', itemReviewed: { '@id': SITE.domain + '/#organization' }, author: { '@type': 'Person', name: r.author }, reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 }, reviewBody: r.text }));

// ---------- layout ----------
function layout({ title, desc, canonical, body, schemas = [], ogType = 'website' }) {
  const url = SITE.domain + canonical;
  return `<!DOCTYPE html>
<html lang="en-ZA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="en_ZA">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="geo.region" content="ZA-WC">
<meta name="geo.placename" content="Cape Town">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
${jsonld(orgSchema)}
${jsonld(websiteSchema)}
${schemas.map(jsonld).join('\n')}
</head>
<body>
${navHTML()}
<main id="main">
${body}
</main>
${footerHTML()}
${chromeHTML()}
<script src="/assets/main.js" defer></script>
</body>
</html>`;
}

function navHTML() {
  return `<nav class="nav" id="nav" aria-label="Main navigation">
  <div class="container nav-inner">
    <a href="/" class="logo" aria-label="${SITE.name} home"><span class="logo-mark">W</span>Whiz<em>Tutoring</em></a>
    <ul class="nav-links">
      <li><a href="/subjects/">Subjects</a></li>
      <li><a href="/areas/">Areas</a></li>
      <li><a href="/tutors/">Tutors</a></li>
      <li><a href="/pricing/">Pricing</a></li>
      <li><a href="/blog/">Blog</a></li>
      <li><a href="/about/">About</a></li>
      <li><a href="/contact/">Contact</a></li>
    </ul>
    <div class="nav-cta">
      <a class="btn btn-ghost btn-sm" href="/become-a-tutor/">Become a Tutor</a>
      <button class="btn btn-primary btn-sm" onclick="openBooking()">Book a Tutor</button>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="/">Home</a><a href="/subjects/">Subjects</a><a href="/areas/">Areas</a><a href="/tutors/">Tutors</a>
  <a href="/pricing/">Pricing</a><a href="/blog/">Blog</a><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/become-a-tutor/">Become a Tutor</a>
  <button class="btn btn-primary" onclick="openBooking()">Book a Tutor</button>
</div>`;
}

function footerHTML() {
  return `<footer>
  <div class="container">
    <div class="foot-grid">
      <div class="foot-brand">
        <a href="/" class="logo" style="color:#fff"><span class="logo-mark">W</span>Whiz<em>Tutoring</em></a>
        <p>Premium one-on-one tutoring from South Africa's top university students and graduates. Cape Town & online nationwide.</p>
        <div class="foot-social">
          <a href="#" aria-label="Facebook"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.4c0-.9.3-1.6 1.7-1.6h1.5V4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.9H7.8V14h2.7v8h3z"/></svg></a>
          <a href="#" aria-label="Instagram"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg></a>
          <a href="https://wa.me/${SITE.whatsapp}" aria-label="WhatsApp">${WA_SVG.replace('viewBox', 'width="17" height="17" viewBox')}</a>
        </div>
      </div>
      <div><h4>Popular searches</h4>
        <a href="/maths-tutor-cape-town/">Maths Tutor Cape Town</a>
        <a href="/physics-tutor-cape-town/">Physics Tutor Cape Town</a>
        <a href="/private-tutor-cape-town/">Private Tutor Cape Town</a>
        <a href="/online-tutor-south-africa/">Online Tutor South Africa</a>
        <a href="/matric-tutor-cape-town/">Matric Tutor Cape Town</a>
      </div>
      <div><h4>Areas</h4>
        <a href="/areas/claremont/">Claremont</a>
        <a href="/areas/rondebosch/">Rondebosch</a>
        <a href="/areas/constantia/">Constantia</a>
        <a href="/areas/durbanville/">Durbanville</a>
        <a href="/areas/">All areas</a>
      </div>
      <div><h4>Company</h4>
        <a href="/about/">About us</a>
        <a href="/tutors/">Our tutors</a>
        <a href="/become-a-tutor/">Become a tutor</a>
        <a href="/blog/">Blog</a>
        <a href="/contact/">Contact</a>
      </div>
      <div class="newsletter">
        <h4>Study tips, monthly</h4>
        <p style="font-size:13.5px;margin-bottom:14px">Exam strategies and free resources. No spam, unsubscribe anytime.</p>
        <input type="email" placeholder="Your email address" aria-label="Email for newsletter">
        <button class="btn btn-teal btn-sm" onclick="miniLead(this,'newsletter','You\\'re subscribed! First issue lands this month.')">Subscribe</button>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 Whiz Tutoring (Pty) Ltd · Cape Town, South Africa</span>
      <span><a href="/sitemap.xml" style="color:inherit">Sitemap</a> · <a href="#" style="color:inherit">Privacy Policy</a> · <a href="#" style="color:inherit">Terms</a></span>
    </div>
  </div>
</footer>`;
}

// Booking modal (full enquiry form), sticky bar, exit popup, WhatsApp float, toast
function chromeHTML() {
  return `<a class="wa-float" href="https://wa.me/${SITE.whatsapp}?text=Hi%20Whiz%20Tutoring!%20I\u2019d%20like%20to%20enquire%20about%20a%20tutor." target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${WA_SVG}</a>

<div class="sticky-book">
  <a class="btn btn-ghost" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
  <button class="btn btn-primary" onclick="openBooking()">Book a Tutor</button>
</div>

<div class="modal-bg" id="bookModal" role="dialog" aria-modal="true" aria-labelledby="bookTitle">
  <div class="modal">
    <button class="modal-close" onclick="closeBooking()" aria-label="Close">✕</button>
    <h3 id="bookTitle">Book a Tutor</h3>
    <p class="sub">Half-price trial lesson · we reply within 24 hours · no payment now.</p>
    <form data-lead="booking" novalidate>
      <div class="hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
      <div class="form-grid">
        <div class="field"><label for="f_student">Student name *</label><input id="f_student" name="student" type="text" required autocomplete="name"><span class="err-msg"></span></div>
        <div class="field"><label for="f_parent">Parent name (if applicable)</label><input id="f_parent" name="parent" type="text"></div>
        <div class="field"><label for="f_email">Email address *</label><input id="f_email" name="email" type="email" required autocomplete="email"><span class="err-msg"></span></div>
        <div class="field"><label for="f_phone">Phone number *</label><input id="f_phone" name="phone" type="tel" required autocomplete="tel"><span class="err-msg"></span></div>
        <div class="field"><label for="f_wa">WhatsApp number</label><input id="f_wa" name="whatsapp" type="tel" placeholder="If different from phone"></div>
        <div class="field"><label for="f_grade">Grade *</label><select id="f_grade" name="grade" required><option value="">Select grade…</option><option>Grade 1–3</option><option>Grade 4–7</option><option>Grade 8–9</option><option>Grade 10</option><option>Grade 11</option><option>Matric (Grade 12)</option><option>IGCSE / AS / A-Level</option><option>IB</option><option>University</option></select><span class="err-msg"></span></div>
        <div class="field"><label for="f_school">School</label><input id="f_school" name="school" type="text" placeholder="e.g. Westerford High"></div>
        <div class="field"><label for="f_subject">Subject(s) *</label><select id="f_subject" name="subject" required><option value="">Select subject…</option><option>Mathematics</option><option>Physical Sciences</option><option>English</option><option>Accounting</option><option>Afrikaans</option><option>Life Sciences / Biology</option><option>Economics</option><option>Programming / IT</option><option>Engineering (university)</option><option>Multiple / other</option></select><span class="err-msg"></span></div>
        <div class="field full"><span class="field label" style="font:600 14px var(--font-body)">Preferred lesson type *</span>
          <div class="radio-cards">
            <label><input type="radio" name="lesson_type" value="Online" checked> 💻 Online</label>
            <label><input type="radio" name="lesson_type" value="In person"> 🏠 In person</label>
          </div>
        </div>
        <div class="field"><label for="f_area">Area / suburb (Cape Town)</label><select id="f_area" name="area"><option value="">Select area (if in person)…</option>${SUBURBS.map(s => `<option>${s.name}</option>`).join('')}<option>Other Cape Town</option><option>Outside Cape Town (online)</option></select></div>
        <div class="field"><label for="f_days">Preferred days</label><input id="f_days" name="preferred_days" type="text" placeholder="e.g. Tue & Thu"></div>
        <div class="field"><label for="f_times">Preferred times</label><input id="f_times" name="preferred_times" type="text" placeholder="e.g. after 16:00"></div>
        <div class="field full"><label for="f_notes">Additional notes</label><textarea id="f_notes" name="notes" placeholder="Goals, current marks, anything that helps us match well…"></textarea></div>
      </div>
      <button class="btn btn-primary btn-lg" type="submit" style="width:100%;margin-top:22px">Send enquiry</button>
      <p class="form-note">Protected against spam. By sending, you agree to be contacted about your enquiry. We never share your details.</p>
      <div class="form-success" style="display:none;text-align:center;padding:26px 0">
        <div class="tick" style="width:70px;height:70px;border-radius:50%;background:var(--teal-tint);color:var(--teal);display:grid;place-items:center;margin:0 auto 18px"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 13l5 5L20 6"/></svg></div>
        <h3>Thank you!</h3>
        <p style="color:var(--slate)">We'll contact you within 24 hours to match you with the perfect tutor. A confirmation email is on its way to you.</p>
      </div>
    </form>
  </div>
</div>

<div class="modal-bg exit-pop" id="exitPop" role="dialog" aria-modal="true" aria-label="Free consultation offer">
  <div class="modal">
    <button class="modal-close" onclick="closeExit()" aria-label="Close">✕</button>
    <div class="gift">🎁</div>
    <h3>Before you go — free consultation?</h3>
    <p class="sub" style="margin-bottom:18px">Leave your number and an education coordinator will call you back with honest, no-pressure advice on the right tutoring plan.</p>
    <form onsubmit="event.preventDefault();miniLead(this.querySelector('button'),'callback','Thanks! We\\'ll call you back within one business day.');closeExit();">
      <div class="field"><label for="cbPhone" class="sr-only" style="position:absolute;left:-9999px">Phone number</label><input id="cbPhone" type="tel" placeholder="Your phone number" style="border:1.5px solid var(--line);border-radius:12px;padding:14px;width:100%;font:400 15px var(--font-body)"></div>
      <button class="btn btn-primary" type="submit" style="width:100%;margin-top:14px">Request my free call-back</button>
    </form>
    <p class="form-note" style="text-align:center">Or <a href="https://wa.me/${SITE.whatsapp}" style="color:var(--blue)">WhatsApp us</a> right now.</p>
  </div>
</div>

<div class="toast" id="toast">${TICK}<span id="toastMsg"></span></div>`;
}

// ---------- shared blocks ----------
const statsBlock = `
<div class="container reveal">
  <div class="stats" id="statsBand">
    <div class="stat"><b><span class="count" data-to="5000">0</span><em>+</em></b><span>Lessons completed</span></div>
    <div class="stat"><b><span class="count" data-to="95">0</span><em>%</em></b><span>Student satisfaction</span></div>
    <div class="stat"><b><span class="count" data-to="300">0</span><em>+</em></b><span>Qualified tutors</span></div>
    <div class="stat"><b><span class="count" data-to="9">0</span><em> yrs</em></b><span>Helping students succeed</span></div>
  </div>
</div>`;

const trustStrip = `
<section class="trusted reveal" aria-label="Trust signals">
  <div class="container">
    <p>Carefully screened tutors · background checked · from South Africa's top universities</p>
    <div class="logo-row">
      <span>◆ UCT</span><span>◆ Stellenbosch</span><span>◆ Wits</span><span>◆ UP</span><span>◆ UJ</span>
      <span>SACS <i>·</i></span><span>Bishops <i>·</i></span><span>Rondebosch <i>·</i></span><span>Westerford</span>
    </div>
  </div>
</section>`;

function reviewsBlock(h2 = 'What Cape Town parents say on Google') {
  return `
<section class="section gray-band" aria-labelledby="rev-h">
  <div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">Google reviews</span>
      <h2 id="rev-h">${h2}</h2>
    </div>
    <div class="gr-head reveal">
      <div class="gr-score">
        <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6c-.3 1.4-1 2.6-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.4z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.6H2.1v2.9C4 20.4 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.8 14c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V6.9H2.1C1.4 8.4 1 10.1 1 11.9s.4 3.5 1.1 5l3.7-2.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 4 3.6 2.1 7.3L5.8 10c.9-2.7 3.3-4.6 6.2-4.6z"/></svg>
        <div><span class="num" id="grNum">${SITE.rating}</span> <span class="stars" aria-hidden="true">★★★★★</span><div class="sub" id="grCount">${SITE.reviewCount}+ Google reviews</div></div>
      </div>
    </div>
    <div class="gr-track reveal" id="grTrack">
      ${SEED_REVIEWS.map(r => `<div class="card review-card gr-card">
        <svg class="g-ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6c-.3 1.4-1 2.6-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.4z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.6H2.1v2.9C4 20.4 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.8 14c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V6.9H2.1C1.4 8.4 1 10.1 1 11.9s.4 3.5 1.1 5l3.7-2.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 4 3.6 2.1 7.3L5.8 10c.9-2.7 3.3-4.6 6.2-4.6z"/></svg>
        <span class="stars" aria-label="${r.rating} star review">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
        <p>\u201C${r.text}\u201D</p>
        <div class="who"><div><b>${r.author}</b><span class="when">${r.when} · Google</span></div></div>
      </div>`).join('')}
    </div>
    <p class="gr-note" id="grNote">Reviews refresh automatically from our Google Business Profile.</p>
    <div class="gr-actions reveal">
      <a class="btn btn-ghost btn-sm" href="${SITE.googleMapsUrl}" target="_blank" rel="noopener">Read more reviews on Google</a>
      <a class="btn btn-teal btn-sm" href="${SITE.googleReviewUrl}" target="_blank" rel="noopener">Leave a review</a>
    </div>
  </div>
</section>`;
}

function ctaBlock(h = 'Ready to start?', p = 'Find the perfect tutor today. Your first lesson is a half-price trial — if it\u2019s not a great fit, we\u2019ll rematch you free of charge.') {
  return `
<section class="section tight"><div class="container reveal"><div class="final-cta">
  <h2>${h}</h2><p>${p}</p>
  <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative">
    <button class="btn btn-lg btn-gold" onclick="openBooking()">Book a Tutor</button>
    <a class="btn btn-lg ghost-w" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">Chat on WhatsApp</a>
  </div>
</div></div></section>`;
}

const magnetBlock = `
<section class="section tight"><div class="container reveal">
  <div class="magnet">
    <div class="doc">📗</div>
    <div>
      <h3 style="font-size:21px">Free download: The Matric Study Planner (2026 edition)</h3>
      <p style="color:var(--slate);font-size:15px;margin-top:6px">Our tutors' week-by-week revision template mapped to the NSC exam timetable — the same one we use with paying students.</p>
    </div>
    <form onsubmit="event.preventDefault();miniLead(this.querySelector('button'),'study_guide_download','Check your inbox — the planner is on its way!')" style="display:flex;gap:10px;flex-wrap:wrap">
      <input type="email" placeholder="Email for the free guide" aria-label="Email for free study guide" style="border:1.5px solid var(--line);border-radius:999px;padding:13px 20px;font:400 14.5px var(--font-body);min-width:230px">
      <button class="btn btn-primary btn-sm" type="submit">Send it to me</button>
    </form>
  </div>
</div></section>`;

function callbackBlock() {
  return `
<section class="section tight"><div class="container reveal">
  <div class="callback">
    <div>
      <h3 style="font-size:22px">Prefer to talk it through?</h3>
      <p style="color:var(--slate);font-size:15.5px;margin-top:6px">Leave your number and an education coordinator will call you back — honest advice, no pressure.</p>
    </div>
    <form onsubmit="event.preventDefault();miniLead(this.querySelector('button'),'callback','Thanks! We\\'ll call you back within one business day.')">
      <input type="tel" placeholder="Your phone number" aria-label="Phone number for call back">
      <button class="btn btn-primary" type="submit">Request a call back</button>
    </form>
  </div>
</div></section>`;
}

function pageHero(eyebrow, h1, lead, crumbs) {
  return `<header class="page-hero"><div class="container">
    ${crumbs ? `<nav class="breadcrumb" aria-label="Breadcrumb">${crumbs}</nav>` : ''}
    <span class="eyebrow">${eyebrow}</span>
    <h1 style="font-size:clamp(32px,4.2vw,50px)">${h1}</h1>
    <p class="lead">${lead}</p>
  </div></header>`;
}

const write = (rel, html) => {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};

// ============ HOME ============
{
  const body = `
<header class="hero">
  <div class="container hero-grid">
    <div>
      <span class="hero-badge"><span class="dot"></span> Trusted by 1,200+ families in Cape Town & beyond</span>
      <h1>Cape Town's top <span class="hl">private tutors<svg viewBox="0 0 320 24" aria-hidden="true"><path d="M6 16 C 80 8, 160 20, 314 10"/></svg></span> — at your home or online</h1>
      <p class="lead">Personalized one-on-one tutoring from carefully selected tutors at South Africa's leading universities. Every subject, Grades 4 to university — matched to how your child learns.</p>
      <div class="hero-ctas">
        <button class="btn btn-primary btn-lg" onclick="openBooking()">Book a Tutor ${ARROW}</button>
        <a class="btn btn-ghost btn-lg" href="/become-a-tutor/">Become a Tutor</a>
      </div>
      <div class="hero-proof">
        <div class="avatar-row" aria-hidden="true">
          <span class="av" style="background:#0B5FFF">TM</span><span class="av" style="background:#00BFA6">LK</span>
          <span class="av" style="background:#FFB000;color:#1B1F24">SN</span><span class="av" style="background:#6C4CF1">JP</span>
        </div>
        <div><span class="stars" aria-label="4.9 out of 5 star Google rating">★★★★★</span><br>${SITE.rating} on Google · ${SITE.reviewCount}+ reviews</div>
      </div>
    </div>
    <div class="hero-visual" aria-hidden="true">
      <div class="lesson-card lc-main">
        <div class="lc-head">
          <div class="lc-avatar" style="background:linear-gradient(135deg,#0B5FFF,#2E7BFF)">TN</div>
          <div><div class="lc-name">Thandi N. — UCT</div><div class="lc-sub">Mathematics · Grade 11</div></div>
          <span class="lc-live">● Live lesson</span>
        </div>
        <div class="lc-board">
          <div class="eq">Solve: x² − 5x + 6 = 0</div>
          <div class="step"><b>✓</b> Factorise: (x − 2)(x − 3) = 0</div>
          <div class="step"><b>✓</b> So x = 2 or x = 3 — well done!</div>
        </div>
        <div class="lc-tags"><span class="chip">Past papers</span><span class="chip" style="background:var(--teal-tint);color:#00806F">Exam technique</span><span class="chip" style="background:var(--gold-tint);color:#9A6A00">Step-by-step</span></div>
      </div>
      <div class="lesson-card lc-grade">
        <div class="grade-ring" id="gradeRing"><svg width="58" height="58" viewBox="0 0 58 58" fill="none"><circle class="track" cx="29" cy="29" r="24" stroke-width="6"/><circle class="fill" cx="29" cy="29" r="24" stroke-width="6"/></svg><b>81%</b></div>
        <div class="txt"><b>Term result</b><span>52% → 81% · <span class="up">+29</span></span></div>
      </div>
      <div class="lesson-card lc-next"><div class="cal">📅</div><div><b>Next lesson booked</b><span>Thursday · 16:00 · Claremont</span></div></div>
    </div>
  </div>
</header>
${trustStrip}
${statsBlock}
<section class="section" aria-labelledby="subj-h"><div class="container">
  <div class="section-head reveal"><span class="eyebrow">Subjects</span><h2 id="subj-h">Expert tutoring in every subject that matters</h2>
  <p class="lead">From foundation phase to matric, IEB, Cambridge and first-year university — taught by tutors who aced it themselves.</p></div>
  <div class="grid g3">
    ${SUBJECT_CARDS.map(s => `<a class="card subject-card reveal" href="${s.link}">
      <div class="icon" style="background:${s.bg}">${s.icon}</div><h3>${s.name}</h3><p>${s.desc}</p>
      <span class="go">Find a tutor ${ARROW}</span></a>`).join('')}
  </div>
</div></section>
<section class="section gray-band" aria-labelledby="why-h"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">Why Whiz</span><h2 id="why-h">Tutoring that treats your child as a person, not a timeslot</h2></div>
  <div class="grid g3">
    ${[
      ['M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z', 'Carefully screened tutors', 'Subject tests, teaching demos, interviews and background checks. Fewer than 1 in 8 applicants join.'],
      ['M12 2l2.4 5.3 5.6.6-4.2 3.9 1.2 5.6L12 14.8 7 17.4l1.2-5.6L4 7.9l5.6-.6L12 2z', 'Top university students & graduates', 'Tutors from UCT, Stellenbosch, Wits, UP and UJ who recently aced the exact work your child is doing.'],
      ['M4 6h16M4 12h16M4 18h10', 'Online and in-person lessons', 'Interactive online whiteboard lessons nationwide, or face-to-face at your Cape Town home.'],
      ['M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', 'Flexible scheduling', 'Evenings, weekends and exam-season intensives. Reschedule free with 24 hours\u2019 notice.'],
      ['M3 17l6-6 4 4 8-8M14 7h7v7', 'Progress tracking', 'A short report after every lesson and a full term review — parents always know where things stand.'],
      ['M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', 'Fair, transparent pricing', 'From R280/hour with no signup fees or contracts. Your first lesson is a half-price trial.']
    ].map(w => `<div class="card feature-card reveal"><div class="fc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${w[0]}"/></svg></div><h3>${w[1]}</h3><p>${w[2]}</p></div>`).join('')}
  </div>
</div></section>
<section class="section" aria-labelledby="how-h"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">How it works</span><h2 id="how-h">From struggling to <span class="hl">confident<svg viewBox="0 0 320 24" aria-hidden="true"><path d="M6 16 C 80 8, 160 20, 314 10"/></svg></span> in three steps</h2></div>
  <div class="steps reveal">
    <div class="step-card"><h3>Tell us what you need</h3><p>Send a two-minute enquiry: subject, grade, goals and how your child learns best.</p><span class="arrow">${ARROW.replace('viewBox', 'width="16" height="16" viewBox')}</span></div>
    <div class="step-card"><h3>Get matched with the perfect tutor</h3><p>We hand-pick a screened tutor whose personality and teaching style fit — usually within 24 hours.</p><span class="arrow">${ARROW.replace('viewBox', 'width="16" height="16" viewBox')}</span></div>
    <div class="step-card"><h3>Start improving your grades</h3><p>Book a half-price trial lesson, track progress after every session, and watch marks — and confidence — climb.</p><span class="arrow"></span></div>
  </div>
  <div style="text-align:center;margin-top:44px" class="reveal"><button class="btn btn-primary btn-lg" onclick="openBooking()">Start with a trial lesson</button></div>
</div></section>
<section class="section gray-band" aria-labelledby="stories-h"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">Success stories</span><h2 id="stories-h">Real students. Real results.</h2></div>
  <div class="carousel reveal">
    <button class="car-btn prev" aria-label="Previous story" onclick="moveSlide(-1)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></button>
    <div class="slides"><div class="slide-track" id="slideTrack">
      ${STORIES.map(s => `<div class="slide">
        <div class="slide-visual">
          <div class="big-av" style="background:linear-gradient(135deg,${s.c},${s.c}BB)">${s.ini}</div>
          <div class="lift"><span class="from">${s.from}</span>${ARROW.replace('viewBox', 'width="15" height="15" viewBox')}<span class="to">${s.to}</span></div>
          <span class="chip" style="background:#fff;border:1px solid var(--line)">${s.subj}</span>
        </div>
        <div class="slide-body"><blockquote>${s.quote}</blockquote><div class="slide-who"><b>${s.name}</b> · ${s.who}</div></div>
      </div>`).join('')}
    </div></div>
    <button class="car-btn next" aria-label="Next story" onclick="moveSlide(1)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="car-nav">${STORIES.map((_, i) => `<button class="car-dot${i === 0 ? ' on' : ''}" aria-label="Story ${i + 1}" onclick="goSlide(${i})"></button>`).join('')}</div>
  </div>
</div></section>
${reviewsBlock()}
${magnetBlock}
<section class="section" aria-labelledby="faq-h"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">FAQ</span><h2 id="faq-h">Questions Cape Town parents ask us</h2></div>
  <div class="faq reveal">${FAQS.map(f => `<details class="faq-item"><summary>${f.q}<span class="pm">+</span></summary><div class="faq-a">${f.a}</div></details>`).join('')}</div>
</div></section>
${callbackBlock()}
${ctaBlock()}`;
  write('index.html', layout({
    title: 'Private Tutors Cape Town | Maths, Science & More — Whiz Tutoring',
    desc: 'Top-rated private tutors in Cape Town & online across South Africa. Screened tutors from UCT & Stellenbosch for maths, physics, English & every subject. Half-price trial lesson.',
    canonical: '/', body,
    schemas: [faqSchema, ...reviewsSchema]
  }));
}

// ============ SUBJECT LANDING PAGES ============
for (const p of SUBJECT_PAGES) {
  const related = SUBJECT_PAGES.filter(x => x.slug !== p.slug).slice(0, 6);
  const body = `
${pageHero(p.eyebrow, p.h1, p.lead, `<a href="/">Home</a> / <a href="/subjects/">Subjects</a> / <span>${p.kw}</span>`)}
<section class="section tight"><div class="container landing-two">
  <div>
    <h2 style="font-size:27px">${p.subhead}</h2>
    <ul class="check-list">${p.points.map(pt => `<li>${TICK}<span>${pt}</span></li>`).join('')}</ul>
    <p style="color:var(--slate);font-size:16px;margin:6px 0 26px">${p.body}</p>
    <div class="card" style="background:var(--teal-tint);border-color:#BDEDE4;padding:24px 26px;display:flex;gap:16px;align-items:center">
      <div class="grade-ring go" style="flex-shrink:0"><svg width="58" height="58" viewBox="0 0 58 58" fill="none"><circle class="track" cx="29" cy="29" r="24" stroke-width="6"/><circle class="fill" cx="29" cy="29" r="24" stroke-width="6" style="stroke-dashoffset:29"/></svg><b>+18</b></div>
      <p style="font-size:15px;color:#00695C"><b style="font-family:var(--font-display)">Average improvement:</b> 18 percentage points within two terms of weekly lessons.</p>
    </div>
  </div>
  <div>
    <div class="form-card">
      <h3 style="font-size:21px;margin-bottom:6px">Request a free tutor match</h3>
      <p style="color:var(--slate);font-size:14.5px;margin-bottom:20px">We'll send 2–3 hand-picked tutor profiles within 24 hours.</p>
      <form data-lead="quick_match" novalidate>
        <div class="hp" aria-hidden="true"><label>Leave empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
        <input type="hidden" name="subject" value="${p.kw}">
        <div class="form-grid" style="grid-template-columns:1fr">
          <div class="field"><label for="q_name">Your name *</label><input id="q_name" name="student" type="text" required><span class="err-msg"></span></div>
          <div class="field"><label for="q_email">Email *</label><input id="q_email" name="email" type="email" required><span class="err-msg"></span></div>
          <div class="field"><label for="q_phone">WhatsApp number *</label><input id="q_phone" name="phone" type="tel" required><span class="err-msg"></span></div>
        </div>
        <button class="btn btn-primary" type="submit" style="width:100%;margin-top:20px">Get matched</button>
        <p class="form-note">Or use the full <a href="#" onclick="event.preventDefault();openBooking('${p.subject.replace(/'/g, '')}')" style="color:var(--blue)">booking form</a>.</p>
        <div class="form-success" style="display:none;text-align:center;padding:16px 0"><h3 style="font-size:19px">Request sent! ✓</h3><p style="color:var(--slate);font-size:14.5px">We'll contact you within 24 hours. A confirmation email is on its way.</p></div>
      </form>
    </div>
    <div style="margin-top:26px">
      <b style="font:700 13px var(--font-display);text-transform:uppercase;letter-spacing:.08em;color:var(--mist)">Related searches</b>
      <div class="seo-links" style="margin-top:12px">${related.map(r => `<a href="/${r.slug}/">${r.kw}</a>`).join('')}</div>
    </div>
  </div>
</div></section>
${reviewsBlock('Rated ' + SITE.rating + ' by Cape Town families')}
${ctaBlock('Find your ' + p.kw.toLowerCase() + ' today', 'Half-price trial lesson · matched within 24 hours · free rematch if the fit isn\u2019t right.')}`;
  write(`${p.slug}/index.html`, layout({
    title: p.title + ' — Whiz Tutoring',
    desc: p.metaDesc,
    canonical: `/${p.slug}/`, body,
    schemas: [
      breadcrumb([['Home', '/'], ['Subjects', '/subjects/'], [p.kw, `/${p.slug}/`]]),
      { '@context': 'https://schema.org', '@type': 'Service', name: p.kw, provider: { '@id': SITE.domain + '/#organization' }, areaServed: 'Cape Town, South Africa', serviceType: 'Tutoring', description: p.metaDesc }
    ]
  }));
}

// ============ SUBJECTS INDEX ============
write('subjects/index.html', layout({
  title: 'Tutoring Subjects Cape Town | Maths, Science, English & More — Whiz Tutoring',
  desc: 'Browse every subject we tutor in Cape Town & online: mathematics, physical sciences, English, accounting, Cambridge/IGCSE, matric and university-level.',
  canonical: '/subjects/',
  schemas: [breadcrumb([['Home', '/'], ['Subjects', '/subjects/']])],
  body: `
${pageHero('Subjects', 'Every subject, taught properly', 'CAPS, IEB, Cambridge (IGCSE, AS & A-Level), IB and first-year university — in person across Cape Town or online anywhere.', '<a href="/">Home</a> / <span>Subjects</span>')}
<section class="section tight"><div class="container">
  <div class="grid g3">${SUBJECT_CARDS.map(s => `<a class="card subject-card" href="${s.link}"><div class="icon" style="background:${s.bg}">${s.icon}</div><h3>${s.name}</h3><p>${s.desc}</p><span class="go">View tutoring ${ARROW}</span></a>`).join('')}</div>
  <div class="section-head" style="margin:72px 0 22px"><span class="eyebrow">Popular searches</span><h2 style="font-size:26px">Dedicated tutoring pages</h2></div>
  <div class="seo-links">${SUBJECT_PAGES.map(p => `<a href="/${p.slug}/">${p.kw}</a>`).join('')}</div>
</div></section>
${ctaBlock()}` }));

// ============ AREAS INDEX + SUBURB PAGES ============
write('areas/index.html', layout({
  title: 'Tutoring Areas in Cape Town | Home & Online Tutors by Suburb — Whiz Tutoring',
  desc: 'Home tutoring across Cape Town: Claremont, Rondebosch, Newlands, Constantia, Camps Bay, Durbanville, Somerset West and more. Online tutoring everywhere.',
  canonical: '/areas/',
  schemas: [breadcrumb([['Home', '/'], ['Areas', '/areas/']])],
  body: `
${pageHero('Areas we serve', 'Home tutoring across Cape Town', 'In-person tutors in the Southern Suburbs, Atlantic Seaboard, Northern Suburbs and Helderberg — plus online lessons anywhere in South Africa and Zambia.', '<a href="/">Home</a> / <span>Areas</span>')}
<section class="section tight"><div class="container">
  ${['Southern Suburbs', 'Atlantic Seaboard', 'Northern Suburbs', 'Helderberg'].map(region => {
    const list = SUBURBS.filter(s => s.region === region);
    return list.length ? `<h2 style="font-size:24px;margin:34px 0 16px">${region}</h2>
    <div class="area-grid">${list.map(s => `<a href="/areas/${s.slug}/">${s.name} ${ARROW.replace('viewBox', 'width="15" height="15" viewBox')}</a>`).join('')}</div>` : '';
  }).join('')}
  <div class="card" style="margin-top:44px;padding:28px 32px;background:var(--blue-tint);border-color:#D6E4FF">
    <h3 style="font-size:19px">Not in one of these areas?</h3>
    <p style="color:var(--slate);font-size:15px;margin-top:6px">Our <a href="/online-tutor-south-africa/" style="color:var(--blue);font-weight:600">online tutoring</a> reaches every town in South Africa — and families in Zambia — with the same screened tutors and interactive whiteboard lessons.</p>
  </div>
</div></section>
${ctaBlock()}` }));

for (const s of SUBURBS) {
  const others = SUBURBS.filter(x => x.slug !== s.slug && x.region === s.region);
  const body = `
${pageHero('Tutors in ' + s.name, `Private Tutors in ${s.name}, Cape Town`, `Screened home tutors in ${s.name} for maths, sciences, English, accounting and more — plus online lessons for total flexibility.`, `<a href="/">Home</a> / <a href="/areas/">Areas</a> / <span>${s.name}</span>`)}
<section class="section tight"><div class="container landing-two">
  <div>
    <h2 style="font-size:26px">Tutoring in ${s.name}</h2>
    <p style="color:var(--slate);font-size:16px;margin-top:14px">${s.blurb}</p>
    <h3 style="margin-top:30px;font-size:19px">Schools we serve near ${s.name}</h3>
    <div class="school-chips">${s.schools.map(sc => `<span>${sc}</span>`).join('')}</div>
    <h3 style="margin-top:30px;font-size:19px">Available in ${s.name}</h3>
    <ul class="check-list">
      <li>${TICK}<span><b>Home tutoring</b> — a screened, background-checked tutor at your home</span></li>
      <li>${TICK}<span><b>Online tutoring</b> — interactive whiteboard lessons, recorded on request</span></li>
      <li>${TICK}<span><b>All subjects</b> — maths, physical sciences, English, accounting, languages and more</span></li>
      <li>${TICK}<span><b>All curricula</b> — CAPS, IEB, Cambridge and IB</span></li>
      <li>${TICK}<span><b>Grades 4 to university</b>, including matric intensives</span></li>
    </ul>
    ${others.length ? `<h3 style="margin-top:26px;font-size:17px">Nearby areas</h3><div class="seo-links" style="margin-top:12px">${others.map(o => `<a href="/areas/${o.slug}/">Tutors in ${o.name}</a>`).join('')}</div>` : ''}
  </div>
  <div>
    <div class="form-card">
      <h3 style="font-size:21px;margin-bottom:6px">Find a tutor in ${s.name}</h3>
      <p style="color:var(--slate);font-size:14.5px;margin-bottom:20px">Tell us what you need — we'll match you within 24 hours.</p>
      <form data-lead="area_enquiry" novalidate>
        <div class="hp" aria-hidden="true"><label>Leave empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
        <input type="hidden" name="area" value="${s.name}">
        <div class="form-grid" style="grid-template-columns:1fr">
          <div class="field"><label for="a_name">Your name *</label><input id="a_name" name="student" type="text" required><span class="err-msg"></span></div>
          <div class="field"><label for="a_email">Email *</label><input id="a_email" name="email" type="email" required><span class="err-msg"></span></div>
          <div class="field"><label for="a_phone">WhatsApp number *</label><input id="a_phone" name="phone" type="tel" required><span class="err-msg"></span></div>
          <div class="field"><label for="a_subj">Subject *</label><select id="a_subj" name="subject" required><option value="">Select…</option><option>Mathematics</option><option>Physical Sciences</option><option>English</option><option>Accounting</option><option>Other / multiple</option></select><span class="err-msg"></span></div>
        </div>
        <button class="btn btn-primary" type="submit" style="width:100%;margin-top:20px">Get matched in ${s.name}</button>
        <div class="form-success" style="display:none;text-align:center;padding:16px 0"><h3 style="font-size:19px">Request sent! ✓</h3><p style="color:var(--slate);font-size:14.5px">We'll contact you within 24 hours.</p></div>
      </form>
    </div>
  </div>
</div></section>
${reviewsBlock('What families in the ' + s.region + ' say')}
${ctaBlock('Ready for a tutor in ' + s.name + '?')}`;
  write(`areas/${s.slug}/index.html`, layout({
    title: `Private Tutors in ${s.name}, Cape Town | Home & Online — Whiz Tutoring`,
    desc: `Screened private tutors in ${s.name} for maths, science, English & more. Home tutoring & online lessons for learners at ${s.schools[0]} and nearby schools. Book a trial.`,
    canonical: `/areas/${s.slug}/`, body,
    schemas: [
      breadcrumb([['Home', '/'], ['Areas', '/areas/'], [s.name, `/areas/${s.slug}/`]]),
      { '@context': 'https://schema.org', '@type': 'Service', name: `Private tutoring in ${s.name}`, provider: { '@id': SITE.domain + '/#organization' }, areaServed: { '@type': 'Place', name: `${s.name}, Cape Town, South Africa` }, serviceType: 'Tutoring' }
    ]
  }));
}

// ============ TUTORS ============
write('tutors/index.html', layout({
  title: 'Our Tutors | Screened UCT & Stellenbosch Tutors — Whiz Tutoring',
  desc: 'Meet Whiz Tutoring\u2019s carefully screened tutors from UCT, Stellenbosch, Wits, UP & UJ. Subject-tested, interview-vetted and background-checked.',
  canonical: '/tutors/',
  schemas: [breadcrumb([['Home', '/'], ['Tutors', '/tutors/']])],
  body: `
${pageHero('Our tutors', 'Carefully screened. Genuinely brilliant.', 'Top students and graduates from UCT, Stellenbosch, Wits, UP and UJ. Subject-tested, interview-vetted and background-checked before they meet a single student.', '<a href="/">Home</a> / <span>Tutors</span>')}
<section class="section tight"><div class="container">
  <div class="grid g3">${TUTORS.map(t => `<div class="card tutor-card">
    <div class="tutor-top"><div class="tutor-photo" style="background:linear-gradient(135deg,${t.c},${t.c}CC)">${t.ini}</div>
    <div><h3>${t.name}</h3><div class="uni">${t.uni}</div><div class="deg">${t.deg}</div></div></div>
    <div class="tutor-body">
      <div class="tutor-meta"><span><b>${t.yrs} yrs</b> tutoring</span><span><b>${t.lessons}+</b> lessons</span><span class="stars">★ 4.9</span></div>
      <div class="tutor-tags">${t.subs.map(x => `<span class="chip">${x}</span>`).join('')}</div>
      <button class="btn btn-ghost btn-sm" onclick="openBooking('${t.subs[0]}')">Book with ${t.name.split(' ')[0]}</button>
    </div></div>`).join('')}</div>
  <p style="text-align:center;color:var(--slate);margin-top:40px">These are a few of our 300+ tutors. Send an enquiry and we'll match the right one to you.</p>
</div></section>
${callbackBlock()}
${ctaBlock()}` }));

// ============ PRICING ============
{
  const tick = TICK.replace('viewBox', 'width="18" height="18" viewBox');
  write('pricing/index.html', layout({
    title: 'Tutoring Prices Cape Town 2026 | From R280/hour — Whiz Tutoring',
    desc: 'Transparent tutoring prices in Cape Town: from R280/hour on term packages, R320/hour pay-as-you-go, R395/hour matric intensive. No signup fees. Half-price trial.',
    canonical: '/pricing/',
    schemas: [breadcrumb([['Home', '/'], ['Pricing', '/pricing/']])],
    body: `
${pageHero('Pricing', 'Simple, honest pricing', 'No signup fees, no contracts. Pay per lesson or save with a package. All prices include tutor matching, progress reports and rescheduling.', '<a href="/">Home</a> / <span>Pricing</span>')}
<section class="section tight"><div class="container">
  <div class="price-grid">
    <div class="card price-card"><h3>Pay as you go</h3><div class="amt">R320<small>/hr</small></div><div class="per">Billed per lesson · online</div>
      <ul><li>${tick}One-on-one online lessons</li><li>${tick}Matched, screened tutor</li><li>${tick}Lesson notes after every session</li><li>${tick}Free cancellation (24h notice)</li></ul>
      <button class="btn btn-ghost" onclick="openBooking()">Book a lesson</button></div>
    <div class="card price-card featured"><span class="pop">Most popular</span><h3>Term package</h3><div class="amt">R280<small>/hr</small></div><div class="per">10-lesson pack · online or in person</div>
      <ul><li>${tick}Everything in Pay as you go</li><li>${tick}Same tutor, same weekly slot</li><li>${tick}Term progress report for parents</li><li>${tick}Past-paper & exam-prep bank</li><li>${tick}WhatsApp homework support</li></ul>
      <button class="btn btn-primary" onclick="openBooking()">Start with a trial lesson</button></div>
    <div class="card price-card"><h3>Matric intensive</h3><div class="amt">R395<small>/hr</small></div><div class="per">Grade 11–12 & exam season</div>
      <ul><li>${tick}Senior specialist tutors</li><li>${tick}Structured exam-prep syllabus</li><li>${tick}Marked mock papers with feedback</li><li>${tick}University application guidance</li></ul>
      <button class="btn btn-ghost" onclick="openBooking()">Book a lesson</button></div>
  </div>
  <p style="text-align:center;color:var(--mist);font-size:14px;margin-top:34px">Trial lessons are 50% off your first hour. In-person lessons carry a small travel supplement depending on area. Sibling discounts available.</p>
</div></section>
${reviewsBlock()}
${ctaBlock()}` }));
}

// ============ ABOUT ============
write('about/index.html', layout({
  title: 'About Whiz Tutoring | 9 Years of Tutoring Excellence in Cape Town',
  desc: 'Whiz Tutoring: founded in Cape Town in 2017, now 300+ screened university tutors, 5,000+ lessons and a 95% satisfaction rate across SA and Zambia.',
  canonical: '/about/',
  schemas: [breadcrumb([['Home', '/'], ['About', '/about/']])],
  body: `
${pageHero('About us', 'Nine years of turning \u201CI can\u2019t\u201D into \u201CI did\u201D', 'Whiz Tutoring was started by university students who remembered exactly what it felt like to sit in class, lost, too shy to ask. We built the tutoring company we wished we\u2019d had.', '<a href="/">Home</a> / <span>About</span>')}
${statsBlock}
<section class="section tight"><div class="container landing-two">
  <div>
    <span class="eyebrow">Our mission</span>
    <h2 style="font-size:29px">Great teaching shouldn't depend on which school you attend</h2>
    <p style="color:var(--slate);margin-top:16px">We pair learners across Cape Town — and increasingly the rest of South Africa and Zambia — with tutors from the country's leading universities. Not just people who know the work, but people who can explain it, encourage, and rebuild the confidence that struggling in a subject quietly erodes.</p>
    <div class="timeline">
      <div class="tl-item"><b>2017</b><p>Founded in Cape Town by three UCT students tutoring maths from a res common room.</p></div>
      <div class="tl-item"><b>2019</b><p>Expanded across the Cape Town metro; launched formal tutor screening and training.</p></div>
      <div class="tl-item"><b>2021</b><p>Went online nationwide. Lessons no longer limited by geography — or load-shedding schedules.</p></div>
      <div class="tl-item"><b>2024</b><p>Crossed 5,000 lessons and launched cross-border tutoring for families in Zambia.</p></div>
      <div class="tl-item"><b>Today</b><p>300+ tutors, a 95% satisfaction rate, and one unchanged rule: every learner gets a tutor we'd want for our own family.</p></div>
    </div>
  </div>
  <div class="value-list" style="grid-template-columns:1fr;align-content:start">
    <div class="card feature-card"><div class="fc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z"/></svg></div><h3>Rigour</h3><p>Fewer than 1 in 8 tutor applicants pass our subject tests, teaching demo and vetting.</p></div>
    <div class="card feature-card"><div class="fc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.5-9.5-9C.7 8.5 2.5 5 6 5c2.2 0 3.7 1.2 4.5 2.5h3C14.3 6.2 15.8 5 18 5c3.5 0 5.3 3.5 3.5 7-2.5 4.5-9.5 9-9.5 9z"/></svg></div><h3>Care</h3><p>Progress reports after every lesson, and a real human coordinator for every family.</p></div>
    <div class="card feature-card"><div class="fc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></svg></div><h3>Results</h3><p>Our average student improves 18 percentage points within two terms.</p></div>
    <div class="card feature-card"><div class="fc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4zM9 12l2 2 4-4"/></svg></div><h3>Child safety</h3><p>Background checks before any home placement, and clear conduct standards for every tutor.</p></div>
  </div>
</div></section>
${reviewsBlock()}
${ctaBlock()}` }));

// ============ BLOG ============
write('blog/index.html', layout({
  title: 'Study Tips & Education Blog | Whiz Tutoring Cape Town',
  desc: 'Study guides and honest education advice from Cape Town tutors: matric study tips, IEB & IGCSE preparation, Cambridge vs CAPS, physics mistakes and more.',
  canonical: '/blog/',
  schemas: [breadcrumb([['Home', '/'], ['Blog', '/blog/']])],
  body: `
${pageHero('Blog & resources', 'Study smarter, not just harder', 'Guides, exam strategies and honest advice for parents and students — written by our tutors.', '<a href="/">Home</a> / <span>Blog</span>')}
<section class="section tight"><div class="container">
  <div class="grid g3">${POSTS.map(p => `<a class="card post-card" href="/blog/${p.slug}/">
    <div class="post-thumb" style="background:${p.g}" aria-hidden="true">${p.icon}</div>
    <div class="post-body"><span class="cat">${p.cat}</span><h3>${p.title}</h3><p>${p.excerpt}</p><span class="meta">${p.read} · ${new Date(p.date).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}</span></div></a>`).join('')}</div>
</div></section>
${magnetBlock}
${ctaBlock()}` }));

POSTS.forEach((p, i) => {
  const next = POSTS[(i + 1) % POSTS.length];
  const body = `
<div style="padding-top:120px"></div>
<article class="article container">
  <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog/">Blog</a> / <span>${p.title}</span></nav>
  <header class="article-hero" style="background:${p.g}">
    <span class="cat">${p.cat}</span>
    <h1>${p.title}</h1>
    <div class="meta">By the Whiz Tutoring team · ${new Date(p.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} · ${p.read}</div>
  </header>
  <div class="article-body">${p.body}</div>
  <div class="card article-cta" style="background:var(--blue-tint);border-color:#D6E4FF;display:flex;gap:20px;align-items:center;flex-wrap:wrap;justify-content:space-between">
    <div><h3 style="font-size:19px">Want one-on-one help with this?</h3><p style="color:var(--slate);font-size:14.5px;margin-top:4px">Our screened Cape Town tutors cover exactly this — first lesson half price.</p></div>
    <button class="btn btn-primary" onclick="openBooking()">Book a Tutor</button>
  </div>
  <div class="post-nav">
    <a class="btn btn-ghost btn-sm" href="/blog/">← All articles</a>
    <a class="btn btn-ghost btn-sm" href="/blog/${next.slug}/">Next: ${next.title.length > 34 ? next.title.slice(0, 34) + '…' : next.title} →</a>
  </div>
</article>
${ctaBlock()}`;
  write(`blog/${p.slug}/index.html`, layout({
    title: p.title + ' — Whiz Tutoring Blog',
    desc: p.metaDesc,
    canonical: `/blog/${p.slug}/`, body, ogType: 'article',
    schemas: [
      breadcrumb([['Home', '/'], ['Blog', '/blog/'], [p.title, `/blog/${p.slug}/`]]),
      { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.metaDesc, datePublished: p.date, dateModified: p.date, author: { '@type': 'Organization', name: SITE.name }, publisher: { '@id': SITE.domain + '/#organization' }, mainEntityOfPage: SITE.domain + `/blog/${p.slug}/` }
    ]
  }));
});

// ============ CONTACT ============
write('contact/index.html', layout({
  title: 'Contact Whiz Tutoring | Book a Tutor in Cape Town',
  desc: 'Contact Whiz Tutoring: send a tutor enquiry, WhatsApp +27 60 000 0000, or email whiztutors@gmail.com. We match Cape Town families with tutors within 24 hours.',
  canonical: '/contact/',
  schemas: [breadcrumb([['Home', '/'], ['Contact', '/contact/']]), faqSchema],
  body: `
${pageHero('Contact', 'Let\u2019s find your perfect tutor', 'Send an enquiry and we\u2019ll match you within 24 hours — or reach us directly on WhatsApp, email or phone.', '<a href="/">Home</a> / <span>Contact</span>')}
<section class="section tight"><div class="container">
  <div class="grid g3" style="margin-bottom:56px">
    <div class="card feature-card"><div class="fc-ic" style="background:#E9FBF3;color:#25D366">${WA_SVG.replace('viewBox', 'width="23" height="23" viewBox')}</div><h3>WhatsApp</h3><p>Fastest response, 8am–8pm daily.<br><a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" style="color:var(--blue);font-weight:600">+27 60 000 0000</a></p></div>
    <div class="card feature-card"><div class="fc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></div><h3>Email</h3><p>We reply within one business day.<br><a href="mailto:${SITE.email}" style="color:var(--blue);font-weight:600">${SITE.email}</a></p></div>
    <div class="card feature-card"><div class="fc-ic" style="background:var(--gold-tint);color:#B87A00"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 2z"/></svg></div><h3>Phone</h3><p>Mon–Fri, 9am–5pm.<br><a href="tel:${SITE.phone.replace(/\s/g, '')}" style="color:var(--blue);font-weight:600">${SITE.phone}</a></p></div>
  </div>
  <div class="section-head center"><h2 style="font-size:28px">Send a full enquiry</h2><p class="lead" style="margin:10px auto 0">Every field helps us match better. Required fields are marked *.</p></div>
  <div style="text-align:center;margin-top:26px"><button class="btn btn-primary btn-lg" onclick="openBooking()">Open the enquiry form</button></div>
</div></section>
${callbackBlock()}
${reviewsBlock()}` }));

// ============ BECOME A TUTOR ============
write('become-a-tutor/index.html', layout({
  title: 'Become a Tutor in Cape Town | Earn R180–R350/hr — Whiz Tutoring',
  desc: 'Tutor jobs for UCT, Stellenbosch, Wits, UP & UJ students. Flexible hours, guaranteed payment, students matched to you. Apply to Whiz Tutoring in 2 minutes.',
  canonical: '/become-a-tutor/',
  schemas: [breadcrumb([['Home', '/'], ['Become a Tutor', '/become-a-tutor/']])],
  body: `
${pageHero('Become a tutor', 'Earn well doing work that matters', 'Join 300+ tutors from SA\u2019s top universities. Set your own hours, teach subjects you love, and get paid reliably — R180–R350 per hour.', '<a href="/">Home</a> / <span>Become a Tutor</span>')}
<section class="section tight"><div class="container landing-two">
  <div>
    <h2 style="font-size:27px">Why tutors choose Whiz</h2>
    <ul class="check-list">
      <li>${TICK}<span><b>Students come to you.</b> We handle marketing, matching, scheduling and payments — you just teach.</span></li>
      <li>${TICK}<span><b>Flexible around lectures.</b> Teach evenings, weekends, online from res or in person nearby.</span></li>
      <li>${TICK}<span><b>Guaranteed payment.</b> Paid twice monthly, on time, every time — including late cancellations.</span></li>
      <li>${TICK}<span><b>Training & materials.</b> Teaching workshops, lesson templates and a full past-paper bank.</span></li>
      <li>${TICK}<span><b>A real CV line.</b> A reference and verified teaching record when you graduate.</span></li>
    </ul>
    <div class="card" style="background:var(--gray);border-style:dashed;padding:24px">
      <b style="font-family:var(--font-display)">Requirements</b>
      <p style="font-size:14.5px;color:var(--slate);margin-top:6px">Currently enrolled at (or graduated from) a recognised university · 70%+ in the subjects you'll teach · pass our subject test & teaching demo · clear background check.</p>
    </div>
  </div>
  <div class="form-card">
    <h3 style="font-size:22px;margin-bottom:6px">Apply in 2 minutes</h3>
    <p style="color:var(--slate);font-size:14.5px;margin-bottom:22px">Applications reviewed weekly. Shortlisted candidates are invited to a subject assessment.</p>
    <form data-lead="tutor_application" novalidate>
      <div class="hp" aria-hidden="true"><label>Leave empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
      <div class="form-grid">
        <div class="field"><label for="t_name">Full name *</label><input id="t_name" name="student" type="text" required><span class="err-msg"></span></div>
        <div class="field"><label for="t_phone">Phone *</label><input id="t_phone" name="phone" type="tel" required><span class="err-msg"></span></div>
        <div class="field full"><label for="t_email">Email *</label><input id="t_email" name="email" type="email" required><span class="err-msg"></span></div>
        <div class="field"><label for="t_uni">University *</label><select id="t_uni" name="university" required><option value="">Select…</option><option>UCT</option><option>Stellenbosch</option><option>Wits</option><option>UP</option><option>UJ</option><option>UNZA</option><option>Other</option></select><span class="err-msg"></span></div>
        <div class="field"><label for="t_subj">Main subject *</label><select id="t_subj" name="subject" required><option value="">Select…</option><option>Mathematics</option><option>Physical Sciences</option><option>Accounting</option><option>English</option><option>Programming</option><option>Engineering</option><option>Economics</option><option>Biology</option><option>Chemistry</option></select><span class="err-msg"></span></div>
        <div class="field full"><label for="t_why">Why do you want to tutor? (one or two sentences)</label><textarea id="t_why" name="notes"></textarea></div>
      </div>
      <button class="btn btn-primary btn-lg" type="submit" style="width:100%;margin-top:22px">Submit application</button>
      <div class="form-success" style="display:none;text-align:center;padding:20px 0"><h3 style="font-size:20px">Application sent! ✓</h3><p style="color:var(--slate)">We review applications every Friday and email shortlisted candidates.</p></div>
    </form>
  </div>
</div></section>` }));

// ============ SITEMAP + ROBOTS + REDIRECTS ============
const urls = ['/', '/subjects/', '/areas/', '/tutors/', '/pricing/', '/about/', '/blog/', '/contact/', '/become-a-tutor/',
  ...SUBJECT_PAGES.map(p => `/${p.slug}/`),
  ...SUBURBS.map(s => `/areas/${s.slug}/`),
  ...POSTS.map(p => `/blog/${p.slug}/`)];
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE.domain}${u}</loc><lastmod>${today}</lastmod><changefreq>${u === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${u === '/' ? '1.0' : u.startsWith('/blog/') && u !== '/blog/' ? '0.6' : '0.8'}</priority></url>`).join('\n')}
</urlset>`);
write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${SITE.domain}/sitemap.xml`);
write('_redirects', `/api/*  /.netlify/functions/:splat  200\n`);

console.log(`Built ${urls.length} pages → dist/`);
