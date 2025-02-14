// utils/getGoogleAuthToken.ts
import fs from "node:fs";
import path from "node:path";
import { OAuth2Client } from "google-auth-library";

const TOKEN_PATH = path.join(__dirname, "../../../token.json");
const CREDENTIALS_PATH = path.join(__dirname, "../../../credentials.json");

export async function getGoogleAuthToken(): Promise<OAuth2Client> {
	try {
		// Charger les credentials
		const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
		const { client_id, client_secret, redirect_uris } = credentials.installed;

		// Créer le client OAuth2
		const oAuth2Client = new OAuth2Client(
			client_id,
			client_secret,
			redirect_uris[0],
		);

		// Charger le token
		const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
		oAuth2Client.setCredentials(token);

		return oAuth2Client;
	} catch (error) {
		console.error("Erreur d'authentification Google:", error);
		throw new Error("Échec de l'authentification Google");
	}
}
