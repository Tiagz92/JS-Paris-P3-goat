import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AdvertDetails.css";
import AdvertBooking from "../components/AdvertBooking";

type Advert = {
	description: string;
	goat_id: number;
	main_tag_name: number;
	sub_tag_name: number;
	image_url: string;
	goat_firstname: string;
	goat_picture: string;
};

function AdvertDetails() {
	const { id } = useParams<{ id: string }>();
	const [advert, setAdvert] = useState<Advert | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAdvertDetails = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/adverts/${id}`,
				);

				if (!response.ok) {
					throw new Error("Erreur lors du chargement des données.");
				}

				const data: Advert = await response.json();
				setAdvert(data);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message || "Une erreur inconnue s'est produite.");
				} else {
					setError("Une erreur inconnue s'est produite.");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchAdvertDetails();
	}, [id]);

	if (loading) return <div className="status">Chargement...</div>;
	if (error) return <div className="status">Erreur : {error}</div>;
	if (!advert) return <div className="status">Aucune annonce trouvée</div>;

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
				<AdvertBooking />
			</div>
			<div className="advert-reservation">
				<button type="button" className="reservation-button">
					Réserver
				</button>
			</div>
		</div>
	);
}

export default AdvertDetails;
