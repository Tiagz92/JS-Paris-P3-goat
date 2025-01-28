import { ReservationRepository } from "../../src/modules/reservation/ReservationRepository";
import { AbstractSeeder } from "./AbstractSeeder";

export class ReservationSeeder extends AbstractSeeder {
	async run() {
		const reservation = [
			{
				user_id: 1,
				start_time: new Date("2023-10-25T09"),
				end_time: new Date("2023-10-25T10:00:00"),
				google_meet_link: "https://meet.google.com/example",
			},
		];

		for (const res of reservation) {
			await ReservationRepository.create(res);
		}
	}
}
