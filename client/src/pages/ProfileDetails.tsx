import { useOutletContext, useParams } from "react-router-dom";
import type { AppContextInterface } from "../types/appContext.type";
import { useEffect, useState } from "react";
import AdvertBooking from "../components/AdvertBooking";

type Goat = {
	id: number;
	lastname: string;
	firstname: string;
	picture: string;
	presentation: string;
	video: string;
}

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
		<>
		<img
						className="img-goat"
						src={profile.picture}
						alt={profile.firstname}
					/>
			<h2>Bonjour {profile.firstname}</h2>
			<p className="profile-description">{profile.presentation}</p>
			<AdvertBooking />
		</>
	);
}

export default ProfilDetails;
