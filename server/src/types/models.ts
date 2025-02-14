export interface Reservation {
	id: number;
	slot_id: number;
	user_id: number;
	google_meet_link: string;
	status: "pending" | "confirmed" | "cancelled" | "completed";
	created_at?: Date;
	start_at?: Date;
	duration?: number;
	slot_meet_link?: string;
}

export interface Goat {
	id: number;
	name: string;
	first_name: string;
	email: string;
	password: string;
	picture: string;
	presentation: string;
	video: string | null;
}

export interface ReservationDetails {
	id: number;
	slot_id: number;
	user_id: number;
	google_meet_link: string;
	date: string;
	time: string;
	meetLink: string;
	goatName: string;
}

export interface Slot {
	id: number;
	start_at: Date;
	end_at: Date;
	status: "available" | "reserved" | "cancelled";
	advert_id: number;
	goat_id: number;
	meet_link?: string;
}

export interface Advert {
	id: number;
	description: string;
	goat_id: number;
	main_tag_id: number;
	sub_tag_id: number;
}

export interface MainTag {
	id: number;
	name: string;
	subTags?: SubTag[];
}

export interface SubTag {
	id: number;
	name: string;
	main_tag_id: number;
}
