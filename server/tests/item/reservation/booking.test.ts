import "dotenv/config"; // Charge les variables d'environnement
import { describe, expect, jest, test } from "@jest/globals";
import type {
	FieldPacket,
	ResultSetHeader,
	RowDataPacket,
} from "mysql2/promise";
import client from "../../../database/client";
import { ReservationActions } from "../../../src/modules/reservation/ReservationActions";
import { ReservationRepository } from "../../../src/modules/reservation/ReservationRepository";
import { generateGoogleMeetLink } from "../../../src/utils/googleMeet";

// Mock de generateGoogleMeetLink
jest.mock("../../../src/utils/googleMeet", () => ({
	generateGoogleMeetLink: jest.fn(),
}));

// Définition des interfaces pour les lignes de la base de données
interface SlotRow extends RowDataPacket {
	id: number;
	status: string;
	start_time: string;
	end_time: string;
}

interface ReservationRow extends RowDataPacket {
	id: number;
	user_id: number;
	slot_id: number;
	start_time: string;
	end_time: string;
	google_meet_link?: string;
}

describe("ReservationActions", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(client, "query").mockImplementation(async () => {
			return [[], []];
		});
	});

	test("createReservation should create a new reservation", async () => {
		const mockSlot: SlotRow = {
			id: 1,
			status: "available",
			start_time: "2024-02-01T10:00:00.000Z",
			end_time: "2024-02-01T11:00:00.000Z",
			constructor: { name: "RowDataPacket" as const },
		};

		jest
			.spyOn(client, "query")
			.mockImplementationOnce(async (): Promise<[SlotRow[], FieldPacket[]]> => {
				return [[mockSlot], [] as FieldPacket[]];
			});

		const mockReservationResult: ResultSetHeader = {
			insertId: 1,
			affectedRows: 1,
			fieldCount: 0,
			info: "",
			serverStatus: 2,
			warningStatus: 0,
			changedRows: 0,
			constructor: { name: "ResultSetHeader" as const },
		};

		jest
			.spyOn(client, "query")
			.mockImplementationOnce(
				async (): Promise<[ResultSetHeader, FieldPacket[]]> => {
					return [mockReservationResult, [] as FieldPacket[]];
				},
			);

		const userId = 1;
		const slotId = 1;
		const result = await ReservationActions.createReservation(userId, slotId);

		expect(result).toBeDefined();
		expect(result).toHaveProperty("insertId", 1);
	});

	test("createReservation should generate a Google Meet link", async () => {
		const mockSlot: SlotRow = {
			id: 1,
			status: "available",
			start_time: "2024-02-01T10:00:00.000Z",
			end_time: "2024-02-01T11:00:00.000Z",
			constructor: { name: "RowDataPacket" as const },
		};

		const mockMeetLink = "https://meet.google.com/test-link";
		(
			generateGoogleMeetLink as jest.MockedFunction<
				typeof generateGoogleMeetLink
			>
		).mockResolvedValue(mockMeetLink);

		jest
			.spyOn(client, "query")
			.mockImplementationOnce(async (): Promise<[SlotRow[], FieldPacket[]]> => {
				return [[mockSlot], [] as FieldPacket[]];
			});

		const mockReservationResult: ResultSetHeader = {
			insertId: 1,
			affectedRows: 1,
			fieldCount: 0,
			info: "",
			serverStatus: 2,
			warningStatus: 0,
			changedRows: 0,
			constructor: { name: "ResultSetHeader" as const },
		};

		jest
			.spyOn(client, "query")
			.mockImplementationOnce(
				async (): Promise<[ResultSetHeader, FieldPacket[]]> => {
					return [mockReservationResult, [] as FieldPacket[]];
				},
			);

		const userId = 1;
		const slotId = 1;
		await ReservationActions.createReservation(userId, slotId);

		expect(generateGoogleMeetLink).toHaveBeenCalledWith(
			expect.any(Date),
			expect.any(Date),
		);
	});

	test("createReservation should throw error if slot not found", async () => {
		jest
			.spyOn(client, "query")
			.mockImplementationOnce(async (): Promise<[[], FieldPacket[]]> => {
				return [[], [] as FieldPacket[]];
			});

		const userId = 1;
		const slotId = 999;

		await expect(
			ReservationActions.createReservation(userId, slotId),
		).rejects.toThrow("Slot not found or not available");
	});

	test("createReservation should throw error if slot is not available", async () => {
		const mockSlot: SlotRow = {
			id: 1,
			status: "booked",
			start_time: "2024-02-01T10:00:00.000Z",
			end_time: "2024-02-01T11:00:00.000Z",
			constructor: { name: "RowDataPacket" as const },
		};

		jest
			.spyOn(client, "query")
			.mockImplementationOnce(async (): Promise<[SlotRow[], FieldPacket[]]> => {
				return [[mockSlot], [] as FieldPacket[]];
			});

		const userId = 1;
		const slotId = 1;

		await expect(
			ReservationActions.createReservation(userId, slotId),
		).rejects.toThrow("Slot not found or not available");
	});

	test("getUserReservations should return user reservations", async () => {
		const mockReservations: ReservationRow[] = [
			{
				id: 1,
				user_id: 1,
				slot_id: 1,
				start_time: "2024-02-01T10:00:00.000Z",
				end_time: "2024-02-01T11:00:00.000Z",
				google_meet_link: "https://meet.google.com/test-link",
				constructor: { name: "RowDataPacket" as const },
			},
		];

		jest
			.spyOn(client, "query")
			.mockImplementationOnce(
				async (): Promise<[ReservationRow[], FieldPacket[]]> => {
					return [mockReservations, [] as FieldPacket[]];
				},
			);

		const userId = 1;
		const reservations =
			await ReservationRepository.getUserReservations(userId);

		expect(reservations[0]).toHaveProperty("google_meet_link");
		expect(reservations[0].google_meet_link).toMatch(
			/^https:\/\/meet\.google\.com\/.+$/,
		);
	});

	test("getUpcomingReservations should return future reservations", async () => {
		const mockReservations: ReservationRow[] = [
			{
				id: 1,
				user_id: 1,
				slot_id: 1,
				start_time: "2024-02-01T10:00:00.000Z",
				end_time: "2024-02-01T11:00:00.000Z",
				google_meet_link: "https://meet.google.com/test-link",
				constructor: { name: "RowDataPacket" as const },
			},
		];

		jest
			.spyOn(client, "query")
			.mockImplementationOnce(
				async (): Promise<[ReservationRow[], FieldPacket[]]> => {
					return [mockReservations, [] as FieldPacket[]];
				},
			);

		const userId = 1;
		const reservations =
			await ReservationRepository.getUpcomingReservations(userId);

		expect(reservations[0]).toHaveProperty("google_meet_link");
		expect(reservations[0].google_meet_link).toMatch(
			/^https:\/\/meet\.google\.com\/.+$/,
		);
	});
});
