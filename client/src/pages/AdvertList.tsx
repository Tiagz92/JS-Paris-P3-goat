import { useEffect, useState } from "react";
import AdvertCard from "../components/AdvertCard";
import AdvertListWithFilters from "../components/AdvertListWithFilters";
import type { Advert } from "../types/Advert";
import "./AdvertList.css";
import SearchBar from "../components/SearchBar";

function AdvertList() {
	const [adverts, setAdverts] = useState<Advert[]>([]);
	const [filteredAdverts, setFilteredAdverts] = useState<Advert[]>([]);

	useEffect(() => {
		// Récupérer toutes les annonces au chargement initial
		fetch("http://localhost:3310/api/adverts")
			.then((res) => res.json())
			.then((data: Advert[]) => {
				setAdverts(data);
				setFilteredAdverts(data);
			})
			.catch((error) => {
				console.error("Erreur de la récupération des annonces:", error);
			});
	}, []);

	// Fonction pour rechercher par description ou tags
	const handleSearchDescription = (query: string) => {
		if (!query.trim()) {
			// Si la recherche est vide, on réinitialise les annonces
			setFilteredAdverts(adverts);
			return;
		}
		// Filtrer les annonces par description, mainTagName ou subTagName
		const filtered = adverts.filter(
			(advert) =>
				advert.description.toLowerCase().includes(query.toLowerCase()) ||
				advert.main_tag_name.toLowerCase().includes(query.toLowerCase()) ||
				advert.sub_tag_name.toLowerCase().includes(query.toLowerCase()),
		);
		setFilteredAdverts(filtered);
	};

	// Fonction pour filtrer par mainTag
	const handleSearchByMainTag = (mainTagId: number) => {
		fetch(`http://localhost:3310/search/mainTag/${mainTagId}`)
			.then((res) => res.json())
			.then((data: Advert[]) => {
				setFilteredAdverts(data);
			})
			.catch((error) => {
				console.error("Erreur lors du filtrage par mainTag:", error);
			});
	};

	// Fonction pour filtrer par subTag
	const handleSearchBySubTag = (subTagId: number) => {
		fetch(`http://localhost:3310/search/subTag/${subTagId}`)
			.then((res) => res.json())
			.then((data: Advert[]) => {
				setFilteredAdverts(data);
			})
			.catch((error) => {
				console.error("Erreur lors du filtrage par subTag:", error);
			});
	};
	const handleSearch = (
		query: string,
		mainTagId?: number,
		subTagId?: number,
	) => {
		if (mainTagId) {
			handleSearchByMainTag(mainTagId);
		} else if (subTagId) {
			handleSearchBySubTag(subTagId);
		} else {
			handleSearchDescription(query);
		}
	};

	return (
		<div>
			<SearchBar onSearch={handleSearch} />
			<AdvertListWithFilters />
			<div className="adverts">
				{filteredAdverts.map((advert: Advert) => (
					<AdvertCard key={advert.id} advert={advert} />
				))}
			</div>
		</div>
	);
}

export default AdvertList;
