import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // pour charger les variables d’environnement

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès à', to);
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email :', error);
  }
};

export default sendEmail;