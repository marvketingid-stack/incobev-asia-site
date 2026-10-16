# Contact form email — setup & go-live

The Contact Us form posts to a Cloudflare Pages Function (`functions/api/contact.js`)
that relays the message to the destination inbox via **Microsoft 365 SMTP**.
No credentials live in the code — they are read from Cloudflare environment variables.

## 1. Environment variables (set in the Cloudflare Pages project)

Cloudflare dashboard → the Pages project → **Settings → Variables and Secrets**.
Set these for **Production** _and_ **Preview** (so the preview URL can be tested too):

| Name | Type | Value |
|------|------|-------|
| `SMTP_USER` | Plaintext | `noreply_web@suzukicoffee.com.sg` |
| `SMTP_PASS` | **Secret (encrypted)** | the mailbox password, or an **App Password** if MFA is on |
| `SMTP_TO`   | Plaintext | `hello@incobev.asia` |
| `SMTP_HOST` | Plaintext | `smtp.office365.com` *(optional — this is the default)* |
| `SMTP_PORT` | Plaintext | `587` *(optional — this is the default)* |

> The password is only ever stored here as an encrypted Secret. It is never in the
> repo, the built site, or the page source.

## 2. Compatibility (if the function errors)

The function opens a TCP/STARTTLS connection via `cloudflare:sockets`. If a build or
runtime error mentions sockets/node, set in **Settings → Functions**:
- Compatibility date: `2024-09-01` or later
- Compatibility flag: `nodejs_compat`

## 3. Pre-conditions from the client (Microsoft 365 admin)

- [ ] **Authenticated SMTP = ON** for `noreply_web@suzukicoffee.com.sg`
      (`Set-CASMailbox -Identity noreply_web@suzukicoffee.com.sg -SmtpClientAuthenticationDisabled $false`)
- [ ] Password provided — or **App Password** if the mailbox has MFA
- [ ] SPF for `suzukicoffee.com.sg` includes `include:spf.protection.outlook.com`; DKIM enabled

## 4. Go-live steps

1. Client confirms Authenticated SMTP is ON (step 3).
2. Set the environment variables (step 1) for Preview + Production.
3. Push branch `feat/contact-smtp` → test the form on the **preview URL**:
   submit a test enquiry, confirm it lands in `hello@incobev.asia`.
4. If the test passes, merge `feat/contact-smtp` into `main` — production goes live.
5. After go-live, consider rotating the mailbox password (it was shared over chat).

## Notes

- The form is already wired on this branch (`data-configured="true"`,
  `data-endpoint="/api/contact"`). Until the env vars + Authenticated SMTP are in
  place, a submission returns an error and the page shows the "email us directly"
  fallback — it never fakes a successful send.
- A hidden honeypot field (`company_website`) silently drops bot submissions.
- Auto-reply to the enquirer is **not** enabled yet — add it once the client confirms
  they want it and from which address.
