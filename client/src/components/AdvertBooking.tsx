import React, { useState, useEffect } from "react";
import "./AdvertBooking.css";

const WeekScheduler = () => {
	const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
	const [selectedSlot, setSelectedSlot] = useState<string | null>(null); // Un seul créneau sélectionné
	const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
	const [availabilities, setAvailabilities] = useState<{
		[key: string]: boolean;
	}>({});
	const [reservations, setReservations] = useState<{ [key: string]: boolean }>(
		{},
	);

	const generateDays = (weekOffset: number) => {
		const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
		return days.map((day) => `${day} S${weekOffset}`);
	};

	const days = generateDays(currentWeekOffset);
	const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

	useEffect(() => {
		const initialAvailabilities: { [key: string]: boolean } = {
			"Lundi S0-8": true,
			"Lundi S0-9": true,
			"Mardi S0-10": true,
			"Mercredi S0-14": true,
			"Jeudi S0-16": true,
			"Vendredi S0-18": true,
		};
		setAvailabilities(initialAvailabilities);
	}, []);

	const toggleSlot = (day: string, hour: number) => {
		const slotKey = `${day}-${hour}`;
		if (availabilities[slotKey] && !reservations[slotKey]) {
			setSelectedSlot((prev) => (prev === slotKey ? null : slotKey));
			setShowBookingConfirmation(false);
		} else {
			alert("Ce créneau n'est pas disponible ou est déjà réservé.");
		}
	};

	const changeWeek = (offset: number) => {
		setCurrentWeekOffset((prev) => prev + offset);
		setSelectedSlot(null);
		setShowBookingConfirmation(false);
	};

	// Gérer la réservation
	const handleBooking = () => {
		if (selectedSlot) {
			const newReservations = { ...reservations };
			const newAvailabilities = { ...availabilities };

			newReservations[selectedSlot] = true;
			delete newAvailabilities[selectedSlot];

			const [day] = selectedSlot.split("-");
			for (const hour of hours) {
				const otherSlotKey = `${day}-${hour}`;
				if (otherSlotKey !== selectedSlot && newAvailabilities[otherSlotKey]) {
					newAvailabilities[otherSlotKey] = false; // Marquer comme indisponible
				}
			}

			setReservations(newReservations);
			setAvailabilities(newAvailabilities);
			setSelectedSlot(null); // Réinitialiser la sélection
			setShowBookingConfirmation(true);
		} else {
			alert("Veuillez sélectionner un créneau.");
		}
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
				<div className="grid-header empty-cell" />
				{days.map((day) => (
					<div key={day} className="grid-header">
						{day}
					</div>
				))}

				{hours.map((hour) => (
					<React.Fragment key={hour}>
						<div className="grid-time">{`${hour.toString().padStart(2, "0")}:00`}</div>
						{days.map((day) => {
							const slotKey = `${day}-${hour}`;
							const isAvailable = availabilities[slotKey];
							const isReserved = reservations[slotKey];
							const isSelected = selectedSlot === slotKey;
							return (
								<div
									key={slotKey}
									className={`grid-slot ${
										isSelected ? "selected" : isReserved ? "reserved" : ""
									} ${!isAvailable ? "unavailable" : ""}`}
									onClick={() => toggleSlot(day, hour)}
									onKeyDown={() => toggleSlot(day, hour)}
									// biome-ignore lint/a11y/useSemanticElements: <explanation>
									role="button"
									tabIndex={0}
								>
									{isSelected ? "✓" : isReserved ? "✗" : ""}
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
					disabled={!selectedSlot}
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
