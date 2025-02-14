import { API_CONFIG } from "../config/api";

export interface ReservationRequest {
	slot_id: number;
	user_id: number;
	duration?: number;
}

interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

export const validateReservation = async (
	reservation: Partial<ReservationRequest>,
): Promise<ValidationResult> => {
	const errors: string[] = [];

	if (!reservation.slot_id) {
		errors.push("slot_id is required");
	}
	if (!reservation.user_id) {
		errors.push("user_id is required");
	}

	if (
		reservation.duration &&
		reservation.duration > API_CONFIG.validation.reservation.maxDuration
	) {
		errors.push(
			`Duration cannot exceed ${API_CONFIG.validation.reservation.maxDuration} minutes`,
		);
	}

	try {
		const response = await fetch(
			`/api/reservations/count/${reservation.user_id}`,
		);
		const { count } = await response.json();

		if (count >= API_CONFIG.validation.reservation.maxBookingsPerUser) {
			errors.push(
				`User cannot have more than ${API_CONFIG.validation.reservation.maxBookingsPerUser} active bookings per week`,
			);
		}
	} catch (error) {
		console.error("Error checking reservation count:", error);
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};
