import { useEffect, useState } from "react";
import "./AdvertBooking.css";

interface Slot {
	date: string;
	hour: string;
}

interface AdvertBookingProps {
	readonly selectedSlot: Slot | null;
	readonly setSelectedSlot: (slot: Slot | null) => void;
}

function AdvertBooking({ selectedSlot, setSelectedSlot }: AdvertBookingProps) {
	const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
	const [days, setDays] = useState<{ name: string; fullDate: string }[]>([]);
	const [reservedSlots, setReservedSlots] = useState<Slot[]>([]);

	useEffect(() => {
		const storedReservations = JSON.parse(
			localStorage.getItem("reservations") ?? "[]",
		);
		setReservedSlots(storedReservations);
	}, []);

	useEffect(() => {
		const generateDays = (weekOffset: number) => {
			const startDate = new Date();
			startDate.setDate(
				startDate.getDate() - startDate.getDay() + 1 + weekOffset * 7,
			);
			const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

			return days.map((day, index) => {
				const date = new Date(startDate);
				date.setDate(startDate.getDate() + index);
				return {
					name: day,
					fullDate: date.toLocaleDateString("fr-FR"),
				};
			});
		};

		setDays(generateDays(currentWeekOffset));
	}, [currentWeekOffset]);

	const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

	const isSlotReserved = (date: string, hour: number) => {
		return reservedSlots.some(
			(slot) => slot.date === date && slot.hour === `${hour}:00`,
		);
	};

	const toggleSlot = (
		day: { name: string; fullDate: string },
		hour: number,
	) => {
		if (isSlotReserved(day.fullDate, hour)) return;
		setSelectedSlot({ date: day.fullDate, hour: `${hour}:00` });
	};

	return (
		<div className="week-scheduler">
			<h2>(Semaine {currentWeekOffset})</h2>
			<div className="scheduler-header">
				<button
					type="button"
					onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
				>
					Semaine Précédente
				</button>
				<button
					type="button"
					onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
				>
					Semaine Suivante
				</button>
			</div>
			<div className="scheduler-grid">
				{days.map((day) => (
					<div key={day.fullDate} className="day-column">
						<strong>{day.name}</strong>
						{hours.map((hour) => {
							const reserved = isSlotReserved(day.fullDate, hour);

							return (
								<button
									key={`${day.fullDate}-${hour}`}
									className={`slot-button${selectedSlot?.date === day.fullDate && selectedSlot?.hour === `${hour}:00` ? " selected" : ""}${reserved ? " reserved" : ""}`}
									type="button"
									onClick={() => toggleSlot(day, hour)}
									disabled={reserved}
								>
									{`${hour}:00`}
								</button>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}

export default AdvertBooking;
