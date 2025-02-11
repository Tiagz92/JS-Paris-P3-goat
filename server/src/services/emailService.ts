interface ReservationDetails {
	id: number;
	slot_id: number;
	user_id: number;
	google_meet_link: string;
}

export const sendReservationConfirmation = async (
	email: string,
	reservationDetails: ReservationDetails,
) => {
	// Implémentation du service d'envoi d'email
	console.info("Sending confirmation email to:", email, reservationDetails);
};
