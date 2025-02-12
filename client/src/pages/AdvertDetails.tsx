import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdvertDetails.css";
import AdvertBooking from "../components/AdvertBooking";

interface Slot {
	date: string;
	hour: string;
}

const AdvertDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	interface Advert {
		goat_id: number;
		goat_picture: string;
		goat_firstname: string;
		description: string;
		main_tag_name: string;
		sub_tag_name: string;
	}

	const [advert, setAdvert] = useState<Advert | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const fetchAdvertDetails = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/adverts/${id}`,
				);
				if (!response.ok)
					throw new Error("Erreur lors du chargement des données.");
				const data = await response.json();
				setAdvert(data);
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};
		fetchAdvertDetails();
	}, [id]);

	const handleConfirm = async () => {
		if (!selectedSlot) return;

		const userId = localStorage.getItem("userId");

		if (!userId) {
			console.error("Utilisateur non connecté !");
			return;
		}

		const date = new Date(`${selectedSlot.date}T${selectedSlot.hour}:00`);

		const reservationData = {
			advert_id: id,
			goat_id: advert?.goat_id,
			start_at: date.toISOString(),
			duration: 1,
			meet_link: "toto",
			comment: "toto",
		};

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/slots/`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(reservationData),
				},
			);

			if (!response.ok) throw new Error("Erreur lors de la réservation.");

			const storedReservations = JSON.parse(
				localStorage.getItem("reservations") ?? "[]",
			);
			// Mettre à jour localStorage avec la nouvelle réservation
			const updatedReservations = [...storedReservations, selectedSlot];
			localStorage.setItem("reservations", JSON.stringify(updatedReservations));

			setReservedSlots(updatedReservations); // Mise à jour de l'état local

			setIsModalOpen(false);
			navigate(`/profile/${userId}`);
		} catch (err) {
			console.error("Erreur :", err);
		}
	};

	if (loading) return <div>Chargement...</div>;
	if (error) return <div>Erreur : {error}</div>;
	if (!advert) return <div>Aucune annonce trouvée</div>;

	return (
		<div className="advert-container">
			<div className="advert-profile">
				<div className="profile-header">
					<img
						className="img-goat"
						src={advert.goat_picture}
						alt={advert.goat_firstname}
					/>
					<h1 className="profile-name">{advert.goat_firstname}</h1>
				</div>
				<div className="profile-tags">
					<button type="button" className="tag-button-main">
						{advert.main_tag_name}
					</button>
					<button type="button" className="tag-button-sub">
						{advert.sub_tag_name}
					</button>
				</div>
				<p className="profile-description">{advert.description}</p>
			</div>
			<div className="profile-calendar">
				<h1>Sélectionnez une date</h1>
				<AdvertBooking
					selectedSlot={selectedSlot}
					setSelectedSlot={setSelectedSlot}
				/>
				<div className="advert-reservation">
					<button
						type="button"
						className="reservation-button"
						onClick={() => setIsModalOpen(true)}
						disabled={!selectedSlot}
					>
						Réserver
					</button>
					{isModalOpen && (
						<div className="modal-overlay">
							<div className="modal-content">
								<h2>Récapitulatif</h2>
								<p className="tag-name">
									{advert.main_tag_name} & {advert.sub_tag_name}
								</p>
								<p className="goat-name">
									Cour donné par : {advert.goat_firstname}.
								</p>
								<p>{advert.description}</p>
								<p className="date">
									Date : {selectedSlot?.date} à {selectedSlot?.hour}
								</p>
								<p className="message">
									Mon message pour {advert.goat_firstname} (facultatif){" "}
								</p>
								<input
									type="text"
									placeholder="Laisser un message ..."
									onChange={(e) => setMessage(e.target.value)}
									value={message}
								/>
								<div className="modal-buttons">
									<button type="button" onClick={handleConfirm}>
										Valider ma réservation
									</button>
									<button type="button" onClick={() => setIsModalOpen(false)}>
										Annuler
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

function setReservedSlots(updatedReservations: Slot[]) {
	localStorage.setItem("reservations", JSON.stringify(updatedReservations));
}

export default AdvertDetails;
