import nodemailer from "nodemailer";

// Configuration du transporteur SMTP (à adapter avec vos informations réelles)
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || "smtp.example.com",
	port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
	secure: false, // true pour 465, false pour d'autres ports
	auth: {
		user: process.env.SMTP_USER || "votre-email@example.com",
		pass: process.env.SMTP_PASSWORD || "votre-mot-de-passe",
	},
});

export async function sendReservationEmail(
	to: string,
	reservationDetails: { id: number; slot: string; google_meet_link: string },
) {
	const mailOptions = {
		from: '"Service de Réservation" <noreply@example.com>',
		to,
		subject: "Confirmation de votre réservation",
		html: `
      <h1>Réservation confirmée</h1>
      <p>Bonjour,</p>
      <p>Votre réservation a bien été enregistrée.</p>
      <p><strong>Détails de la réservation :</strong></p>
      <ul>
        <li>ID : ${reservationDetails.id}</li>
        <li>Créneau : ${reservationDetails.slot}</li>
        <li>Lien Google Meet : <a href="${reservationDetails.google_meet_link}">${reservationDetails.google_meet_link}</a></li>
      </ul>
      <p>Merci de votre confiance.</p>
    `,
	};

	return transporter.sendMail(mailOptions);
}
