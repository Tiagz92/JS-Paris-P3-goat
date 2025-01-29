import { generateGoogleMeetLink } from "./googleMeet";

async function testMeetingCreation() {
	try {
		// Créer une réunion qui commence dans 1 heure
		const startTime = new Date();
		startTime.setHours(startTime.getHours() + 1);

		// La réunion dure 1 heure
		const endTime = new Date(startTime);
		endTime.setHours(endTime.getHours() + 1);

		console.info("Création d'une réunion...");
		console.info("Début :", startTime);
		console.info("Fin :", endTime);

		const meetLink = await generateGoogleMeetLink(startTime, endTime);
		console.info("Lien Google Meet créé :", meetLink);
	} catch (error) {
		console.error("Erreur :", error);
	}
}

testMeetingCreation();
