// AdvertList.tsx
import { useEffect, useState } from "react";
import AdvertCard from "../components/AdvertCard";
import type { Advert } from "../types/Advert";
import "./AdvertList.css";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";

function AdvertList() {
	const [adverts, setAdverts] = useState<Advert[]>([]);
	const [filteredAdverts, setFilteredAdverts] = useState<Advert[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMainTag, setSelectedMainTag] = useState<number | null>(null);
	const [selectedSubTag, setSelectedSubTag] = useState<number | null>(null);

	useEffect(() => {
		fetch("http://localhost:3310/api/adverts")
			.then((res) => res.json())
			.then((data: Advert[]) => {
				setAdverts(data);
				setFilteredAdverts(data);
			})
			.catch((error) => console.error("Erreur récupération annonces:", error));
	}, []);

	const resetFilters = () => {
		setSelectedMainTag(null);
		setSelectedSubTag(null);
		setFilteredAdverts(adverts);
	};

	const applyFilters = (advertsToFilter: Advert[]): Advert[] => {
		let result = [...advertsToFilter];
		if (selectedMainTag)
			result = result.filter(
				(advert) => advert.main_tag_id === selectedMainTag,
			);
		if (selectedSubTag)
			result = result.filter((advert) => advert.sub_tag_id === selectedSubTag);
		return result;
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		const results = adverts.filter(
			(advert) =>
				advert.description.toLowerCase().includes(query.toLowerCase()) ||
				advert.main_tag_name.toLowerCase().includes(query.toLowerCase()) ||
				advert.sub_tag_name.toLowerCase().includes(query.toLowerCase()),
		);
		setFilteredAdverts(applyFilters(results));
	};

	const handleFilters = (_: string, mainTagId?: number, subTagId?: number) => {
		if (mainTagId !== undefined) {
			setSelectedMainTag(mainTagId);
			setSelectedSubTag(null);
		}
		if (subTagId !== undefined) setSelectedSubTag(subTagId);

		let results = adverts;
		if (searchQuery.trim() !== "") {
			results = results.filter(
				(advert) =>
					advert.description
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					advert.main_tag_name
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					advert.sub_tag_name.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}
		setFilteredAdverts(applyFilters(results));
	};

	return (
		<div>
			<SearchBar
				onSearch={handleSearch}
				onSearchFocus={resetFilters} // Nouveau prop pour gérer le focus
			/>
			<Filter
				onSearch={handleFilters}
				selectedMainTag={selectedMainTag}
				selectedSubTag={selectedSubTag}
			/>
			<div className="adverts">
				{filteredAdverts.length > 0 ? (
					filteredAdverts.map((advert) => (
						<AdvertCard key={advert.id} advert={advert} />
					))
				) : (
					<div className="no-results">
						<p>
							Aucune annonce ne correspond aux critères de recherche
							sélectionnés.
						</p>
						<p>
							Essayez de modifier vos filtres ou votre recherche pour voir plus
							de résultats.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default AdvertList;
