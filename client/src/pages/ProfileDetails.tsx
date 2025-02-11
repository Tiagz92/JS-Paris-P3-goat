import "./ProfileDetails.css";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import AdvertBooking from "../components/AdvertBooking";
import type { AppContextInterface } from "../types/appContext.type";

type Goat = {
	id: number;
	lastname: string;
	firstname: string;
	picture: string;
	presentation: string;
	video: string;
};

function ProfilDetails() {
	const { id } = useParams<{ id: string }>();
	const [profile, setProfile] = useState<Goat | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { user } = useOutletContext<AppContextInterface>();

	useEffect(() => {
		const fetchProfilDetails = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/goats/${id}`,
					{
						headers: {
							Authorization: user.token,
						},
					},
				);

				if (!response.ok) {
					throw new Error("Erreur lors du chargement des données");
				}

				const data: Goat = await response.json();
				setProfile(data);
			} catch (error: unknown) {
				if (error instanceof Error) {
					setError(error.message || "Une erreur inconnue s'est produite.");
				} else {
					setError("Une erreur inconnue s'est produite.");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchProfilDetails();
	}, [id, user.token]);

	if (loading) return <div className="status">Chargement...</div>;
	if (error) return <div className="status">Erreur : {error}</div>;
	if (!profile) return <div className="status">Aucune profil trouvé</div>;

	return (
		<div className="profileContainer">
			<div className="Profile">
				<div className="profilePresentation">
					<div className="pictureContainer">
						<img
							className="pictureGoat"
							src={profile.picture}
							alt={profile.firstname}
						/>
					</div>
					<div className="textContainer">
						<h1>Bonjour {profile.firstname}</h1>
						<p className="profileDescription">{profile.presentation}</p>
					</div>
				</div>
				<div className="calendar">
					<AdvertBooking />
				</div>
			</div>
			<div className="Recap">
				<button type="button" className="yellow-button">
					Réserver un cours
				</button>
				<div>
					<h1>Mes récompenses</h1>
				</div>
				<div>
					<h1>Mes statistiques</h1>
				</div>
				<div>
					<h1>Modification</h1>
					<button type="button" className="yellow-button">
					Modifier mon profil
				</button><button type="button" className="yellow-button">
					Modifier une annonce
				</button>
				</div>
			</div>
		</div>
	);
}

export default ProfilDetails;
