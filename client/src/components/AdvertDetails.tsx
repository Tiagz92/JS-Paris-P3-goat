import { useEffect, useState } from "react";
import type { FC } from "react";
import { useParams } from "react-router-dom";
import AdvertDescription from "./AdvertDescription";

type AdvertDetailsProps = Record<string, never>;

type Advert = {
	description: string;
	goat_id: number;
	main_tag_id: number;
	sub_tag_id: number;
};

const AdvertDetails: FC<AdvertDetailsProps> = () => {
	const { id } = useParams<{ id: string }>();
	const [advert, setAdvert] = useState<Advert | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAdvert = async () => {
			try {
				const response = await fetch(`http://localhost:3000/adverts/${id}`);
				if (!response.ok) {
					throw new Error("Failed to fetch advert");
				}
				const data: Advert = await response.json();
				setAdvert(data);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unknown error occurred");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchAdvert();
	}, [id]);

	if (loading) {
		return <div>Chargement...</div>;
	}

	if (error) {
		return <div>Erreur: {error}</div>;
	}

	if (!advert) {
		return <div>Aucune annonce trouvée</div>;
	}

	return (
		<div className="advert-details">
			<p>
				<strong> {advert.goat_id} </strong>
			</p>
			<p>
				<strong> {advert.main_tag_id} </strong>
			</p>
			<p>
				<strong> {advert.sub_tag_id} </strong>
			</p>
			<AdvertDescription description={advert.description} />
		</div>
	);
};

export default AdvertDetails;
