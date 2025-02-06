// utils/getGoogleAuthToken.ts
import fs from "node:fs";
import path from "node:path";
import { OAuth2Client } from "google-auth-library";

const TOKEN_PATH = path.join(__dirname, "../../token.json");
const CREDENTIALS_PATH = path.join(__dirname, "../../credentials.json");

// Charger les credentials
function loadCredentials() {
	const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
	const { client_id, client_secret, redirect_uris } = credentials.installed;
	return { client_id, client_secret, redirect_uris };
}

// Charger le token existant
function loadToken(): {
	access_token: string;
	refresh_token: string;
	expiry_date: number;
} {
	if (!fs.existsSync(TOKEN_PATH)) {
		throw new Error("Token file not found.");
	}
	return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
}

// Sauvegarder un nouveau token
function saveToken(token: object) {
	fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));
}

// Initialiser le client OAuth2
function initializeOAuth2Client() {
	const { client_id, client_secret, redirect_uris } = loadCredentials();
	return new OAuth2Client(client_id, client_secret, redirect_uris[0]);
}

// Fonction pour obtenir un token valide
export async function getValidAccessToken() {
	const oAuth2Client = initializeOAuth2Client();
	const tokenData = loadToken();

	// Vérifier si le token a expiré
	const now = Date.now();
	if (now >= tokenData.expiry_date) {
		// Renouveler le token
		const { refresh_token } = tokenData;
		const response = await oAuth2Client.getAccessToken();
		const newToken = response.token;

		if (!newToken) {
			throw new Error("Failed to obtain new access token.");
		}

		// Sauvegarder le nouveau token
		saveToken({ access_token: newToken });

		// Mettre à jour le client avec le nouveau token
		oAuth2Client.setCredentials({ access_token: newToken });
		return newToken;
	}

	// Si le token est encore valide, le retourner directement
	oAuth2Client.setCredentials(tokenData);
	return tokenData.access_token;
}
