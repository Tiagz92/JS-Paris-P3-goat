import { useState } from "react";
import ImageHome from "../assets/images/home_image.jpg";
import FilterMainTag from "../components/FilterMainTag";
import SearchBar from "../components/SearchBar";
import "./Home.css";
export interface Advert {
	id: number;
	title: string;
	description: string;
	main_tag_id: number;
	sub_tag_id: number;
}
const Home: React.FC = () => {
	const [searchResults, setSearchResults] = useState<Advert[]>([]);

	const handleSearch = async (query: string) => {
		try {
			const response = await fetch(
				`/api/advert/search?q=${encodeURIComponent(query)}`,
			);
			const data = await response.json();
			setSearchResults(data);
		} catch (error) {
			console.error("Erreur lors de la recherche :", error);
		}
	};

	return (
		<div className="search">
			<SearchBar onSearch={handleSearch} onSearchFocus={() => {}} />
			<div className="image">
				<img src={ImageHome} alt="ImageHome" className="image-home" />
			</div>

			<FilterMainTag data={searchResults} />
		</div>
	);
};

export default Home;
