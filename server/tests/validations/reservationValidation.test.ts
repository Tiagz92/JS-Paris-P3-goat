import { API_CONFIG } from "../../src/config/api";
import type { ReservationRequest } from "../../src/validations/reservationValidation";
import { validateReservation } from "../../src/validations/reservationValidation";

describe("Reservation Validation", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should validate a valid reservation request", async () => {
		global.fetch = jest.fn().mockImplementationOnce(() =>
			Promise.resolve({
				json: () => Promise.resolve({ count: 0 }),
			} as Response),
		);

		const validReservation = {
			slot_id: 1,
			user_id: 1,
		};

		const result = await validateReservation(validReservation);
		expect(result.isValid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it("should reject a reservation with missing fields", async () => {
		global.fetch = jest.fn().mockImplementationOnce(() =>
			Promise.resolve({
				json: () => Promise.resolve({ count: 0 }),
			} as Response),
		);

		const invalidReservation = {
			slot_id: 1,
		} as Partial<ReservationRequest>;

		const result = await validateReservation(invalidReservation);
		expect(result.isValid).toBe(false);
		expect(result.errors).toContain("user_id is required");
	});

	it("should reject a reservation exceeding max duration", async () => {
		global.fetch = jest.fn().mockImplementationOnce(() =>
			Promise.resolve({
				json: () => Promise.resolve({ count: 0 }),
			} as Response),
		);

		const longReservation = {
			slot_id: 1,
			user_id: 1,
			duration: API_CONFIG.validation.reservation.maxDuration + 30,
		};

		const result = await validateReservation(longReservation);
		expect(result.isValid).toBe(false);
		expect(result.errors).toContain(
			`Duration cannot exceed ${API_CONFIG.validation.reservation.maxDuration} minutes`,
		);
	});

	it("should reject if user has too many bookings", async () => {
		const reservation = {
			slot_id: 1,
			user_id: 1,
		};

		jest.spyOn(global, "fetch").mockImplementationOnce(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						count: API_CONFIG.validation.reservation.maxBookingsPerUser,
					}),
			} as Response),
		);

		const result = await validateReservation(reservation);
		expect(result.isValid).toBe(false);
		expect(result.errors).toContain(
			`User cannot have more than ${API_CONFIG.validation.reservation.maxBookingsPerUser} active bookings per week`,
		);
	});
});
