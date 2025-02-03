import { ReservationRepository } from "../../src/modules/reservation/ReservationRepository";
import { AbstractSeeder } from "./AbstractSeeder";

export class ReservationSeeder extends AbstractSeeder {
	async run() {
		const reservations = [
			{
				slot_id: 1,
				user_id: 2,
				start_at: new Date(),
				duration: 60,
				google_meet_link: "https://meet.google.com/example",
			},
		];

		for (const res of reservations) {
			await ReservationRepository.create(res);
		}
	}
}
