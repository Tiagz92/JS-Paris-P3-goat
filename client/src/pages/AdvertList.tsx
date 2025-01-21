import { useEffect, useState } from "react";
import AdvertCard from "../components/AdvertCard";
import type Advert from "../types/Advert";

const AdvertList: React.FC = () => {
	const [adverts, setAdverts] = useState<Advert[]>([]);

	useEffect(() => {
		fetch("http://localhost:3001/adverts")
			.then((res) => res.json())
			.then((data) => {
				setAdverts(data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}, []);

	return (
		<div>
			{adverts.map((advert: Advert) => (
				<AdvertCard key={advert.id} advert={advert} />
			))}
		</div>
	);
};

export default AdvertList;
