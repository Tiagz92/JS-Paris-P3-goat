import dotenv from "dotenv";
import nodemailer from "nodemailer";
import database from "../../database/client";
import type { ReservationDetails } from "../types/models";

dotenv.config();

export interface EmailData {
	to: string;
	meetLink: string;
	startTime: Date;
	duration: number;
}

// Création d'un transporteur de test
const createTestAccount = async () => {
	const testAccount = await nodemailer.createTestAccount();
	return nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
	});
};

let transporter: nodemailer.Transporter;

// Initialisation du transporteur
const initializeTransporter = async () => {
	transporter = await createTestAccount();
};

// Appel initial
initializeTransporter();

export const sendReservationConfirmation = async (
	emailData: EmailData,
	reservationDetails: ReservationDetails,
) => {
	try {
		const mailOptions = {
			from: '"GOAT Service" <goat@example.com>',
			to: emailData.to,
			subject: "Confirmation de votre réservation GOAT",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h1 style="color: #ff6b00;">Confirmation de réservation</h1>
					<div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
						<h2>Détails de votre réservation :</h2>
						<p><strong>Chèvre :</strong> ${reservationDetails.goatName}</p>
						<p><strong>Date :</strong> ${reservationDetails.date}</p>
						<p><strong>Heure :</strong> ${reservationDetails.time}</p>
						${
							reservationDetails.google_meet_link
								? `<p><strong>Lien de la réunion :</strong> 
								   <a href="${reservationDetails.google_meet_link}" style="color: #ff6b00;">
									 Rejoindre la réunion
								   </a></p>`
								: ""
						}
					</div>
					<p style="margin-top: 20px;">À bientôt !</p>
				</div>
			`,
		};

		const info = await transporter.sendMail(mailOptions);

		// Affiche l'URL de prévisualisation de l'email
		console.info(
			"Email envoyé ! URL de prévisualisation :",
			nodemailer.getTestMessageUrl(info),
		);

		return info;
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email:", error);
		throw error;
	}
};

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
	throw new Error(
		"Les variables d'environnement GMAIL_USER et GMAIL_APP_PASSWORD doivent être définies",
	);
}

const transporterGmail = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_APP_PASSWORD,
	},
});

export async function sendBookingConfirmation(
	userEmail: string,
	details: ReservationDetails,
): Promise<void> {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT),
		secure: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	const emailContent = `
		<h1>Confirmation de votre réservation</h1>
		<p>Votre rendez-vous avec ${details.goatName} est confirmé pour le ${details.date} à ${details.time}.</p>
		<p>Lien de la visioconférence : <a href="${details.meetLink}">${details.meetLink}</a></p>
	`;

	await transporter.sendMail({
		from: process.env.SMTP_FROM,
		to: userEmail,
		subject: "Confirmation de votre réservation",
		html: emailContent,
	});
}
