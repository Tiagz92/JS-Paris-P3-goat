import fs from "node:fs";
import path from "node:path";
import { type Credentials, OAuth2Client } from "google-auth-library";
import { type calendar_v3, google } from "googleapis";

// Chemins des fichiers de configuration
const CREDENTIALS_PATH =
	process.env.GOOGLE_CREDENTIALS_PATH ||
	path.join(__dirname, "../../credentials.json");
const TOKEN_PATH =
	process.env.GOOGLE_TOKEN_PATH || path.join(__dirname, "../../token.json");

/**
 * Charge les credentials depuis le fichier credentials.json.
 * @returns Les credentials nécessaires pour l'authentification OAuth2.
 * @throws Une erreur si les credentials sont manquants ou invalides.
 */
function loadCredentials(): {
	client_id: string;
	client_secret: string;
	redirect_uris: string[];
} {
	try {
		if (!fs.existsSync(CREDENTIALS_PATH)) {
			throw new Error("Fichier credentials.json manquant.");
		}
		const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
		const { client_id, client_secret, redirect_uris } = credentials.installed;
		if (!client_id || !client_secret || !redirect_uris?.length) {
			throw new Error("Informations d'identification Google incomplètes.");
		}
		return { client_id, client_secret, redirect_uris };
	} catch (error) {
		console.error("Erreur lors du chargement des credentials:", error);
		throw new Error("Configuration Google invalide.");
	}
}

/**
 * Initialise le client OAuth2 avec les credentials et le token.
 * @returns Une instance du client OAuth2 configurée.
 * @throws Une erreur si le token est manquant ou invalide.
 */
function initializeOAuth2Client(): OAuth2Client {
	const { client_id, client_secret, redirect_uris } = loadCredentials();
	const oAuth2Client = new OAuth2Client(
		client_id,
		client_secret,
		redirect_uris[0],
	);
	try {
		if (!fs.existsSync(TOKEN_PATH)) {
			throw new Error("Token d'authentification manquant.");
		}
		const token = JSON.parse(
			fs.readFileSync(TOKEN_PATH, "utf-8"),
		) as Credentials;
		oAuth2Client.setCredentials(token);
		return oAuth2Client;
	} catch (error) {
		console.error("Erreur lors de l'initialisation du client OAuth2:", error);
		throw new Error("Impossible d'initialiser l'authentification Google.");
	}
}

// Interface pour les points d'entrée
interface EntryPoint extends calendar_v3.Schema$EntryPoint {
	entryPointType: string;
	uri?: string;
}

/**
 * Génère un lien Google Meet pour un événement donné.
 * @param startTime - Date de début de l'événement.
 * @param endTime - Date de fin de l'événement.
 * @returns Promesse résolue avec le lien Meet généré.
 * @throws Une erreur si la génération du lien échoue.
 */
export async function generateGoogleMeetLink(
	startTime: Date,
	endTime: Date,
): Promise<string> {
	try {
		// Validation des dates
		if (startTime >= endTime) {
			throw new Error(
				"La date de début doit être antérieure à la date de fin.",
			);
		}

		// Initialisation du client Google Calendar
		const calendar = google.calendar({
			version: "v3",
			auth: initializeOAuth2Client(),
		});

		// Création de l'événement avec une demande de conférence
		const event: calendar_v3.Schema$Event = {
			summary: "Session de coaching",
			description: "Session de coaching via Google Meet",
			start: { dateTime: startTime.toISOString(), timeZone: "Europe/Paris" },
			end: { dateTime: endTime.toISOString(), timeZone: "Europe/Paris" },
			conferenceData: {
				createRequest: {
					requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
					conferenceSolutionKey: { type: "hangoutsMeet" },
				},
			},
		};

		// Insertion de l'événement dans le calendrier
		const response = await calendar.events.insert({
			calendarId: "primary",
			requestBody: event,
			conferenceDataVersion: 1,
		});

		// Extraction du lien Meet depuis la réponse
		if (!response.data.conferenceData?.entryPoints?.length) {
			throw new Error("Aucun lien de conférence généré.");
		}
		const meetLink = (
			response.data.conferenceData.entryPoints as EntryPoint[]
		).find((entryPoint) => entryPoint.entryPointType === "video")?.uri;

		if (!meetLink) {
			throw new Error("Lien de visioconférence non trouvé.");
		}

		return meetLink;
	} catch (error) {
		console.error("Erreur lors de la génération du lien Meet:", error);
		throw new Error("Impossible de générer le lien Google Meet.");
	}
}
