import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import supertest from "supertest";
import client from "../../database/client";
import app from "../../src/app";

describe("Reservation API Integration Tests", () => {
	beforeEach(async () => {
		// Nettoyer les tables de test dans l'ordre pour gérer les contraintes de clé étrangère
		await client.query("DELETE FROM reservations");
		await client.query("DELETE FROM slot");
		await client.query("DELETE FROM advert");
		await client.query("DELETE FROM main_sub_tag");
		await client.query("DELETE FROM main_tag");
		await client.query("DELETE FROM sub_tag");
		await client.query("DELETE FROM goat");

		// Réinitialiser les séquences auto-increment
		await client.query("ALTER TABLE reservations AUTO_INCREMENT = 1");
		await client.query("ALTER TABLE slot AUTO_INCREMENT = 1");
		await client.query("ALTER TABLE advert AUTO_INCREMENT = 1");
		await client.query("ALTER TABLE goat AUTO_INCREMENT = 1");
	});

	describe("POST /api/reservations", () => {
		it("should create a new reservation successfully", async () => {
			// Créer un goat (utilisateur)
			const [goatResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO goat (lastname, firstname, born_at, email, password, picture, presentation) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[
					"Dupont",
					"Jean",
					"1990-01-01",
					"jean@test.com",
					"hashedpassword",
					"picture.jpg",
					"Test presentation",
				],
			);
			const goatId = goatResultHeader.insertId;

			// Créer un main_tag
			const [mainTagResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO main_tag (name) VALUES (?)",
				["Test Main Tag"],
			);
			const mainTagId = mainTagResultHeader.insertId;

			// Créer un sub_tag
			const [subTagResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO sub_tag (name) VALUES (?)",
				["Test Sub Tag"],
			);
			const subTagId = subTagResultHeader.insertId;

			// Lier main_tag et sub_tag
			await client.query(
				"INSERT INTO main_sub_tag (main_tag_id, sub_tag_id) VALUES (?, ?)",
				[mainTagId, subTagId],
			);

			// Créer un advert
			const [advertResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO advert (description, goat_id, main_tag_id, sub_tag_id) VALUES (?, ?, ?, ?)",
				["Test advert", goatId, mainTagId, subTagId],
			);
			const advertId = advertResultHeader.insertId;

			// Créer un slot
			const [slotResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO slot (start_at, duration, status, advert_id) VALUES (?, ?, ?, ?)",
				["2024-02-01T14:00:00", 60, "available", advertId],
			);
			const slotId = slotResultHeader.insertId;

			const response = await supertest(app).post("/api/reservations").send({
				slot_id: slotId,
				user_id: goatId,
			});

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("id");
			expect(response.body).toHaveProperty("google_meet_link");
			expect(response.body.google_meet_link).toMatch(
				/^https:\/\/meet\.google\.com\/[a-z0-9-]+$/,
			);
		});

		it("should return 404 for non-existent slot", async () => {
			const response = await supertest(app).post("/api/reservations").send({
				slot_id: 999,
				user_id: 1,
			});

			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("error", "Slot not found");
		});
	});

	describe("GET /api/users/:userId/reservations", () => {
		it("should return user's reservations", async () => {
			// Créer un goat (utilisateur)
			const [goatResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO goat (lastname, firstname, born_at, email, password, picture, presentation) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[
					"Dupont",
					"Jean",
					"1990-01-01",
					"jean@test.com",
					"hashedpassword",
					"picture.jpg",
					"Test presentation",
				],
			);
			const goatId = goatResultHeader.insertId;

			// Créer un main_tag
			const [mainTagResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO main_tag (name) VALUES (?)",
				["Test Main Tag"],
			);
			const mainTagId = mainTagResultHeader.insertId;

			// Créer un sub_tag
			const [subTagResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO sub_tag (name) VALUES (?)",
				["Test Sub Tag"],
			);
			const subTagId = subTagResultHeader.insertId;

			// Créer un advert
			const [advertResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO advert (description, goat_id, main_tag_id, sub_tag_id) VALUES (?, ?, ?, ?)",
				["Test advert", goatId, mainTagId, subTagId],
			);
			const advertId = advertResultHeader.insertId;

			// Créer un créneau et une réservation de test
			const [slotResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO slot (start_at, duration, status, advert_id) VALUES (?, ?, ?, ?)",
				["2024-02-01T14:00:00", 60, "available", advertId],
			);
			const slotId = slotResultHeader.insertId;

			const [reservationResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO reservations (slot_id, user_id, google_meet_link, status) VALUES (?, ?, ?, ?)",
				[slotId, goatId, "https://meet.google.com/test", "pending"],
			);

			const response = await supertest(app).get(
				`/api/users/${goatId}/reservations`,
			);

			expect(response.status).toBe(200);
			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body.length).toBe(1);
			expect(response.body[0]).toHaveProperty("google_meet_link");
		});
	});

	describe("DELETE /api/reservations/:id", () => {
		it("should cancel a reservation successfully", async () => {
			// Créer un goat (utilisateur)
			const [goatResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO goat (lastname, firstname, born_at, email, password, picture, presentation) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[
					"Dupont",
					"Jean",
					"1990-01-01",
					"jean@test.com",
					"hashedpassword",
					"picture.jpg",
					"Test presentation",
				],
			);
			const goatId = goatResultHeader.insertId;

			// Créer un main_tag
			const [mainTagResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO main_tag (name) VALUES (?)",
				["Test Main Tag"],
			);
			const mainTagId = mainTagResultHeader.insertId;

			// Créer un sub_tag
			const [subTagResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO sub_tag (name) VALUES (?)",
				["Test Sub Tag"],
			);
			const subTagId = subTagResultHeader.insertId;

			// Créer un advert
			const [advertResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO advert (description, goat_id, main_tag_id, sub_tag_id) VALUES (?, ?, ?, ?)",
				["Test advert", goatId, mainTagId, subTagId],
			);
			const advertId = advertResultHeader.insertId;

			// Créer un créneau et une réservation de test
			const [slotResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO slot (start_at, duration, status, advert_id) VALUES (?, ?, ?, ?)",
				[new Date(Date.now() + 48 * 60 * 60 * 1000), 60, "reserved", advertId],
			);
			const slotId = slotResultHeader.insertId;

			const [reservationResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO reservations (slot_id, user_id, google_meet_link, status) VALUES (?, ?, ?, ?)",
				[slotId, goatId, "https://meet.google.com/test", "pending"],
			);
			const reservationId = reservationResultHeader.insertId;

			const response = await supertest(app)
				.delete(`/api/reservations/${reservationId}`)
				.send({ user_id: goatId });

			expect(response.status).toBe(200);

			// Vérifier que le statut du créneau a été mis à jour
			const [slots] = await client.query<RowDataPacket[]>(
				"SELECT status FROM slot WHERE id = ?",
				[slotId],
			);
			expect(slots[0].status).toBe("available");
		});

		it("should prevent cancellation less than 24h before", async () => {
			// Créer un goat (utilisateur)
			const [goatResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO goat (lastname, firstname, born_at, email, password, picture, presentation) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[
					"Dupont",
					"Jean",
					"1990-01-01",
					"jean@test.com",
					"hashedpassword",
					"picture.jpg",
					"Test presentation",
				],
			);
			const goatId = goatResultHeader.insertId;

			// Créer un main_tag
			const [mainTagResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO main_tag (name) VALUES (?)",
				["Test Main Tag"],
			);
			const mainTagId = mainTagResultHeader.insertId;

			// Créer un sub_tag
			const [subTagResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO sub_tag (name) VALUES (?)",
				["Test Sub Tag"],
			);
			const subTagId = subTagResultHeader.insertId;

			// Créer un advert
			const [advertResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO advert (description, goat_id, main_tag_id, sub_tag_id) VALUES (?, ?, ?, ?)",
				["Test advert", goatId, mainTagId, subTagId],
			);
			const advertId = advertResultHeader.insertId;

			// Créer un créneau proche dans le temps
			const [slotResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO slot (start_at, duration, status, advert_id) VALUES (?, ?, ?, ?)",
				[new Date(Date.now() + 12 * 60 * 60 * 1000), 60, "reserved", advertId],
			);
			const slotId = slotResultHeader.insertId;

			const [reservationResultHeader] = await client.query<ResultSetHeader>(
				"INSERT INTO reservations (slot_id, user_id, google_meet_link, status) VALUES (?, ?, ?, ?)",
				[slotId, goatId, "https://meet.google.com/test", "pending"],
			);
			const reservationId = reservationResultHeader.insertId;

			const response = await supertest(app)
				.delete(`/api/reservations/${reservationId}`)
				.send({ user_id: goatId });

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty(
				"error",
				"Cannot cancel reservation less than 24 hours before start time",
			);
		});
	});
});
