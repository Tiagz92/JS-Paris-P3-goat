import { jest } from "@jest/globals";
import client from "../../../database/client";
import { ReservationActions } from "../../../src/modules/reservation/ReservationActions";
import { ReservationRepository } from "../../../src/modules/reservation/ReservationRepository";
import { generateGoogleMeetLink } from "../../../src/utils/googleMeet";
import { sendReservationEmail } from "../../../src/utils/mailService";

// On mock la génération du lien Google Meet pour qu'elle renvoie toujours une valeur prédéfinie
jest.mock("../../../src/utils/googleMeet", () => ({
	generateGoogleMeetLink: jest
		.fn<() => Promise<string>>()
		.mockResolvedValue("https://meet.google.com/test-link"),
}));

// On mock le module de mail pour pouvoir vérifier l'appel à la fonction d'envoi d'email
jest.mock("../../../src/services/mailService", () => ({
	sendReservationEmail: jest
		.fn<() => Promise<boolean>>()
		.mockResolvedValue(true),
}));

// Pour ce test, on suppose que la méthode createReservation dans ReservationActions
// utilise bien sendReservationEmail pour envoyer l'email (après avoir créé la réservation)

describe("ReservationActions.createReservation - Email", () => {
	// Ici, vous pouvez également mocker les appels à la base de données si nécessaire.
	// Par exemple, si ReservationRepository.create est utilisé, vous pouvez le spyOn et le faire renvoyer un objet fictif.
	const fakeReservation = {
		id: 123,
		google_meet_link: "https://meet.google.com/test-link",
		status: "confirmed",
		user_id: 1,
		slot_id: 1,
	};

	// On mock la méthode create du ReservationRepository pour qu'elle retourne fakeReservation.
	// Attention à adapter l'import en fonction de la structure de votre projet.
	jest
		.spyOn(
			// Importez le repository (ou utilisez require) selon la façon dont vous l'avez exporté
			require("../../../src/modules/reservation/ReservationRepository"),
			"create",
		)
		.mockResolvedValue(fakeReservation);

	test("should send an email with a Google Meet link when a reservation is created", async () => {
		// Appel de la méthode createReservation avec des valeurs fictives
		const result = await ReservationActions.createReservation(1, 1);

		// Vérifier que le résultat contient bien les valeurs attendues
		expect(result.insertId).toBe(fakeReservation.id);
		expect(result.google_meet_link).toBe("https://meet.google.com/test-link");
		expect(result.status).toBe("confirmed");

		// Vérifier que la fonction de génération du lien a été appelée avec des dates (les paramètres de début et fin)
		expect(generateGoogleMeetLink).toHaveBeenCalledWith(
			expect.any(Date),
			expect.any(Date),
		);

		// Vérifier que la fonction d'envoi d'email a bien été appelée
		expect(sendReservationEmail).toHaveBeenCalledWith(
			expect.any(String), // L'adresse email (vous pourrez adapter selon votre logique)
			expect.objectContaining({
				id: fakeReservation.id,
				google_meet_link: "https://meet.google.com/test-link",
			}),
		);
	});
});
