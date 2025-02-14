import { createGoogleMeetEvent } from "../../src/services/googleCalendar";

describe("Google Calendar Service", () => {
	it("should create a Google Meet event", async () => {
		const startTime = new Date();
		const endTime = new Date(startTime.getTime() + 3600000); // +1 heure

		const result = await createGoogleMeetEvent(startTime, endTime, [
			"test@example.com",
		]);

		expect(result).toMatch(/^https:\/\/meet\.google\.com\//);
	});

	it("should throw an error if start time is in the past", async () => {
		const startTime = new Date();
		startTime.setHours(startTime.getHours() - 1); // 1 heure dans le passé
		const endTime = new Date(startTime.getTime() + 3600000); // +1 heure

		await expect(
			createGoogleMeetEvent(startTime, endTime, ["test@example.com"]),
		).rejects.toThrow("Start time cannot be in the past");
	});
});
