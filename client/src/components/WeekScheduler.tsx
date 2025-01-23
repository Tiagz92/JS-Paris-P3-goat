import { useState } from "react";

const WeekScheduler: React.FC = () => {
	const [selectedSlots, setSelectedSlots] = useState<{
		[key: string]: boolean;
	}>({});
	const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
	const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

	const toggleSlot = (day: string, hour: number) => {
		const slotKey = `${day}-${hour}`;
		setSelectedSlots((prev) => ({
			...prev,
			[slotKey]: !prev[slotKey],
		}));
	};

	return (
		<table>
			<thead>
				<tr>
					<th>Heure</th>
					{days.map((day) => (
						<th key={day}>{day}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{hours.map((hour) => (
					<tr key={hour}>
						<td>{`${hour.toString().padStart(2, "0")}:00`}</td>
						{days.map((day) => {
							const slotKey = `${day}-${hour}`;
							return (
								<td key={slotKey}>
									{/* Placez un bouton interactif dans la cellule au lieu d’ajouter role="button" directement sur <td>. */}
									<button
										type="button"
										onClick={() => toggleSlot(day, hour)}
										// Optionnel : style pour que le bouton occupe toute la cellule
										style={{ width: "100%", height: "100%", cursor: "pointer" }}
									>
										{selectedSlots[slotKey] ? "✓" : ""}
									</button>
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default WeekScheduler;
