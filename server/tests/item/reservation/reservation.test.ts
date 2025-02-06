import { jest } from "@jest/globals";
import type { FieldPacket, RowDataPacket } from "mysql2/promise";
import client from "../../../database/client";
import { ReservationActions } from "../../../src/modules/reservation/ReservationActions";

// On mocke la fonction generateGoogleMeetLink sans spécifier de deuxième argument générique
jest.mock("../../../src/utils/googleMeet", () => ({
	generateGoogleMeetLink: jest.fn(() =>
		Promise.resolve("https://meet.google.com/test-test-test"),
	),
}));

// Définition d'un alias de type pour le mock de databaseClient.query
// Nous utilisons jest.Mock qui permet de définir le type de retour et des arguments
type QueryFn<T> = (...args: unknown[]) => Promise<[T, FieldPacket[]]>;
type QueryMock<T> = jest.Mock<QueryFn<T>>;

describe("ReservationActions.getUserReservations", () => {
	it("should return user reservations", async () => {
		// Données simulées pour les réservations
		const mockReservations = [
			{ id: 1, user_id: 1, google_meet_link: "https://meet.google.com/test1" },
			{ id: 2, user_id: 1, google_meet_link: "https://meet.google.com/test2" },
		] as RowDataPacket[];

		// Création du mock typé pour la méthode query
		const mockClientQuery = jest
			.fn<QueryFn<RowDataPacket[]>>()
			.mockResolvedValue([mockReservations, []]);

		// Remplacer l'implémentation de la méthode query du client de base de données par notre mock
		jest
			.spyOn(require("../../../database/client"), "query")
			.mockImplementation(mockClientQuery);

		// Appel de la méthode getUserReservations
		const result = await ReservationActions.getUserReservations(1);

		// Vérifications
		expect(result).toHaveLength(2);
		expect(result[0].google_meet_link).toBe("https://meet.google.com/test1");
		expect(result[1].google_meet_link).toBe("https://meet.google.com/test2");
		expect(mockClientQuery).toHaveBeenCalledTimes(1);
	});
});
