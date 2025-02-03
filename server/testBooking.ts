import "dotenv/config";

import type { ResultSetHeader } from "mysql2";
import client from "./database/client";
import { ReservationActions } from "./src/modules/reservation/ReservationActions";
import { generateGoogleMeetLink } from "./src/utils/googleMeet";

async function testBooking() {
	try {
		const startTime = new Date();
		startTime.setHours(startTime.getHours() + 1); // Créneau dans 1 heure

		const [result] = await client.query<ResultSetHeader>(
			`INSERT INTO slot (start_at, duration, advert_id, goat_id, status) 
             VALUES (?, ?, ?, ?, 'available')`,
			[startTime, 60, 1, 1],
		);

		const slot_id = result.insertId;
		const user_id = 1; // Utilisez un ID d'utilisateur existant
		const reservation = await ReservationActions.createReservation(
			user_id,
			slot_id,
		);
	} catch (error) {
		console.error("Erreur lors du test :", error);
		process.exit(1);
	} finally {
		// Fermer la connexion à la base de données
		await client.end();
		process.exit(0);
	}
}

// Exécuter la fonction et gérer les erreurs au niveau supérieur
testBooking().catch((error) => {
	console.error("Erreur non gérée:", error);
	process.exit(1);
});
