import React, { useState, useEffect } from "react";
import "./AdvertBooking.css";

interface Slot {
	id: number;
	start_at: string;
	duration: number;
	status: "available" | "reserved" | "cancelled" | "completed";
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

	const generateDays = (_weekOffset: number) => {
		const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
		return days;
	};

	const changeWeek = (offset: number) => {
		const MAX_WEEKS_BACK = 4;
		const MAX_WEEKS_FORWARD = 12;

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
				console.info(
					"Fetching slots for advertId:",
					advertId,
					"week:",
					currentWeekOffset,
				);
				const response = await fetch(
					`http://localhost:3310/api/adverts/${advertId}/slots?week=${currentWeekOffset}`,
					{
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
					},
				);

				if (!response.ok) {
					throw new Error(`Erreur HTTP: ${response.status}`);
				}

				const slots = await response.json();
				console.info("Slots reçus du serveur:", slots);

				const slotsMap: AvailabilityMap = {};
				for (const slot of slots) {
					const date = new Date(slot.start_at);
					const dayIndex = date.getDay() - 1;
					const day = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"][
						dayIndex
					];
					const hour = date.getHours();
					const key = `${day} S${currentWeekOffset} S${currentWeekOffset}-${hour}`;

					console.info("Traitement du créneau:", {
						date,
						dayIndex,
						day,
						hour,
						key,
						status: slot.status,
						rawSlot: slot,
					});

					slotsMap[key] = {
						slot,
						available: slot.status === "available",
					};
				}

				console.info("Carte finale des créneaux:", slotsMap);
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

		const key = `${day} S${currentWeekOffset} S${currentWeekOffset}-${hour}`;
		const slotInfo = availableSlots[key];

		console.info("Toggling slot:", {
			key,
			exists: !!slotInfo,
			available: slotInfo?.available,
			status: slotInfo?.slot?.status,
		});

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
		if (!selectedSlotId || bookingInProgress) return;

		setBookingInProgress(true);

		try {
			// Récupérer l'email de l'utilisateur connecté (à adapter selon votre système d'authentification)
			const userEmail =
				localStorage.getItem("userEmail") ||
				sessionStorage.getItem("userEmail");

			if (!userEmail) {
				throw new Error("Vous devez être connecté pour réserver un créneau");
			}

			const response = await fetch(
				`http://localhost:3310/api/slots/${selectedSlotId}/reserve`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						// Ajouter le token d'authentification si nécessaire
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify({
						email: userEmail,
					}),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Erreur lors de la réservation");
			}

			const data = await response.json();
			setMeetLink(data.meetLink);
			setShowBookingConfirmation(true);

			// Rafraîchir les créneaux
			const fetchSlots = async () => {
				// ... votre code existant pour fetchSlots ...
			};
			await fetchSlots();
		} catch (error) {
			console.error("Erreur lors de la réservation :", error);
			alert(
				error instanceof Error
					? error.message
					: "Erreur lors de la réservation",
			);
		} finally {
			setBookingInProgress(false);
		}
	};

	const isSlotAvailable = (day: string, hour: number) => {
		const searchKey = `${day} S${currentWeekOffset} S${currentWeekOffset}-${hour}`;
		const allKeys = Object.keys(availableSlots);
		console.info("Comparaison des clés:", {
			searchKey,
			allKeys,
			match: allKeys.includes(searchKey),
		});
		return availableSlots[searchKey]?.available === true;
	};

	const renderTimeSlots = () => {
		return hours.map((hour) => (
			<React.Fragment key={hour}>
				<div className="time-slot">{`${hour}:00`}</div>
				{days.map((day) => {
					const isAvailable = isSlotAvailable(day, hour);
					return (
						<button
							type="button"
							key={`${day} S${currentWeekOffset} S${currentWeekOffset}-${hour}`}
							className={`slot ${isAvailable ? "available" : "unavailable"}`}
							onClick={() => toggleSlot(day, hour)}
							disabled={!isAvailable}
						>
							{/* Pas de texte, le style CSS s'occupera de l'apparence */}
						</button>
					);
				})}
			</React.Fragment>
		));
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
					<div key={`${day} S${currentWeekOffset}`} className="grid-header">
						{`${day} S${currentWeekOffset}`}
					</div>
				))}

				{renderTimeSlots()}
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
