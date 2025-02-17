const nodemailer = require("nodemailer");

export interface ReservationData {
  start_at: string;
  meet_link: string;
}

const sendConfirmationEmail = async (userEmail: string, reservationData: ReservationData): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Ou autre service SMTP (ex: SendGrid, Mailgun)
    auth: {
      user: process.env.EMAIL_USER, // Ton email (ex: noreply@tonsite.com)
      pass: process.env.EMAIL_PASS, // Mot de passe ou clé API SMTP
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Confirmation de votre réservation",
    text: `Votre réservation est confirmée pour le ${reservationData.start_at}.
  Lien de rencontre : ${reservationData.meet_link}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
  }
};

export { sendConfirmationEmail };
