import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Create a transporter using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // Use true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `Arabiaseel Admin <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    // You can also add a text version for clients that don't render HTML
    // text: options.text 
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;