import React, { useState } from "react";
import "./AdvertBooking.css";

const WeekScheduler = () => {
	const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
	const [selectedSlots, setSelectedSlots] = useState<{
		[key: string]: boolean;
	}>({});

	const generateDays = (weekOffset: number) => {
		const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
		return days.map((day) => `${day} S${weekOffset}`);
	};

	const days = generateDays(currentWeekOffset);
	const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

	const toggleSlot = (day: string, hour: number) => {
		const slotKey = `${day}-${hour}`;
		setSelectedSlots((prev) => ({
			...prev,
			[slotKey]: !prev[slotKey],
		}));
	};

	const changeWeek = (offset: number) => {
		setCurrentWeekOffset((prev) => prev + offset);
	};

	return (
		<div className="week-scheduler">
			<h2>(Semaine {currentWeekOffset})</h2>
			<div className="scheduler-header">
				<button type="button" onClick={() => changeWeek(-1)}>
					Semaine Précédente
				</button>
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
		</div>
	);
};

export default WeekScheduler;
