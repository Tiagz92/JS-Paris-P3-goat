import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { Credentials, OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
const TOKEN_PATH = path.join(__dirname, "../../token.json");

const credentialsPath = path.join(__dirname, "../../credentials.json");
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

const { client_id, client_secret, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(
	client_id,
	client_secret,
	redirect_uris[0],
);

const getAccessToken = async () => {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	});
	console.info("Authorize this app by visiting this url:", authUrl);

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	try {
		const code = await new Promise<string>((resolve) => {
			rl.question("Enter the code from that page here: ", resolve);
		});

		const { tokens } = await oAuth2Client.getToken(code);
		oAuth2Client.setCredentials(tokens);
		fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
		console.info("Token stored to", TOKEN_PATH);
	} catch (err) {
		console.error("Error retrieving access token", err);
	} finally {
		rl.close();
	}
};

getAccessToken();
