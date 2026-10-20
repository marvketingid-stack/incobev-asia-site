// Cloudflare Pages Function — POST /api/contact
// Receives the Contact Us form and relays it via Microsoft 365 SMTP.
// Secrets/vars are set in the Cloudflare Pages project (never in code):
//   SMTP_USER  full mailbox address (e.g. noreply_web@suzukicoffee.com.sg)
//   SMTP_PASS  mailbox password or App Password  (encrypted Secret)
//   SMTP_TO    inbox that receives submissions (default hello@incobev.asia)
//   SMTP_HOST  default smtp.office365.com   SMTP_PORT  default 587
import { WorkerMailer } from 'worker-mailer';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const esc = (s) =>
  String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

const ALLOWED_ORIGINS = [
  'https://www.incobev.asia',
  'https://incobev.asia',
  'https://incobev-asia-site.pages.dev',
];

export async function onRequestPost({ request, env }) {
  // Only accept same-site form posts (reduces cross-site spam/abuse).
  const origin = request.headers.get('origin') || '';
  if (origin && ALLOWED_ORIGINS.indexOf(origin) === -1) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Strip CR/LF (header-injection) and cap length on header-bound fields.
  const clean = (k, max) => String(form.get(k) || '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
  const name = clean('name', 120);
  const email = clean('email', 160);
  const type = clean('inquiry_type', 80);
  const hub = clean('hub', 80);
  const message = String(form.get('message') || '').trim().slice(0, 5000); // newlines kept for the body
  const honey = String(form.get('company_website') || '').trim(); // honeypot — real users leave this blank

  if (honey) return json({ ok: true }); // silently accept, drop bots
  if (!name || !email || !message) return json({ ok: false, error: 'missing_fields' }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ ok: false, error: 'bad_email' }, 400);

  if (!env.SMTP_USER || !env.SMTP_PASS) return json({ ok: false, error: 'not_configured' }, 503);

  const to = env.SMTP_TO || 'hello@incobev.asia';
  const subject = `[Website] ${type || 'Enquiry'} — ${name}`;
  const text =
    'New enquiry from the IncoBev Asia website\n\n' +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Inquiry type: ${type || '-'}\n` +
    `Regional hub: ${hub || '-'}\n\n` +
    `Message:\n${message}\n`;
  const html =
    '<h2 style="margin:0 0 12px;font-family:Arial,sans-serif;color:#003861">New website enquiry</h2>' +
    '<table style="font-family:Arial,sans-serif;font-size:14px;color:#16202b;border-collapse:collapse">' +
    `<tr><td style="padding:4px 14px 4px 0;color:#5a6875">Name</td><td style="padding:4px 0"><b>${esc(name)}</b></td></tr>` +
    `<tr><td style="padding:4px 14px 4px 0;color:#5a6875">Email</td><td style="padding:4px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>` +
    `<tr><td style="padding:4px 14px 4px 0;color:#5a6875">Inquiry type</td><td style="padding:4px 0">${esc(type) || '-'}</td></tr>` +
    `<tr><td style="padding:4px 14px 4px 0;color:#5a6875">Regional hub</td><td style="padding:4px 0">${esc(hub) || '-'}</td></tr>` +
    '</table>' +
    `<p style="font-family:Arial,sans-serif;font-size:14px;color:#16202b;white-space:pre-wrap;margin-top:16px">${esc(message)}</p>`;

  try {
    await WorkerMailer.send(
      {
        host: env.SMTP_HOST || 'smtp.office365.com',
        port: Number(env.SMTP_PORT || 587),
        secure: false, // 587 uses STARTTLS, not implicit TLS
        startTls: true,
        authType: ['login', 'plain'],
        credentials: { username: env.SMTP_USER, password: env.SMTP_PASS },
      },
      {
        from: { name: 'IncoBev Asia Website', email: env.SMTP_USER },
        to: { email: to },
        reply: { name, email }, // replies go to the enquirer
        subject,
        text,
        html,
      }
    );
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: 'send_failed' }, 502);
  }
}

// GET (or anything that isn't POST) just reports the endpoint is alive.
export const onRequestGet = () => json({ ok: false, error: 'method_not_allowed' }, 405);
