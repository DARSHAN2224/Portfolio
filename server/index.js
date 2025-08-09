import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { z } from 'zod';
import { renderOwnerEmail, renderSenderThankYouEmail } from './templates.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting to avoid abuse
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});
app.use('/api/contact', limiter);

// Validation schema
const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  ownerEmail: z.string().email().optional(),
});

// Nodemailer transporter
const requiredEnv = ['SMTP_MAIL', 'SMTP_PASSWORD', 'SMTP_HOST', 'SMTP_PORT'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`[warn] Missing env ${key}.`);
  }
}

function isSmtpConfigured() {
  return requiredEnv.every((k) => Boolean(process.env[k]));
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Helpful GET for visibility/debugging (browsers do GET by default)
app.get('/api/contact', (_req, res) => {
  res.json({ ok: true, usage: 'POST /api/contact with { name, email, message, ownerEmail }' });
});

app.post('/api/contact', async (req, res) => {
  try {
    if (!isSmtpConfigured()) {
      return res.status(500).json({ ok: false, code: 'SMTP_NOT_CONFIGURED', error: 'SMTP credentials are missing' });
    }
    const parsed = ContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: 'Invalid input', details: parsed.error.flatten() });
    }

    const { name, email, message, ownerEmail } = parsed.data;
    const ownerTo = ownerEmail || process.env.TO_EMAIL || process.env.SMTP_MAIL;

    // Owner notification
    const ownerSubject = `New portfolio contact from ${name}`;
    const ownerHtml = renderOwnerEmail({ name, email, message });

    // Sender thank you
    const thankYouSubject = `Thanks for reaching out, ${name}!`;
    const thankYouHtml = renderSenderThankYouEmail({ name });

    await transporter.sendMail({
      from: `Portfolio Contact <${process.env.SMTP_MAIL}>`,
      to: ownerTo,
      subject: ownerSubject,
      html: ownerHtml,
    });

    await transporter.sendMail({
      from: `Darshan • Portfolio <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: thankYouSubject,
      html: thankYouHtml,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('[contact] send error', err);
    return res.status(500).json({ ok: false, code: 'SEND_FAILED', error: 'Failed to send email' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/verify', async (_req, res) => {
  try {
    if (!isSmtpConfigured()) {
      return res.status(500).json({ ok: false, code: 'SMTP_NOT_CONFIGURED', error: 'SMTP credentials are missing' });
    }
    await transporter.verify();
    res.json({ ok: true });
  } catch (err) {
    console.error('[verify] transporter error', err);
    res.status(500).json({ ok: false, code: 'VERIFY_FAILED', error: String(err && err.message || err) });
  }
});

app.listen(PORT, () => {
  console.log(`SMTP API running on http://localhost:${PORT}`);
});


