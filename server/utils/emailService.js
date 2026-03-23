// emailService.js - Combined and Organized
const nodemailer = require('nodemailer');
const path = require('path');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'abhishekrajbanshi999@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });
};

// Helper function for plan colors
const getPlanColor = (plan) => {
  if (plan?.includes('FREE')) return '#00e5ff';
  if (plan?.includes('UPGRADE')) return '#bf5fff';
  return '#00ffb3';
};

// ==================== CONSULTATION EMAILS ====================

// Send consultation confirmation email to user
exports.sendConsultationEmail = async (data) => {
  const { name, email, phone, company, projectType, budget, timeline, message, plan, price, features } = data;
  const transporter = createTransporter();
  const planColor = getPlanColor(plan);

  const mailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: email,
    subject: `Your Free Consultation Request - ${plan} - Coding World`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
          .header { 
            background: linear-gradient(135deg, #00e5ff, #bf5fff); 
            color: #07071a; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 { margin: 0; font-size: 32px; font-weight: 800; }
          .header p { margin: 10px 0 0; opacity: 0.9; }
          .content { padding: 40px 30px; background: #f9f9f9; }
          .plan-box { 
            background: #fff; 
            padding: 25px; 
            border-radius: 16px; 
            margin: 25px 0;
            border-left: 4px solid ${planColor};
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          }
          .plan-box h3 { margin-top: 0; color: ${planColor}; font-size: 24px; }
          .price-tag { font-size: 32px; font-weight: 800; color: ${planColor}; margin: 10px 0; }
          .feature-list { list-style: none; padding: 0; margin: 20px 0; }
          .feature-list li { 
            margin-bottom: 12px; 
            padding-left: 30px; 
            position: relative; 
          }
          .feature-list li:before { 
            content: "✓"; 
            color: ${planColor}; 
            position: absolute; 
            left: 0; 
            font-weight: bold; 
            font-size: 18px;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 15px; 
            margin: 25px 0;
          }
          .info-item { 
            background: #fff; 
            padding: 15px; 
            border-radius: 12px; 
            border: 1px solid #eef;
          }
          .info-label { 
            font-size: 12px; 
            color: #7878a8; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
            margin-bottom: 5px; 
          }
          .info-value { 
            font-size: 16px; 
            font-weight: 600; 
            color: #333; 
          }
          .steps { 
            background: #fff; 
            padding: 25px; 
            border-radius: 16px; 
            margin: 25px 0;
          }
          .step { 
            display: flex; 
            align-items: center; 
            gap: 15px; 
            margin-bottom: 15px;
          }
          .step-number { 
            width: 30px; 
            height: 30px; 
            background: ${planColor}; 
            color: #07071a; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-weight: 800; 
          }
          .offer-box { 
            background: linear-gradient(135deg, ${planColor}15, #bf5fff15); 
            padding: 25px; 
            border-radius: 16px; 
            margin: 25px 0;
            border: 1px solid ${planColor}33;
          }
          .offer-box h3 { color: ${planColor}; margin-top: 0; }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #00e5ff, #0095ff);
            color: #07071a;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 10px 20px rgba(0,229,255,0.3);
          }
          .footer { 
            padding: 30px; 
            text-align: center; 
            background: #fff; 
            border-top: 1px solid #eef;
          }
          .social-links { display: flex; gap: 15px; justify-content: center; margin: 20px 0; }
          .social-link { 
            width: 40px; 
            height: 40px; 
            border-radius: 50%; 
            background: #f0f0f8; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            text-decoration: none; 
            color: #333; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Coding World</h1>
            <p>Your Free Consultation Request</p>
          </div>
          <div class="content">
            <h2>Hello ${name}! 👋</h2>
            <p>Thank you for your interest in our <strong>${plan}</strong>. We're excited to help you bring your project to life!</p>
            
            <div class="plan-box">
              <h3>${plan}</h3>
              <div class="price-tag">${price}</div>
              <h4>✨ Key Features:</h4>
              <ul class="feature-list">
                ${features?.map(f => `<li>${f}</li>`).join('') || ''}
              </ul>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">📧 Email</div>
                <div class="info-value">${email}</div>
              </div>
              <div class="info-item">
                <div class="info-label">📞 Phone</div>
                <div class="info-value">${phone || 'Not provided'}</div>
              </div>
              ${company ? `
              <div class="info-item">
                <div class="info-label">🏢 Company</div>
                <div class="info-value">${company}</div>
              </div>
              ` : ''}
              ${projectType ? `
              <div class="info-item">
                <div class="info-label">💡 Project Type</div>
                <div class="info-value">${projectType}</div>
              </div>
              ` : ''}
              ${budget ? `
              <div class="info-item">
                <div class="info-label">💰 Budget</div>
                <div class="info-value">${budget}</div>
              </div>
              ` : ''}
              ${timeline ? `
              <div class="info-item">
                <div class="info-label">⏱ Timeline</div>
                <div class="info-value">${timeline}</div>
              </div>
              ` : ''}
            </div>

            ${message ? `
            <div style="background: #fff; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <div style="font-weight: 600; margin-bottom: 10px;">📝 Your Message:</div>
              <p style="color: #666; font-style: italic;">"${message}"</p>
            </div>
            ` : ''}

            <div class="steps">
              <h3 style="margin-top: 0;">📋 What happens next?</h3>
              <div class="step">
                <div class="step-number">1</div>
                <div>Our team will review your request within <strong>24 hours</strong></div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div>We'll schedule a free consultation call at your convenience</div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div>During the call, we'll discuss your project requirements in detail</div>
              </div>
              <div class="step">
                <div class="step-number">4</div>
                <div>You'll receive a custom proposal tailored to your needs</div>
              </div>
            </div>

            <div class="offer-box">
              <h3>🎁 Special Welcome Offer</h3>
              <p>As a thank you for requesting consultation, here's a special offer just for you:</p>
              <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 10px;">✓ <strong>20% discount</strong> on your first project</li>
                <li style="margin-bottom: 10px;">✓ <strong>Free</strong> domain name (worth ₹999)</li>
                <li style="margin-bottom: 10px;">✓ <strong>3 months</strong> free maintenance</li>
              </ul>
            </div>

            <p>Questions? Reply to this email or contact us on WhatsApp:</p>
            
            <a href="https://wa.me/9779824380896" class="button">💬 Chat on WhatsApp</a>

            <p style="margin-top: 30px;">Best regards,<br>
            <strong>The Coding World Team</strong></p>
          </div>
          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-link">📘</a>
              <a href="#" class="social-link">🐦</a>
              <a href="#" class="social-link">📷</a>
              <a href="#" class="social-link">💼</a>
            </div>
            <p style="color: #999; font-size: 12px;">
              © 2025 Coding World. All rights reserved.<br>
              This email was sent because you requested a consultation on our website.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send admin notification email
exports.sendAdminNotificationEmail = async (data) => {
  const { name, email, phone, company, projectType, budget, timeline, message, plan, consultationId } = data;
  const transporter = createTransporter();

  const mailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: 'abhishekrajbanshi999@gmail.com',
    subject: `📬 New Consultation Request - ${plan}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #00e5ff, #bf5fff); color: #07071a; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .info-box { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { display: flex; margin-bottom: 10px; border-bottom: 1px solid #eef; padding-bottom: 10px; }
          .info-label { width: 120px; font-weight: 600; color: #00e5ff; }
          .info-value { flex: 1; }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg,#00e5ff,#0095ff); 
            color: #07071a; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            margin: 10px 5px; 
          }
          .footer { text-align: center; padding: 20px; background: #f5f5f5; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📬 New Consultation Request</h2>
          </div>
          <div class="content">
            <p>A new consultation request has been submitted:</p>
            
            <div class="info-box">
              <div class="info-row">
                <div class="info-label">ID:</div>
                <div class="info-value">${consultationId}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Name:</div>
                <div class="info-value">${name}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">${email}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">${phone}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Company:</div>
                <div class="info-value">${company || 'Not provided'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Project Type:</div>
                <div class="info-value">${projectType || 'Not provided'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Budget:</div>
                <div class="info-value">${budget || 'Not provided'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Timeline:</div>
                <div class="info-value">${timeline || 'Not provided'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Plan:</div>
                <div class="info-value"><strong>${plan}</strong></div>
              </div>
              ${message ? `
              <div class="info-row">
                <div class="info-label">Message:</div>
                <div class="info-value">${message}</div>
              </div>
              ` : ''}
            </div>

            <div style="text-align: center;">
              <a href="http://localhost:3000/admin/dashboard" class="button">📊 View in Dashboard</a>
              <a href="mailto:${email}" class="button" style="background: #25d366;">💬 Reply to Client</a>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated notification. Please respond within 24 hours.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send consultation status update email
exports.sendConsultationStatusEmail = async (consultation, status) => {
  const { name, email, scheduledDate } = consultation;
  const transporter = createTransporter();

  const statusMessages = {
    contacted: {
      subject: 'We\'ve Received Your Consultation Request',
      message: 'Our team has received your request and will contact you shortly to schedule a call.'
    },
    scheduled: {
      subject: 'Your Consultation is Scheduled!',
      message: `Great news! Your consultation has been scheduled for ${new Date(scheduledDate).toLocaleString()}. We'll send you a calendar invite shortly.`
    },
    completed: {
      subject: 'Consultation Completed - Thank You!',
      message: 'Thank you for your time! We hope our consultation was helpful. We\'ll be in touch with a custom proposal soon.'
    }
  };

  const mailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: email,
    subject: statusMessages[status]?.subject || 'Consultation Status Update',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00e5ff, #bf5fff); color: #07071a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Consultation Status Update</h2>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>${statusMessages[status]?.message || 'Your consultation status has been updated.'}</p>
            <p>If you have any questions, feel free to reply to this email or contact us on WhatsApp.</p>
            <p>Best regards,<br>Coding World Team</p>
          </div>
          <div class="footer">
            <p>© 2025 Coding World. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// ==================== INTERNSHIP EMAILS ====================

// Send application email
exports.sendApplicationEmail = async (applicationData) => {
  const { name, email, phone, tracks, duration, cvPath } = applicationData;
  const transporter = createTransporter();

  // Email to applicant
  const applicantMailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: email,
    subject: 'Internship Application Received - Coding World',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00e5ff, #bf5fff); color: #07071a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-item { margin-bottom: 10px; }
          .detail-label { font-weight: bold; color: #00e5ff; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
          .track-tag { display: inline-block; background: rgba(0,229,255,0.1); border: 1px solid #00e5ff44; color: #00e5ff; padding: 3px 8px; border-radius: 12px; font-size: 12px; margin-right: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎓 Coding World Internship Program</h2>
          </div>
          <div class="content">
            <h3>Hello ${name}!</h3>
            <p>Thank you for applying to our internship program. We have received your application and will review it shortly.</p>
            
            <div class="details">
              <h4>Application Details:</h4>
              <div class="detail-item">
                <span class="detail-label">📧 Email:</span> ${email}
              </div>
              <div class="detail-item">
                <span class="detail-label">📞 Phone:</span> ${phone}
              </div>
              <div class="detail-item">
                <span class="detail-label">🎯 Selected Tracks:</span><br>
                ${tracks.map(t => `<span class="track-tag">${t}</span>`).join(' ')}
              </div>
              <div class="detail-item">
                <span class="detail-label">⏱ Duration:</span> ${duration}
              </div>
            </div>
            
            <p>What happens next?</p>
            <ol>
              <li>Our team will review your application within 2-3 business days</li>
              <li>If shortlisted, we'll contact you for an interview</li>
              <li>Successful candidates will receive an offer letter</li>
            </ol>
            
            <p>If you have any questions, feel free to reply to this email or contact us on WhatsApp at <strong>+977-9824380896</strong>.</p>
            
            <p>Best regards,<br>
            <strong>Coding World Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Coding World. All rights reserved.</p>
            <p>This is an automated message, please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  // Email to admin
  const adminMailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: 'abhishekrajbanshi999@gmail.com',
    subject: 'New Internship Application Received',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00e5ff, #bf5fff); color: #07071a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-item { margin-bottom: 10px; }
          .detail-label { font-weight: bold; color: #00e5ff; }
          .track-tag { display: inline-block; background: rgba(0,229,255,0.1); border: 1px solid #00e5ff44; color: #00e5ff; padding: 3px 8px; border-radius: 12px; font-size: 12px; margin-right: 5px; }
          .cv-link { display: inline-block; background: linear-gradient(135deg, #00e5ff, #0095ff); color: #07071a; padding: 10px 20px; text-decoration: none; border-radius: 8px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📬 New Internship Application</h2>
          </div>
          <div class="content">
            <h3>New application received!</h3>
            
            <div class="details">
              <h4>Applicant Details:</h4>
              <div class="detail-item">
                <span class="detail-label">👤 Name:</span> ${name}
              </div>
              <div class="detail-item">
                <span class="detail-label">📧 Email:</span> ${email}
              </div>
              <div class="detail-item">
                <span class="detail-label">📞 Phone:</span> ${phone}
              </div>
              <div class="detail-item">
                <span class="detail-label">🎯 Selected Tracks:</span><br>
                ${tracks.map(t => `<span class="track-tag">${t}</span>`).join(' ')}
              </div>
              <div class="detail-item">
                <span class="detail-label">⏱ Duration:</span> ${duration}
              </div>
            </div>
            
            <p>CV has been uploaded to the server.</p>
            <p><strong>CV Path:</strong> ${cvPath}</p>
            
            <p>Login to the admin panel to review the application and CV.</p>
          </div>
          <div class="footer">
            <p>© 2025 Coding World</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: cvPath ? [
      {
        filename: path.basename(cvPath),
        path: cvPath
      }
    ] : []
  };

  try {
    await transporter.sendMail(applicantMailOptions);
    await transporter.sendMail(adminMailOptions);
    console.log('✅ Application emails sent successfully');
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    throw error;
  }
};

// Send status update email
exports.sendStatusUpdateEmail = async (application, status) => {
  const { name, email, tracks, duration } = application;
  const transporter = createTransporter();

  let subject, htmlContent;

  switch (status) {
    case 'accepted':
      subject = 'Congratulations! Your Internship Application has been Accepted';
      htmlContent = `
        <div class="header" style="background: linear-gradient(135deg, #00e5ff, #00ffb3);">
          <h2>🎉 Congratulations ${name}!</h2>
        </div>
        <div class="content">
          <p>We are thrilled to inform you that your internship application has been <strong style="color: #00e5ff">ACCEPTED</strong>!</p>
          <p>You have been selected for the following tracks:</p>
          <ul>
            ${tracks.map(t => `<li>${t}</li>`).join('')}
          </ul>
          <p>Duration: <strong>${duration}</strong></p>
          <p>Our HR team will contact you within 24 hours with further details about joining formalities, orientation, and next steps.</p>
          <p>Welcome to the Coding World family! 🚀</p>
        </div>
      `;
      break;

    case 'rejected':
      subject = 'Update regarding your Internship Application';
      htmlContent = `
        <div class="header" style="background: linear-gradient(135deg, #ff6b6b, #ff4444);">
          <h2>Application Status Update</h2>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for your interest in the Coding World Internship Program.</p>
          <p>After careful review, we regret to inform you that we cannot move forward with your application at this time.</p>
          <p>This decision does not reflect on your potential. We encourage you to:</p>
          <ul>
            <li>Apply again in the next intake (3 months)</li>
            <li>Check out our free learning resources on our website</li>
            <li>Follow us on social media for updates on workshops</li>
          </ul>
          <p>We wish you the best in your career journey! 🌟</p>
        </div>
      `;
      break;

    default:
      return;
  }

  const mailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: email,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { color: #07071a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          ${htmlContent}
          <div class="footer">
            <p>© 2025 Coding World. All rights reserved.</p>
            <p>Contact us: +977-9824380896 | codingworld@example.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// ==================== FEEDBACK EMAILS ====================

// Send feedback confirmation email
exports.sendFeedbackEmail = async (feedbackData) => {
  const { name, email, rating, comment, photo } = feedbackData;
  const transporter = createTransporter();

  const mailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: email,
    subject: 'Thank You for Your Feedback - Coding World',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00e5ff, #bf5fff); color: #07071a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .rating { color: #ffd700; font-size: 20px; margin: 15px 0; }
          .feedback-box { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00e5ff; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
          .photo-preview { width: 100px; height: 100px; border-radius: 50%; margin: 10px auto; overflow: hidden; border: 3px solid #00e5ff; }
          .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✨ Thank You for Your Feedback!</h2>
          </div>
          <div class="content">
            <div class="photo-preview">
              <img src="${photo}" alt="${name}" />
            </div>
            <h3>Hello ${name}!</h3>
            <p>We truly appreciate you taking the time to share your experience with us.</p>
            
            <div class="feedback-box">
              <div class="rating">
                ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}
              </div>
              <p><strong>Your feedback:</strong> "${comment}"</p>
            </div>
            
            <p>Your feedback helps us improve and serve you better. Our team will review it shortly.</p>
            <p>We'll notify you once your feedback is published on our website!</p>
            
            <p>Best regards,<br>
            <strong>Coding World Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Coding World. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send feedback reply email
exports.sendFeedbackReplyEmail = async (feedback, status, replyMessage) => {
  const { name, email, comment } = feedback;
  const transporter = createTransporter();

  const isApproved = status === 'approved';
  
  const mailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: email,
    subject: isApproved ? 'Your Feedback is Live! 🎉' : 'Update on Your Feedback',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${isApproved ? 'linear-gradient(135deg, #00e5ff, #00ffb3)' : 'linear-gradient(135deg, #ff6b6b, #ff4444)'}; color: #07071a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${isApproved ? '#00e5ff' : '#ff6b6b'}; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${isApproved ? '🎉 Feedback Published!' : '📝 Feedback Update'}</h2>
          </div>
          <div class="content">
            <h3>Hello ${name}!</h3>
            <p>${isApproved 
              ? 'Great news! Your feedback has been approved and is now live on our website.' 
              : 'Thank you for your feedback. After careful review, we have decided not to publish it at this time.'}</p>
            
            <div class="message-box">
              <p><strong>Your original feedback:</strong> "${comment}"</p>
              ${replyMessage ? `<p><strong>Our response:</strong> ${replyMessage}</p>` : ''}
            </div>
            
            ${isApproved ? 
              '<p>Others can now see your experience and benefit from your insights. Thank you for contributing to our community!</p>' : 
              '<p>We appreciate your input and encourage you to share more feedback in the future.</p>'}
            
            <p>Best regards,<br>
            <strong>Coding World Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Coding World. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send contact confirmation email
exports.sendContactConfirmation = async (data) => {
  const { name, email, subject, message } = data;
  const transporter = createTransporter();

  const mailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: email,
    subject: 'We received your message - Coding World',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00e5ff, #bf5fff); color: #07071a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00e5ff; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
          .response-time { background: #00e5ff10; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📬 Message Received!</h2>
          </div>
          <div class="content">
            <h3>Hello ${name}!</h3>
            <p>Thank you for reaching out to Coding World. We have received your message and will get back to you within 24 hours.</p>
            
            <div class="message-box">
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Your message:</strong></p>
              <p>${message}</p>
            </div>
            
            <div class="response-time">
              <strong>⏱️ Response Time:</strong> Within 24 hours
            </div>
            
            <p>In the meantime, you can:</p>
            <ul>
              <li>Check out our <a href="${process.env.CLIENT_URL}/projects" style="color: #00e5ff;">portfolio</a></li>
              <li>Read our <a href="${process.env.CLIENT_URL}/testimonials" style="color: #00e5ff;">client testimonials</a></li>
              <li>Connect with us on WhatsApp: <strong>+977-9824380896</strong></li>
            </ul>
            
            <p>Best regards,<br>
            <strong>Coding World Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Coding World. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send contact reply email
exports.sendContactReply = async (contact, replyMessage) => {
  const { name, email, subject } = contact;
  const transporter = createTransporter();

  const mailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: email,
    subject: `Re: ${subject} - Coding World`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00e5ff, #00ffb3); color: #07071a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reply-box { background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00e5ff; }
          .original-message { background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>💬 Reply from Coding World</h2>
          </div>
          <div class="content">
            <h3>Hello ${name}!</h3>
            <p>We have replied to your message regarding <strong>${subject}</strong>.</p>
            
            <div class="reply-box">
              <p><strong>Our response:</strong></p>
              <p>${replyMessage}</p>
            </div>
            
            <div class="original-message">
              <p><strong>Your original message:</strong></p>
              <p>${contact.message}</p>
            </div>
            
            <p>If you have any more questions, feel free to:</p>
            <ul>
              <li>Reply to this email</li>
              <li>Contact us on WhatsApp: <strong>+977-9824380896</strong></li>
              <li>Schedule a <a href="${process.env.CLIENT_URL}/consultation" style="color: #00e5ff;">free consultation</a></li>
            </ul>
            
            <p>Best regards,<br>
            <strong>Coding World Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Coding World. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};
// Send career application email
exports.sendCareerApplicationEmail = async (data) => {
  const { name, email, position, experience, message } = data;
  const transporter = createTransporter();

  const mailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: email,
    subject: `Application Received: ${position} Position - Coding World`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00e5ff, #bf5fff); color: #07071a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🚀 Application Received!</h2>
          </div>
          <div class="content">
            <h3>Hello ${name}!</h3>
            <p>Thank you for applying for the <strong>${position}</strong> position at Coding World.</p>
            <p>We have received your application and our hiring team will review it shortly. If your profile matches our requirements, we'll contact you for an interview within 5-7 business days.</p>
            
            <p><strong>Position:</strong> ${position}</p>
            <p><strong>Experience:</strong> ${experience}</p>
            
            <p>In the meantime, you can:</p>
            <ul>
              <li>Check out our <a href="${process.env.CLIENT_URL}/projects">latest projects</a></li>
              <li>Follow us on <a href="https://linkedin.com/company/codingworld">LinkedIn</a> for updates</li>
              <li>Prepare for technical interviews</li>
            </ul>
            
            <p>Best regards,<br>
            <strong>Coding World Hiring Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Coding World. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};
// Send career status update email
exports.sendCareerStatusEmail = async (application, status) => {
  const { name, email, position } = application;
  const transporter = createTransporter();

  let subject, htmlContent;

  switch(status) {
    case 'shortlisted':
      subject = '🎉 Congratulations! You\'ve been Shortlisted - Coding World';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00ffb3, #00e5ff); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #07071a; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">Great news! Your application for the <strong style="color: #00e5ff;">${position}</strong> position has been <strong style="color: #00ffb3;">shortlisted</strong>!</p>
            
            <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00ffb3;">
              <h3 style="color: #333; margin-top: 0;">📋 Next Steps:</h3>
              <ol style="color: #666; line-height: 1.8;">
                <li>Our HR team will contact you within 24-48 hours</li>
                <li>You'll be scheduled for a technical interview</li>
                <li>Prepare for a coding challenge (if applicable)</li>
                <li>Final discussion with the hiring manager</li>
              </ol>
            </div>

            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #2e7d32; margin: 0;">
                <strong>💡 Tip:</strong> Review Node.js fundamentals, Express.js, and MongoDB concepts to ace your interview!
              </p>
            </div>

            <p style="color: #666;">In the meantime, you can:</p>
            <ul style="color: #666; line-height: 1.8;">
              <li>Check out our <a href="${process.env.CLIENT_URL}/projects" style="color: #00e5ff;">latest projects</a></li>
              <li>Follow us on <a href="https://linkedin.com/company/codingworld" style="color: #00e5ff;">LinkedIn</a></li>
              <li>Prepare your questions for the interview</li>
            </ul>

            <p style="color: #666;">We're excited to potentially have you join our team!</p>
            
            <p style="color: #666; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #333; font-weight: bold; margin-top: 0;">Coding World Hiring Team</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 Coding World. All rights reserved.<br />
              Kathmandu, Nepal | +977-9824380896
            </p>
          </div>
        </div>
      `;
      break;

    case 'rejected':
      subject = 'Update on your Application - Coding World';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff6b6b, #ff4444); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">Application Update</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${name},</h2>
            <p style="color: #666; line-height: 1.6;">Thank you for your interest in the <strong style="color: #00e5ff;">${position}</strong> position at Coding World.</p>
            
            <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b;">
              <p style="color: #666; margin: 0; line-height: 1.6;">
                After careful review of your application, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current requirements.
              </p>
            </div>

            <p style="color: #666;">We encourage you to:</p>
            <ul style="color: #666; line-height: 1.8;">
              <li>Apply for future positions that match your skills</li>
              <li>Check out our <a href="${process.env.CLIENT_URL}/internship" style="color: #00e5ff;">internship programs</a> for growth opportunities</li>
              <li>Follow us on social media for updates on new openings</li>
            </ul>

            <p style="color: #666;">We appreciate the time and effort you put into your application and wish you the best in your job search.</p>
            
            <p style="color: #666; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #333; font-weight: bold; margin-top: 0;">Coding World Hiring Team</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 Coding World. All rights reserved.
            </p>
          </div>
        </div>
      `;
      break;

    case 'reviewed':
      subject = 'Your Application is Under Review - Coding World';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00e5ff, #0095ff); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #07071a; margin: 0; font-size: 28px;">Application Update</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">Your application for the <strong style="color: #00e5ff;">${position}</strong> position has been reviewed and is now in the next stage of our hiring process.</p>
            
            <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00e5ff;">
              <p style="color: #666; margin: 0; line-height: 1.6;">
                Our team is carefully evaluating your profile. We'll get back to you within 3-5 business days with an update on your application status.
              </p>
            </div>

            <p style="color: #666;">Thank you for your patience!</p>
            
            <p style="color: #666; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #333; font-weight: bold; margin-top: 0;">Coding World Hiring Team</p>
          </div>
        </div>
      `;
      break;

    default:
      return;
  }

  const mailOptions = {
    from: '"Coding World" <abhishekrajbanshi999@gmail.com>',
    to: email,
    subject: subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ ${status} email sent to ${email}`);
};