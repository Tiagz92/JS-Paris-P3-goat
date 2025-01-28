import { useEffect, useState } from "react";
// Vous pouvez ajouter des styles ici
import AdvertCard from "./AdvertCard"; // Le composant qui affiche les cartes d'annonces

interface Advert {
	id: number;
	title: string;
	description: string;
	goat_picture: string; // Exemple de type pour une image
	goat_firstname: string;
	main_tag_name: string;
	sub_tag_name: string;
}
const AdvertListWithFilters: React.FC = () => {
	const [mainTags, setMainTags] = useState<{ id: number; name: string }[]>([]);
	const [subTags, setSubTags] = useState<{ id: number; name: string }[]>([]);
	const [selectedMainTag, setSelectedMainTag] = useState<number | null>(null);
	const [selectedSubTag, setSelectedSubTag] = useState<number | null>(null);
	const [adverts, setAdverts] = useState<Advert[]>([]); // Vous pouvez définir un type pour vos annonces

	// Charger les catégories principales
	useEffect(() => {
		const fetchMainTags = async () => {
			try {
				const response = await fetch("http://localhost:3310/advert/maintags");
				const data = await response.json();
				setMainTags(data);
			} catch (error) {
				console.error("Erreur lors de la récupération des main tags :", error);
			}
		};

		fetchMainTags();
	}, []);

	// Charger les sous-catégories en fonction de la catégorie principale sélectionnée
	useEffect(() => {
		if (selectedMainTag === null) return;

		const fetchSubTags = async () => {
			try {
				const response = await fetch(
					`http://localhost:3310/advert/search/subtag/${selectedMainTag}`,
				);
				const data = await response.json();
				setSubTags(data);
			} catch (error) {
				console.error("Erreur lors de la récupération des sub tags :", error);
			}
		};

		fetchSubTags();
	}, [selectedMainTag]);

	// Charger les annonces en fonction des catégories sélectionnées
	useEffect(() => {
		if (selectedMainTag === null || selectedSubTag === null) return;

		const fetchAdverts = async () => {
			try {
				const response = await fetch(
					`http://localhost:3310/filter/advert?mainTagId=${selectedMainTag}&subTagId=${selectedSubTag}`,
				);
				const data = await response.json();
				setAdverts(data);
			} catch (error) {
				console.error("Erreur lors de la récupération des annonces :", error);
			}
		};

		fetchAdverts();
	}, [selectedMainTag, selectedSubTag]);

	return (
		<div className="advert-list-container">
			<div className="filter-container">
				<div className="main-tags">
					<h3>Sélectionnez une catégorie principale</h3>
					{mainTags.map((tag) => (
						<button
							type="button"
							key={tag.id}
							onClick={() => setSelectedMainTag(tag.id)}
							className={selectedMainTag === tag.id ? "selected" : ""}
						>
							{tag.name}
						</button>
					))}
				</div>

				{selectedMainTag && subTags.length > 0 && (
					<div className="sub-tags">
						<h3>Sélectionnez une sous-catégorie</h3>
						{subTags.map((subTag) => (
							<button
								type="button"
								key={subTag.id}
								onClick={() => setSelectedSubTag(subTag.id)}
								className={selectedSubTag === subTag.id ? "selected" : ""}
							>
								{subTag.name}
							</button>
						))}
					</div>
				)}
			</div>

			<div className="advert-cards">
				{adverts.map((advert) => (
					<AdvertCard key={advert.id} advert={advert} />
				))}
			</div>
		</div>
	);
};

export default AdvertListWithFilters;
