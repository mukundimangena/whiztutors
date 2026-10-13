// POST /api/enquiry — receives lead forms from the site.
// 1. Validates + spam-checks   2. Emails the Whiz team (NOTIFY_EMAIL)   3. Emails the client a confirmation   4. Stores the lead in Supabase.
// Env vars (AWS: Lambda environment, set by aws/deploy.js from .env — Netlify: Site settings → Environment variables):
//   RESEND_API_KEY      – from resend.com (free tier), with a verified sending domain
//   FROM_EMAIL          – e.g. "Whiz Tutoring <hello@whiztutoring.co.za>"
//   NOTIFY_EMAIL        – comma-separated list of team inboxes that receive every enquiry
//   REPLY_TO_EMAIL      – where clients’ replies go (default enquiries@whiztutors.co.za)
//   SUPABASE_URL        – optional, e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY– optional, service-role key (table: leads)
//   TURNSTILE_SECRET    – optional, Cloudflare Turnstile secret for CAPTCHA verification

const RATE = new Map(); // per-IP soft rate limit (per warm instance)
const RESEND_API_KEY = process.env.RESEND_API_KEY;

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let data;
  try { data = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  // ---------- Spam protection ----------
  if (data.website) return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }; // honeypot: pretend success
  if (data.ts_loaded && data.ts_sent && (Number(data.ts_sent) - Number(data.ts_loaded) < 2500)) {
    return { statusCodes: 200, statusCode: 200, headers, body: JSON.stringify({ ok: true }) }; // filled in <2.5s → bot
  }
  const ip = event.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now(); const hits = (RATE.get(ip) || []).filter(t => now - t < 3600e3);
  if (hits.length >= 8) return { statusCode: 429, headers, body: JSON.stringify({ error: 'Too many requests' }) };
  hits.push(now); RATE.set(ip, hits);

  // Optional CAPTCHA (Cloudflare Turnstile) — verified only if configured
  if (process.env.TURNSTILE_SECRET && data.turnstileToken) {
    const v = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET, response: data.turnstileToken, remoteip: ip })
    }).then(r => r.json()).catch(() => ({ success: false }));
    if (!v.success) return { statusCode: 400, headers, body: JSON.stringify({ error: 'CAPTCHA failed' }) };
  }

  // ---------- Validation ----------
  const type = String(data.type || 'enquiry').slice(0, 40);
  const clean = {}; const strip = s => String(s || '').replace(/[<>]/g, '').trim().slice(0, 1000);
  for (const [k, v] of Object.entries(data)) clean[k] = strip(v);
  if (type === 'booking') {
    // Name + phone are enough to start; email is optional (used for the confirmation only)
    if (!clean.student || !clean.phone) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
    if (clean.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  if (type === 'pricing_request') {
    if (!clean.student || !clean.email) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  // ---------- Price list (private: only ever sent by email, never shown on the website) ----------
  // Edit your prices here. [plan, price, details]
  const PRICES = [
    ['Pay as you go', 'R320 / hour', 'Billed per lesson · online · free cancellation with 24h notice'],
    ['Term package', 'R280 / hour', '10-lesson pack · online or in person · same tutor, same weekly slot, term progress report, WhatsApp homework help'],
    ['Matric intensive', 'R395 / hour', 'Grade 11–12 & exam season · senior specialist tutors · marked mock papers'],
  ];
  const PRICE_NOTES = 'Your first lesson is 50% off. In-person lessons carry a small travel supplement depending on your area. Sibling discounts available. No signup fees or contracts.';
  const priceHtml = `
    <table style="border-collapse:collapse;width:100%;font-size:15px;margin:8px 0 14px">
      ${PRICES.map(([p, r, d]) => `<tr><td style="padding:12px 14px;border:1px solid #E8ECF3"><strong>${p}</strong><br><span style="color:#5A6472;font-size:13px">${d}</span></td><td style="padding:12px 14px;border:1px solid #E8ECF3;white-space:nowrap;font-weight:700;color:#0B5FFF">${r}</td></tr>`).join('')}
    </table>
    <p style="font-size:14px;color:#5A6472">${PRICE_NOTES}</p>`;

  // ---------- Compose emails ----------
  const NOTIFY = (process.env.NOTIFY_EMAIL || 'mukundi@whiztutors.co.za,enquiries@whiztutors.co.za,whiztutors@gmail.com')
    .split(',').map(e => e.trim()).filter(Boolean);
  const REPLY_TO = process.env.REPLY_TO_EMAIL || 'enquiries@whiztutors.co.za';
  const FROM = process.env.FROM_EMAIL || 'Whiz Tutoring <onboarding@resend.dev>';
  const rows = Object.entries(clean)
    .filter(([k]) => !['type', 'page', 'ts_loaded', 'ts_sent', 'website', 'turnstileToken'].includes(k))
    .map(([k, v]) => `<tr><td style="padding:8px 14px;background:#F7F8FA;border:1px solid #E8ECF3;font-weight:600;text-transform:capitalize">${k.replace(/_/g, ' ')}</td><td style="padding:8px 14px;border:1px solid #E8ECF3">${v}</td></tr>`)
    .join('');
  const adminHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:auto">
      <div style="background:linear-gradient(135deg,#0A2A6B,#0B5FFF);color:#fff;border-radius:14px 14px 0 0;padding:22px 26px">
        <h2 style="margin:0;font-size:20px">🎓 New ${type} — Whiz Tutoring</h2>
        <p style="margin:6px 0 0;opacity:.85;font-size:13px">From ${clean.page || 'website'} · ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })} SAST</p>
      </div>
      <table style="border-collapse:collapse;width:100%;font-size:14px;background:#fff">${rows}</table>
      <p style="font-size:12px;color:#8B94A3;padding:14px 4px">Reply directly to this email to contact the client${clean.email ? ` (${clean.email})` : ''}.</p>
    </div>`;
  const clientHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:auto;color:#1B1F24">
      <div style="background:linear-gradient(135deg,#0A2A6B,#0B5FFF);color:#fff;border-radius:14px 14px 0 0;padding:26px">
        <h2 style="margin:0;font-size:22px">Thank you${clean.parent || clean.student ? ', ' + (clean.parent || clean.student).split(' ')[0] : ''}! 🎉</h2>
        <p style="margin:8px 0 0;opacity:.9">Your enquiry has reached the Whiz Tutoring team.</p>
      </div>
      <div style="border:1px solid #E8ECF3;border-top:none;border-radius:0 0 14px 14px;padding:26px;font-size:15px;line-height:1.7">
        <p><strong>What happens next:</strong></p>
        <ol style="padding-left:20px;margin:10px 0 18px">
          <li>A coordinator reviews your enquiry (usually within a few hours).</li>
          <li>We hand-pick 2–3 screened tutors that match your subject, grade and schedule.</li>
          <li>We contact you within <strong>24 hours</strong> on WhatsApp or email to confirm your <strong>half-price trial lesson</strong>.</li>
        </ol>
        <p>Need us sooner? WhatsApp us on <a href="https://wa.me/27624204922" style="color:#0B5FFF">+27 62 420 4922</a>.</p>
        <p style="margin-top:20px">Talk soon,<br><strong>The Whiz Tutoring Team</strong><br><span style="color:#8B94A3;font-size:13px">Cape Town · Online across South Africa & Zambia</span></p>
      </div>
    </div>`;

  const send = (payload) => fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const jobs = [];
  if (process.env.RESEND_API_KEY) {
    jobs.push(send({ from: FROM, to: NOTIFY, reply_to: clean.email || undefined, subject: `🎓 New ${type}: ${clean.subject || clean.value || ''} — ${clean.student || clean.parent || clean.email || 'website lead'}`, html: adminHtml }));
    if (clean.email && type === 'pricing_request') {
      const first = (clean.student || '').split(' ')[0];
      jobs.push(send({ from: FROM, to: [clean.email], reply_to: REPLY_TO, subject: 'Your Whiz Tutoring price guide', html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:auto;color:#1B1F24">
          <div style="background:linear-gradient(135deg,#0A2A6B,#0B5FFF);color:#fff;border-radius:14px 14px 0 0;padding:26px">
            <h2 style="margin:0;font-size:22px">Hi${first ? ' ' + first : ''}, here are our prices</h2>
            <p style="margin:8px 0 0;opacity:.9">Thanks for your interest in Whiz Tutoring.</p>
          </div>
          <div style="border:1px solid #E8ECF3;border-top:none;border-radius:0 0 14px 14px;padding:26px;font-size:15px;line-height:1.7">
            ${priceHtml}
            <p style="margin-top:18px">Ready to start? Reply to this email or <a href="https://wa.me/27624204922" style="color:#0B5FFF">WhatsApp us on +27 62 420 4922</a> and we’ll match you with a tutor, usually within 24 hours.</p>
            <p style="margin-top:20px">Kind regards,<br><strong>The Whiz Tutoring Team</strong></p>
          </div>
        </div>` }));
    } else if (clean.email) jobs.push(send({ from: FROM, to: [clean.email], reply_to: REPLY_TO, subject: 'We’ve received your enquiry — Whiz Tutoring', html: clientHtml }));
  }

  // ---------- Store lead (Supabase REST) ----------
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    jobs.push(fetch(`${process.env.SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: { apikey: process.env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ type, payload: clean, page: clean.page || null, created_at: new Date().toISOString() })
    }));
  }

  try { await Promise.allSettled(jobs); } catch (e) { /* individual failures shouldn't 500 the lead */ }
  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
