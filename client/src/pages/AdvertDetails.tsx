
import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import "./AdvertDetails.css";
import AdvertBooking from "../components/AdvertBooking";
import type { AppContextInterface } from "../types/appContext.type";

interface Slot {
  date: string;
  hour: string;
}

interface Advert {
	goat_id: number;
	goat_picture: string;
	goat_firstname: string;
	description: string;
	main_tag_name: string;
	sub_tag_name: string;
}

const AdvertDetails = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [advert, setAdvert] = useState<Advert | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [reservedSlots, setReservedSlots] = useState<Slot[]>([]);
	const { user } = useOutletContext<AppContextInterface>();

	useEffect(() => {
		if (!user?.token) {
			setError("Utilisateur non authentifié");
			setLoading(false);
			return;
		}

		const fetchAdvertDetails = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/adverts/${id}`,
					{
						headers: { Authorization: user.token },
					},
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
	}, [id, user]);

const reservationData = advert && selectedSlot && {
		advert_id: Number(id),
		user_id: user.id,
		goat_id: advert.goat_id,
    goat_firstname: advert.goat_firstname,
		start_at: `${selectedSlot.date} ${selectedSlot.hour}`,
		duration: 1,
		meet_link: "https://meet.jit.si/GoApprendreTransmettre",
		comment: message,
	};
	const handleConfirm = async () => {
		if (!selectedSlot || !user?.token || !advert) return;

		const formattedDate = `${selectedSlot.date}T${selectedSlot.hour}:00Z`;
		const date = new Date(formattedDate);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/slots`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: user.token,
					},
					body: JSON.stringify(reservationData),
				},
			);

			if (!response.ok) throw new Error("Erreur lors de la réservation.");

	await fetch(`${import.meta.env.VITE_API_URL}/api/send-confirmation-email`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: user.token,
		},
		body: JSON.stringify({
			email: user.email,
			reservation: reservationData,
		}),
	});

			const updatedReservations = [...reservedSlots, selectedSlot];
			setReservedSlots(updatedReservations);
			localStorage.setItem("reservations", JSON.stringify(updatedReservations));

			setIsModalOpen(false);
			navigate(`/profile/${user.id}`);
		} catch (err) {
			setError((err as Error).message);
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
						src={`http://localhost:3310/upload/${advert.goat_picture}`}
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
									Cours donné par : {advert.goat_firstname}.
								</p>
								<p>{advert.description}</p>
								<p className="date">
									Date : {selectedSlot?.date} à {selectedSlot?.hour}
								</p>
								<p className="message">
									Mon message pour {advert.goat_firstname} (facultatif)
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
	

export default AdvertDetails;