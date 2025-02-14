import type { Pool } from "mysql2/promise";
import request from "supertest";
import database from "../../database/client";
import app from "../../src/app";
import { ReservationRepository } from "../../src/modules/reservation/ReservationRepository";
import type { Reservation } from "../../src/types/models";

interface CreateReservationParams {
	slot_id: number;
	user_id: number;
	google_meet_link: string;
}

describe("Reservation API", () => {
	let db: Pool;

	beforeAll(() => {
		db = database;
	});

	afterAll(async () => {
		await db.end();
	});

	describe("POST /api/reservations", () => {
		it("should create a new reservation", async () => {
			const mockReservation: Partial<Reservation> = {
				slot_id: 1,
				user_id: 1,
			};

			const response = await request(app)
				.post("/api/reservations")
				.send(mockReservation);

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("google_meet_link");
			expect(response.body.status).toBe("confirmed");
		});

		it("should return 400 if slot is not available", async () => {
			const mockReservation: Partial<Reservation> = {
				slot_id: 999, // ID inexistant
				user_id: 1,
			};

			const response = await request(app)
				.post("/api/reservations")
				.send(mockReservation);

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty("message");
		});
	});

	describe("GET /api/reservations/advert/:advertId", () => {
		it("should return all reservations for an advert", async () => {
			const advertId = 1;
			const response = await request(app).get(
				`/api/reservations/advert/${advertId}`,
			);

			expect(response.status).toBe(200);
			expect(Array.isArray(response.body)).toBe(true);
		});
	});

	describe("DELETE /api/reservations/:reservationId", () => {
		it("should cancel a reservation", async () => {
			const newReservation: CreateReservationParams = {
				slot_id: 1,
				user_id: 1,
				google_meet_link: "https://meet.google.com/test",
			};

			const reservation = await ReservationRepository.create(newReservation);

			const response = await request(app)
				.delete(`/api/reservations/${reservation.id}`)
				.send({ user_id: 1 });

			expect(response.status).toBe(200);
			expect(response.body.message).toBe("Reservation cancelled successfully");
		});

		it("should return 403 if trying to cancel less than 24h before", async () => {
			const newReservation: CreateReservationParams = {
				slot_id: 2,
				user_id: 1,
				google_meet_link: "https://meet.google.com/test",
			};

			const reservation = await ReservationRepository.create(newReservation);

			const response = await request(app)
				.delete(`/api/reservations/${reservation.id}`)
				.send({ user_id: 1 });

			expect(response.status).toBe(403);
			expect(response.body.error).toBe(
				"Cannot cancel reservation less than 24 hours before start time",
			);
		});
	});
});
