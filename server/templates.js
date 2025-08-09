const baseStyles = {
  container:
    'font-family: Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif; color:#0f172a; background:#f8fafc; padding:24px',
  card:
    'background:#ffffff; border-radius:16px; padding:24px; box-shadow:0 10px 30px rgba(2,6,23,0.06); border:1px solid #e2e8f0',
  h1: 'font-size:20px; margin:0 0 12px; color:#0ea5e9',
  h2: 'font-size:16px; margin:0 0 8px; color:#0f172a',
  p: 'font-size:14px; line-height:1.6; margin:0 0 12px; color:#334155',
  small: 'font-size:12px; color:#64748b',
  code: 'background:#0f172a; color:#e2e8f0; padding:12px; border-radius:12px; display:block; white-space:pre-wrap',
  hr: 'border:none; border-top:1px solid #e2e8f0; margin:16px 0',
  badge:
    'display:inline-block; padding:6px 10px; background:linear-gradient(135deg,#38bdf8,#22d3ee); color:white; border-radius:999px; font-size:12px; font-weight:600',
  footer: 'font-size:12px; color:#64748b; text-align:center; margin-top:16px',
};

export function renderOwnerEmail({ name, email, message }) {
  const escapedMsg = String(message).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `
  <div style="${baseStyles.container}">
    <div style="${baseStyles.card}">
      <div style="${baseStyles.badge}">New Contact</div>
      <h1 style="${baseStyles.h1}">You have a new portfolio message</h1>
      <p style="${baseStyles.p}">Someone just reached out via the contact form.</p>
      <hr style="${baseStyles.hr}"/>
      <h2 style="${baseStyles.h2}">From</h2>
      <p style="${baseStyles.p}"><strong>${name}</strong> • <a href="mailto:${email}">${email}</a></p>
      <h2 style="${baseStyles.h2}">Message</h2>
      <pre style="${baseStyles.code}">${escapedMsg}</pre>
      <hr style="${baseStyles.hr}"/>
      <p style="${baseStyles.small}">Reply directly to the sender's email above.</p>
    </div>
    <div style="${baseStyles.footer}">This notification was sent by your portfolio contact form.</div>
  </div>`;
}

export function renderSenderThankYouEmail({ name }) {
  const safeName = String(name).replace(/[<>]/g, '');
  return `
  <div style="${baseStyles.container}">
    <div style="${baseStyles.card}">
      <div style="${baseStyles.badge}">Thanks ${safeName}!</div>
      <h1 style="${baseStyles.h1}">Your message is on its way 🚀</h1>
      <p style="${baseStyles.p}">
        Hi ${safeName}, thanks for reaching out. I received your message and will get back to you soon.
      </p>
      <p style="${baseStyles.p}">
        In the meantime, feel free to check out my GitHub or LinkedIn on the site.
      </p>
      <hr style="${baseStyles.hr}"/>
      <p style="${baseStyles.small}">If you didn’t submit this, you can ignore this email.</p>
    </div>
    <div style="${baseStyles.footer}">— Darshan</div>
  </div>`;
}


