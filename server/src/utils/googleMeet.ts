import fs from "node:fs";
import path from "node:path";
import { type Credentials, OAuth2Client } from "google-auth-library";
import { type calendar_v3, google } from "googleapis";

const credentialsPath = path.join(__dirname, "../../credentials.json");
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

const { client_id, client_secret, redirect_uris } = credentials.installed;
const oAuth2Client = new OAuth2Client(
	client_id,
	client_secret,
	redirect_uris[0],
);

const tokenPath = path.join(__dirname, "../../token.json");
if (fs.existsSync(tokenPath)) {
	const token = JSON.parse(fs.readFileSync(tokenPath, "utf-8")) as Credentials;
	oAuth2Client.setCredentials(token);
} else {
	throw new Error("Token d'authentification manquant.");
}

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

interface EntryPoint extends calendar_v3.Schema$EntryPoint {
	entryPointType: string;
	uri?: string;
}

export async function generateGoogleMeetLink(
	startTime: Date,
	endTime: Date,
): Promise<string> {
	const event: calendar_v3.Schema$Event = {
		summary: "Réunion planifiée",
		start: { dateTime: startTime.toISOString(), timeZone: "Europe/Paris" },
		end: { dateTime: endTime.toISOString(), timeZone: "Europe/Paris" },
		conferenceData: {
			createRequest: {
				requestId: `meet-${Date.now()}`,
				conferenceSolutionKey: { type: "hangoutsMeet" },
			},
		},
	};

	const response = await calendar.events.insert({
		calendarId: "primary",
		requestBody: event,
		conferenceDataVersion: 1,
	});

	if (response.data.conferenceData?.entryPoints) {
		const meetLink = (
			response.data.conferenceData.entryPoints as EntryPoint[]
		).find((entryPoint) => entryPoint.entryPointType === "video")?.uri;
		if (meetLink) {
			return meetLink;
		}
	}

	throw new Error("Impossible de générer le lien Google Meet.");
}
