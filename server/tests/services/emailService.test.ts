import type { EmailData } from "../../src/services/emailService";
import { sendReservationConfirmation } from "../../src/services/emailService";
import type { ReservationDetails } from "../../src/types/models";

// Mock nodemailer
jest.mock("nodemailer", () => ({
	createTransport: jest.fn().mockReturnValue({
		sendMail: jest.fn().mockResolvedValue({
			messageId: "test-message-id",
			accepted: ["test@example.com"],
			html: "mercredi 20 mars 2024 14h00",
		}),
	}),
}));

describe("Email Service", () => {
	it("should send a reservation confirmation email", async () => {
		const emailData: EmailData = {
			to: "test@example.com",
			meetLink: "https://meet.google.com/test-123",
			startTime: new Date("2024-03-20T14:00:00"),
			duration: 60,
		};

		const mockReservationDetails: ReservationDetails = {
			id: 1,
			slot_id: 1,
			user_id: 1,
			google_meet_link: "https://meet.google.com/test",
			date: "2024-03-20",
			time: "14:00",
			meetLink: "https://meet.google.com/test",
			goatName: "John",
		};

		const result = await sendReservationConfirmation(
			emailData,
			mockReservationDetails,
		);

		expect(result).toHaveProperty("messageId");
		expect(result.accepted).toContain(emailData.to);
	});

	it("should format the date correctly in French", async () => {
		const emailData: EmailData = {
			to: "test@example.com",
			meetLink: "https://meet.google.com/test-123",
			startTime: new Date("2024-03-20T14:00:00"),
			duration: 60,
		};

		const mockReservationDetails: ReservationDetails = {
			id: 1,
			slot_id: 1,
			user_id: 1,
			google_meet_link: "https://meet.google.com/test",
			date: "2024-03-20",
			time: "14:00",
			meetLink: "https://meet.google.com/test",
			goatName: "John",
		};

		const result = await sendReservationConfirmation(
			emailData,
			mockReservationDetails,
		);

		// Vérifier que le corps du mail contient la date formatée
		expect(result.html).toContain("mercredi 20 mars 2024");
		expect(result.html).toContain("14h00");
	});

	it("should handle email sending errors", async () => {
		// Simuler une erreur d'envoi
		const mockError = new Error("SMTP error");
		jest.spyOn(console, "error").mockImplementation(() => {});

		const emailData: EmailData = {
			to: "invalid-email",
			meetLink: "https://meet.google.com/test-123",
			startTime: new Date(),
			duration: 60,
		};

		const mockReservationDetails: ReservationDetails = {
			id: 1,
			slot_id: 1,
			user_id: 1,
			google_meet_link: "https://meet.google.com/test",
			date: "2024-03-20",
			time: "14:00",
			meetLink: "https://meet.google.com/test",
			goatName: "John",
		};

		await expect(
			sendReservationConfirmation(emailData, mockReservationDetails),
		).rejects.toThrow();
	});
});
