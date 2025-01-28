import { generateGoogleMeetLink } from "../../utils/googleMeet";
import { ReservationRepository } from "./ReservationRepository";

export const ReservationActions = {
	async createReservation(user_id: number, start_time: Date, end_time: Date) {
		const googleMeetLink = await generateGoogleMeetLink(start_time, end_time);
		return ReservationRepository.create({
			user_id,
			start_time,
			end_time,
			google_meet_link: googleMeetLink,
		});
	},

	async getReservationById(id: number) {
		return ReservationRepository.findById(id);
	},
};
