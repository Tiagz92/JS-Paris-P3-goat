// server/tests/unit/reservation/emailReservation.test.ts
import { jest } from "@jest/globals";
import client from "../../../database/client";
import { ReservationActions } from "../../../src/modules/reservation/ReservationActions";
import { generateGoogleMeetLink } from "../../../src/utils/googleMeet";
import { sendReservationEmail } from "../../../src/utils/mailService";

// On mock la fonction generateGoogleMeetLink pour renvoyer un lien prédéfini
jest.mock("../../../src/utils/googleMeet", () => ({
	generateGoogleMeetLink: jest
		.fn<() => Promise<string>>()
		.mockResolvedValue("https://meet.google.com/test-link"),
}));

// On mock le service d'envoi d'email pour simuler son appel
jest.mock("../../../src/services/mailService", () => ({
	sendReservationEmail: jest
		.fn<() => Promise<boolean>>()
		.mockResolvedValue(true),
}));

// On mock également la méthode de création de réservation du repository
import { ReservationRepository } from "../../../src/modules/reservation/ReservationRepository";
jest.spyOn(ReservationRepository, "create").mockResolvedValue({
	id: 1,
	google_meet_link: "https://meet.google.com/test-link",
	status: "confirmed",
	slot_id: 1,
	user_id: 1,
});

describe("ReservationActions.createReservation", () => {
	it("should send an email with a Google Meet link when a reservation is created", async () => {
		// Paramètres de test
		const userId = 1;
		const slotId = 1;

		// Appel de la méthode createReservation
		const result = await ReservationActions.createReservation(userId, slotId);

		// Vérification des résultats
		expect(result).toBeDefined();
		expect(result.insertId).toBe(1);
		expect(result.google_meet_link).toBe("https://meet.google.com/test-link");
		expect(result.status).toBe("confirmed");

		// Vérifier que la fonction de génération du lien Google Meet a été appelée avec des dates
		expect(generateGoogleMeetLink).toHaveBeenCalledWith(
			expect.any(Date),
			expect.any(Date),
		);

		// Vérifier que la fonction d'envoi d'email a été appelée
		// Ici, nous vérifions que sendReservationEmail a été appelée avec une adresse email (type string)
		// et un objet contenant au moins l'ID et le lien Meet
		expect(sendReservationEmail).toHaveBeenCalledWith(
			expect.any(String), // Par exemple, l'email du goat (l'utilisateur)
			expect.objectContaining({
				id: 1,
				google_meet_link: "https://meet.google.com/test-link",
			}),
		);
	});
});
