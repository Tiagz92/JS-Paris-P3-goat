import { describe, expect, jest, test } from "@jest/globals";
import type { FieldPacket, RowDataPacket } from "mysql2";
import client from "../../../database/client";
import { ReservationActions } from "../../../src/modules/reservation/ReservationActions";
import { ReservationRepository } from "../../../src/modules/reservation/ReservationRepository";

// Pour les tests, nous définissons des types qui omettent la propriété "constructor"
type TestReservationRow = Omit<
	RowDataPacket & {
		id: number;
		slot_id: number;
		user_id: number;
		google_meet_link: string;
		start_at: Date;
		duration: number;
	},
	"constructor"
>;
type TestSlotRow = {
	id: number;
	start_at: Date;
	duration: number;
};

// Définition d'un alias pour le mock de client.query
// Ici, T est le type du premier élément du tuple renvoyé, et nous supposons que le second élément est un tableau vide
type QueryMock<T> = jest.Mock<(...args: unknown[]) => Promise<[T, []]>>;

describe("Reservation", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("getUserReservations", () => {
		test("devrait retourner les réservations de l'utilisateur", async () => {
			const mockReservations: TestReservationRow[] = [
				{
					id: 1,
					slot_id: 1,
					user_id: 1,
					google_meet_link: "https://meet.google.com/123",
					start_at: new Date(),
					duration: 60,
				},
			];

			// Forcer le retour de client.query avec le type approprié
			(client.query as QueryMock<TestReservationRow[]>).mockResolvedValueOnce([
				mockReservations,
				[],
			]);

			// Appel de la méthode testée
			const result = await ReservationRepository.getUserReservations(1);

			// Vérification
			expect(client.query).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockReservations);
		});
	});

	describe("cancelReservation", () => {
		test("devrait annuler la réservation si les conditions sont réunies", async () => {
			const mockReservation: TestReservationRow = {
				id: 1,
				slot_id: 1,
				user_id: 1,
				google_meet_link: "https://meet.google.com/123",
				start_at: new Date(),
				duration: 60,
			};

			const mockSlot: TestSlotRow = {
				id: 1,
				start_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
				duration: 60,
			};

			(client.query as QueryMock<TestReservationRow[]>)
				// Renvoie la réservation (SELECT)
				.mockResolvedValueOnce([[mockReservation], []]);
			(client.query as QueryMock<TestSlotRow[]>)
				// Renvoie le créneau (SELECT)
				.mockResolvedValueOnce([[mockSlot], []]);
			// Simule l'annulation (UPDATE)
			(
				client.query as QueryMock<{ affectedRows: number }>
			).mockResolvedValueOnce([{ affectedRows: 1 }, []]);

			const result = await ReservationActions.cancelReservation(1, 1);
			expect(result).toBe(true);
		});

		test("devrait lever une erreur si la réservation est introuvable", async () => {
			(client.query as QueryMock<unknown>).mockResolvedValueOnce([[], []]);

			await expect(
				ReservationActions.cancelReservation(1, 999),
			).rejects.toThrow("Reservation not found");
		});

		test("devrait lever une erreur si l'utilisateur n'est pas autorisé", async () => {
			const mockReservation: TestReservationRow = {
				id: 1,
				slot_id: 1,
				user_id: 2,
				google_meet_link: "https://meet.google.com/123",
				start_at: new Date(),
				duration: 60,
			};

			(client.query as QueryMock<TestReservationRow[]>).mockResolvedValueOnce([
				[mockReservation],
				[],
			]);

			await expect(ReservationActions.cancelReservation(1, 1)).rejects.toThrow(
				"Unauthorized",
			);
		});

		test("devrait lever une erreur si l'annulation est à moins de 24h", async () => {
			const mockReservation: TestReservationRow = {
				id: 1,
				slot_id: 1,
				user_id: 1,
				google_meet_link: "https://meet.google.com/123",
				start_at: new Date(),
				duration: 60,
			};

			const mockSlot: TestSlotRow = {
				id: 1,
				start_at: new Date(Date.now() + 23 * 60 * 60 * 1000),
				duration: 60,
			};

			(client.query as QueryMock<TestReservationRow[]>).mockResolvedValueOnce([
				[mockReservation],
				[],
			]);
			(client.query as QueryMock<TestSlotRow[]>).mockResolvedValueOnce([
				[mockSlot],
				[],
			]);

			await expect(ReservationActions.cancelReservation(1, 1)).rejects.toThrow(
				"Cannot cancel reservation less than 24 hours before start time",
			);
		});
	});

	describe("getUpcomingReservations", () => {
		test("devrait retourner les réservations à venir", async () => {
			const mockReservations: TestReservationRow[] = [
				{
					id: 1,
					slot_id: 1,
					user_id: 1,
					google_meet_link: "https://meet.google.com/123",
					start_at: new Date(),
					duration: 60,
				},
			];

			(client.query as QueryMock<TestReservationRow[]>).mockResolvedValueOnce([
				mockReservations,
				[],
			]);

			const result = await ReservationRepository.getUpcomingReservations(1);
			expect(result).toEqual(mockReservations);
		});
	});

	describe("checkReservationConflict", () => {
		test("devrait retourner true si un conflit existe", async () => {
			(client.query as QueryMock<{ count: number }[]>).mockResolvedValueOnce([
				[{ count: 1 }],
				[],
			]);

			const result = await ReservationActions.checkReservationConflict(1, 1);
			expect(result).toBe(true);
		});

		test("devrait retourner false si aucun conflit n'existe", async () => {
			(client.query as QueryMock<{ count: number }[]>).mockResolvedValueOnce([
				[{ count: 0 }],
				[],
			]);

			const result = await ReservationActions.checkReservationConflict(1, 1);
			expect(result).toBe(false);
		});
	});
});
