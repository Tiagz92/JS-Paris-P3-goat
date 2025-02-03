import React, { useState, useEffect } from "react";
import "./AdvertBooking.css";

interface Slot {
	id: number;
	start_at: string;
	duration: number;
	status: "available" | "reserved" | "cancelled" | "completed";
}

interface ReservationResponse {
	id: number;
	google_meet_link: string;
	status: string;
}

interface AvailabilityMap {
	[key: string]: {
		slot: Slot;
		available: boolean;
	};
}

const WeekScheduler = ({ advertId }: { advertId: number }) => {
	const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
	const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
	const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
	const [availableSlots, setAvailableSlots] = useState<AvailabilityMap>({});
	const [isLoading, setIsLoading] = useState(false);
	const [bookingInProgress, setBookingInProgress] = useState(false);
	const [meetLink, setMeetLink] = useState<string | null>(null);

	const generateDays = (weekOffset: number) => {
		const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
		return days.map((day) => `${day} S${weekOffset}`);
	};

	const changeWeek = (offset: number) => {
		// Limite le nombre de semaines passées ou futures
		const MAX_WEEKS_BACK = 4; // Nombre max de semaines dans le passé
		const MAX_WEEKS_FORWARD = 12; // Nombre max de semaines dans le futur

		// Calcule la nouvelle valeur de l'offset
		const newOffset = currentWeekOffset + offset;

		// Vérifie que le nouvel offset est dans les limites autorisées
		if (newOffset >= -MAX_WEEKS_BACK && newOffset <= MAX_WEEKS_FORWARD) {
			setCurrentWeekOffset(newOffset);
			// Réinitialise la sélection de créneau lors du changement de semaine
			setSelectedSlotId(null);
			setShowBookingConfirmation(false);
			setMeetLink(null);
		} else {
			// Optionnel : afficher un message si on dépasse les limites
			alert(
				offset > 0
					? "Vous ne pouvez pas réserver plus de 12 semaines à l'avance"
					: "Vous ne pouvez pas remonter plus de 4 semaines en arrière",
			);
		}
	};

	const days = generateDays(currentWeekOffset);
	const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

	useEffect(() => {
		const fetchSlots = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(
					`/api/adverts/${advertId}/slots?week=${currentWeekOffset}`,
				);
				const slots: Slot[] = await response.json();

				const slotsMap: AvailabilityMap = {};

				// Remplacement de forEach par for...of
				for (const slot of slots) {
					const date = new Date(slot.start_at);
					const day = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"][
						date.getDay() - 1
					];
					const hour = date.getHours();
					const key = `${day} S${currentWeekOffset}-${hour}`;

					slotsMap[key] = {
						slot,
						available: slot.status === "available",
					};
				}

				setAvailableSlots(slotsMap);
			} catch (error) {
				console.error("Erreur lors du chargement des créneaux :", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchSlots();
	}, [advertId, currentWeekOffset]);

	const toggleSlot = (day: string, hour: number) => {
		if (bookingInProgress) return;

		const slotKey = `${day}-${hour}`;
		const slotInfo = availableSlots[slotKey];

		if (slotInfo?.available) {
			setSelectedSlotId(
				selectedSlotId === slotInfo.slot.id ? null : slotInfo.slot.id,
			);
			setShowBookingConfirmation(false);
			setMeetLink(null);
		} else {
			alert("Ce créneau n'est pas disponible ou est déjà réservé.");
		}
	};

	const handleBooking = async () => {
		if (selectedSlotId && !bookingInProgress) {
			setBookingInProgress(true);
			try {
				const response = await fetch("/api/reservations", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						slot_id: selectedSlotId,
						user_id: 1, // À remplacer par l'ID de l'utilisateur connecté
					}),
				});

				if (response.ok) {
					const reservationData: ReservationResponse = await response.json();

					const newAvailableSlots = { ...availableSlots };
					for (const key of Object.keys(newAvailableSlots)) {
						const slotInfo = newAvailableSlots[key];
						if (slotInfo.slot.id === selectedSlotId) {
							slotInfo.available = false;
							slotInfo.slot.status = "reserved";
						}
					}

					setAvailableSlots(newAvailableSlots);
					setSelectedSlotId(null);
					setShowBookingConfirmation(true);
					setMeetLink(reservationData.google_meet_link);
				} else {
					throw new Error("Erreur lors de la réservation");
				}
			} catch (error) {
				console.error("Erreur lors de la réservation :", error);
				alert("Erreur lors de la réservation");
			} finally {
				setBookingInProgress(false);
			}
		}
	};

	return (
		<div className="week-scheduler">
			<div className="scheduler-header">
				<button
					type="button"
					onClick={() => changeWeek(-1)}
					disabled={isLoading}
				>
					Semaine Précédente
				</button>
				<h2>Sélectionne ton créneau ! (Semaine {currentWeekOffset})</h2>
				<button
					type="button"
					onClick={() => changeWeek(1)}
					disabled={isLoading}
				>
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
						<div className="grid-time">
							{`${hour.toString().padStart(2, "0")}:00`}
						</div>
						{days.map((day) => {
							const slotKey = `${day}-${hour}`;
							const slotInfo = availableSlots[slotKey];
							const isAvailable = slotInfo?.available;
							const isSelected = slotInfo?.slot.id === selectedSlotId;

							return (
								<button
									type="button"
									key={slotKey}
									className={`grid-slot ${
										isLoading
											? "loading"
											: isSelected
												? "selected"
												: !isAvailable
													? "unavailable"
													: ""
									}`}
									onClick={() => toggleSlot(day, hour)}
									disabled={isLoading || !isAvailable}
								>
									{isSelected ? "✓" : ""}
								</button>
							);
						})}
					</React.Fragment>
				))}
			</div>

			<div className="booking-section">
				<button
					type="button"
					onClick={handleBooking}
					className={`booking-button ${bookingInProgress ? "loading" : ""}`}
					disabled={!selectedSlotId || bookingInProgress}
				>
					{bookingInProgress ? "Réservation en cours..." : "Réserver"}
				</button>
				{showBookingConfirmation && (
					<div className="booking-confirmation">
						<p>Votre réservation a été enregistrée.</p>
						{meetLink && (
							<div className="meet-link">
								<p>Voici votre lien Google Meet pour la session :</p>
								<a
									href={meetLink}
									target="_blank"
									rel="noopener noreferrer"
									className="meet-link-button"
								>
									Rejoindre la réunion
								</a>
								<p className="meet-link-info">
									Ce lien a été sauvegardé et sera disponible dans vos
									réservations.
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default WeekScheduler;
