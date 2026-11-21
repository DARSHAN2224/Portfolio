import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields (name, email, message) are required' },
        { status: 400 }
      );
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.warn('EMAIL_USER or EMAIL_PASS not configured in environment.');
      return NextResponse.json({
        success: true,
        message: 'Message received (email credentials not configured in environment)',
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // 1. Notification Email to portfolio owner
    const mailOptions = {
      from: emailUser,
      to: emailUser,
      replyTo: email,
      subject: `Portfolio Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
      `,
    };

    // 2. Auto-Reply Email to visitor
    const autoReplyOptions = {
      from: emailUser,
      to: email,
      subject: `Thank you for contacting Darshan P`,
      text: `Hi ${name},\n\nThank you for reaching out! I have received your message and will get back to you as soon as possible.\n\nBest regards,\nDarshan P`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Thank you for reaching out!</h2>
          <p>Hi ${name},</p>
          <p>I have received your message regarding:</p>
          <blockquote style="border-left: 4px solid #ddd; padding-left: 10px; color: #555;">
            ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}
          </blockquote>
          <p>I will review it and get back to you as soon as possible.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>Darshan P</strong></p>
          <p style="font-size: 12px; color: #888;">AI & Full Stack Engineer</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email: ' + error.message },
      { status: 500 }
    );
  }
}
