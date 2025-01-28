import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Advert } from "../pages/Home";
import "./FilterMainTag.css";

interface Tag {
	id: number;
	name: string;
}

interface PropsFilterMainTag {
	data: Advert[];
}

const FilterMainTag: React.FC<PropsFilterMainTag> = () => {
	const [displayedTags, setDisplayedTags] = useState<Tag[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMainTags = async () => {
			try {
				const response = await fetch("http://localhost:3310/advert/maintags");
				if (!response.ok) {
					throw new Error(
						`Erreur HTTP : ${response.status} - ${response.statusText}`,
					);
				}
				const tags = await response.json();
				setDisplayedTags(tags.slice(0, 10));
			} catch (error) {
				console.error("Erreur lors de la récupération des mainTags :", error);
			}
		};

		fetchMainTags();
	}, []);

	const handleTagClick = (tag: Tag) => {
		navigate(`/adverts?tag=${tag.id}`);
	};

	return (
		<div className="filter-container">
			<label htmlFor="mainTagSelect">Filtrer par main tag :</label>
			<div className="tags-grid">
				{displayedTags.map((tag) => (
					<button
						key={tag.id}
						type="button"
						className="tag-item"
						onClick={() => handleTagClick(tag)}
					>
						{tag.name}
					</button>
				))}
			</div>

			<Link to="/adverts" className="categories-link">
				Plus de catégories
			</Link>
		</div>
	);
};

export default FilterMainTag;
