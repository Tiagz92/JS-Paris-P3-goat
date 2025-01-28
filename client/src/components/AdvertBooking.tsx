import React, { useState } from "react";
import "./AdvertBooking.css";

const WeekScheduler = () => {
	const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
	const [selectedSlots, setSelectedSlots] = useState<{
		[key: string]: boolean;
	}>({});
	const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

	const generateDays = (weekOffset: number) => {
		const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
		return days.map((day) => `${day} S${weekOffset}`);
	};

	const days = generateDays(currentWeekOffset);
	const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

	const toggleSlot = (day: string, hour: number) => {
		const slotKey = `${day}-${hour}`;
		setSelectedSlots((prev) => ({
			...prev,
			[slotKey]: !prev[slotKey],
		}));
		setShowBookingConfirmation(false);
	};

	const changeWeek = (offset: number) => {
		setCurrentWeekOffset((prev) => prev + offset);
		setShowBookingConfirmation(false);
	};

	const handleBooking = () => {
		// Ici vous pourriez ajouter la logique de réservation
		setShowBookingConfirmation(true);
	};

	return (
		<div className="week-scheduler">
			<div className="scheduler-header">
				<button type="button" onClick={() => changeWeek(-1)}>
					Semaine Précédente
				</button>
				<h2>Sélectionne ton créneau ! (Semaine {currentWeekOffset})</h2>
				<button type="button" onClick={() => changeWeek(1)}>
					Semaine Suivante
				</button>
			</div>
			<div className="scheduler-grid">
				{/* En-têtes des Jours */}
				<div className="grid-header empty-cell" />
				{days.map((day) => (
					<div key={day} className="grid-header">
						{day}
					</div>
				))}

				{/* Grille des Heures et Slots */}
				{hours.map((hour) => (
					<React.Fragment key={hour}>
						<div className="grid-time">{`${hour.toString().padStart(2, "0")}:00`}</div>
						{days.map((day) => {
							const slotKey = `${day}-${hour}`;
							return (
								<div
									key={slotKey}
									className={`grid-slot ${selectedSlots[slotKey] ? "selected" : ""}`}
									onClick={() => toggleSlot(day, hour)}
									onKeyDown={() => toggleSlot(day, hour)}
									// biome-ignore lint/a11y/useSemanticElements: <explanation>
									role="button"
									tabIndex={0}
								>
									{selectedSlots[slotKey] ? "✓" : ""}
								</div>
							);
						})}
					</React.Fragment>
				))}
			</div>

			<div className="booking-section">
				<button
					type="button"
					onClick={handleBooking}
					className="booking-button"
				>
					Réserver
				</button>
				{showBookingConfirmation && (
					<div className="booking-confirmation">
						Votre réservation a été enregistrée.
					</div>
				)}
			</div>
		</div>
	);
};

export default WeekScheduler;
