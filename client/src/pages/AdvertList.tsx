import { useEffect, useState } from "react";
import AdvertCard from "../components/AdvertCard";
import type Advert from "../types/Advert";
import "./AdvertList.css";

function AdvertList() {
	const [adverts, setAdverts] = useState<Advert[]>([]);

	useEffect(() => {
		fetch("http://localhost:3310/api/adverts")
			.then((res) => res.json())
			.then((data: Advert[]) => {
				setAdverts(data);
			})
			.catch((error) => {
				console.error("Erreur de la récupération des annonces:", error);
			});
	}, []);

	return (
		<div>
			<div className="adverts">
				{adverts.map((advert: Advert) => (
					<AdvertCard key={advert.id} advert={advert} />
				))}
			</div>
		</div>
	);
}

export default AdvertList;
