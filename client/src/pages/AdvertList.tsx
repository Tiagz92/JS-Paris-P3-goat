import { useEffect, useState } from "react";
import AdvertCard from "../components/AdvertCard";
import type Advert from "../types/Advert";

function AdvertList() {
	const [adverts, setAdverts] = useState<Advert[]>([]);

	useEffect(() => {
		fetch("http://localhost:3310/api/adverts")
			.then((res) => res.json())
			.then((data: Advert[]) => {
				setAdverts(data);
			})
			.catch((error) => {
				console.error("Erreur de récupération des annonces:", error);
			});
	}, []);

	return (
		<div>
			{adverts.map((advert: Advert) => (
				<AdvertCard key={advert.id} advert={advert} />
			))}
		</div>
	);
}

export default AdvertList;
