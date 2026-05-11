/**
 * POST /api/contact — Vercel Function that sends the contact-form
 * submission as an email via Resend (https://resend.com).
 *
 * Required env vars (set in Vercel dashboard → Settings → Environment Variables):
 *   RESEND_API_KEY  — get one from https://resend.com (free tier: 100 emails/day)
 *   CONTACT_TO      — destination address  (default: klima.al@klima-info.com)
 *   CONTACT_FROM    — verified sender      (default: onboarding@resend.dev — works without domain verification)
 *
 * Body: { name, phone, email, product, city, message, company /* honeypot */ }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot — if filled, silently accept and discard
  if (body.company) return res.status(200).json({ ok: true });

  const name    = String(body.name || '').trim().slice(0, 120);
  const phone   = String(body.phone || '').trim().slice(0, 40);
  const email   = String(body.email || '').trim().slice(0, 120);
  const product = String(body.product || '').trim().slice(0, 200);
  const city    = String(body.city || '').trim().slice(0, 60);
  const message = String(body.message || '').trim().slice(0, 2000);

  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: 'Emri dhe nr. telefoni janë të nevojshëm.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set — email not sent.');
    return res.status(500).json({ ok: false, error: 'Server email is not configured. Please call us at +355 67 254 9225.' });
  }

  const to   = process.env.CONTACT_TO   || 'klima.al@klima-info.com';
  const from = process.env.CONTACT_FROM || 'Klima.Al <onboarding@resend.dev>';

  const esc = s => String(s).replace(/[<>&]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;' }[c]));
  const subject = `Kërkesë e re nga ${name} — ${product || 'Konsultim'}`;
  const text = [
    `Emri:     ${name}`,
    `Telefoni: ${phone}`,
    email   ? `Email:    ${email}`   : null,
    product ? `Produkti: ${product}` : null,
    city    ? `Qyteti:   ${city}`    : null,
    '',
    'Mesazhi:',
    message || '(asnjë mesazh)'
  ].filter(Boolean).join('\n');

  const html = `<!doctype html>
<html><body style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#141f2e">
  <h2 style="color:#9b1b2e;margin:0 0 12px">Kërkesë e re — Klima.Al</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6">
    <tr><td style="color:#6b7280;width:120px"><strong>Emri</strong></td><td>${esc(name)}</td></tr>
    <tr><td style="color:#6b7280"><strong>Telefoni</strong></td><td><a href="tel:${esc(phone)}" style="color:#9b1b2e">${esc(phone)}</a></td></tr>
    ${email   ? `<tr><td style="color:#6b7280"><strong>Email</strong></td><td><a href="mailto:${esc(email)}" style="color:#9b1b2e">${esc(email)}</a></td></tr>` : ''}
    ${product ? `<tr><td style="color:#6b7280"><strong>Produkti</strong></td><td>${esc(product)}</td></tr>` : ''}
    ${city    ? `<tr><td style="color:#6b7280"><strong>Qyteti</strong></td><td>${esc(city)}</td></tr>` : ''}
  </table>
  ${message ? `<h3 style="margin:20px 0 8px;color:#141f2e">Mesazhi</h3><p style="background:#f9fafb;padding:14px;border-radius:8px;white-space:pre-wrap;margin:0">${esc(message)}</p>` : ''}
  <p style="margin:24px 0 0;font-size:12px;color:#9ca3af">Dërguar nga formulari i kontaktit në klima-al.vercel.app</p>
</body></html>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email || undefined,
        subject,
        text,
        html
      })
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error:', r.status, detail);
      return res.status(502).json({ ok: false, error: 'Email service refused the message.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend request failed:', err);
    return res.status(500).json({ ok: false, error: 'Could not reach email service.' });
  }
}
