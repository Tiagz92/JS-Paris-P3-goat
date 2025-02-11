export interface Reservation {
	id: number;
	slot_id: number;
	user_id: number;
	google_meet_link: string;
	status?: "pending" | "confirmed" | "cancelled" | "completed";
	created_at?: Date;
	start_at?: Date;
	duration?: number;
	slot_meet_link?: string;
}

export interface Goat {
	id: number;
	lastname: string;
	firstname: string;
	name: string;
	born_at: Date;
	email: string;
	password: string;
	picture: string;
	presentation: string;
	video: string | null;
}
