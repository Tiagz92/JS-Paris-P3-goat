import { useCallback, useEffect, useRef, useState } from "react";
import "./SearchBar.css";
import searchIcon from "../assets/search_icon_white.png";

interface SearchBarProps {
	onSearch: (query: string) => void;
	onSearchFocus: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onSearchFocus }) => {
	const [query, setQuery] = useState("");
	const [isOnSearch, setIsOnSearch] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);

	const suggestionsRef = useRef<HTMLUListElement | null>(null);
	const categoriesRef = useRef<HTMLDivElement | null>(null);
	const searchContainerRef = useRef<HTMLDivElement | null>(null);

	const fetchSuggestions = useCallback(async (searchQuery: string) => {
		if (searchQuery.trim() === "") {
			setSuggestions([]);
			return;
		}

		try {
			const [descriptionResponse, mainTagResponse, subTagResponse] =
				await Promise.all([
					fetch(
						`http://localhost:3310/search/description?q=${encodeURIComponent(searchQuery)}`,
					),
					fetch(
						`http://localhost:3310/search/maintags?q=${encodeURIComponent(searchQuery)}`,
					),
					fetch(
						`http://localhost:3310/search/subtags?q=${encodeURIComponent(searchQuery)}`,
					),
				]);

			const [descriptions, mainTags, subTags] = await Promise.all([
				descriptionResponse.json(),
				mainTagResponse.json(),
				subTagResponse.json(),
			]);

			const combinedSuggestions = [
				...new Set([
					...mainTags.slice(0, 5).map((tag: { name: string }) => tag.name),
					...subTags.slice(0, 5).map((tag: { name: string }) => tag.name),
					...descriptions.slice(0, 5),
				]),
			];

			setSuggestions(combinedSuggestions);
		} catch (error) {
			setSuggestions([]);
		}
	}, []);

	const fetchCategories = useCallback(async (searchQuery: string) => {
		try {
			const categoryResponse = await fetch(
				`http://localhost:3310/search/categories?q=${encodeURIComponent(searchQuery)}`,
			);
			const categories = await categoryResponse.json();
			setCategories(categories);
			setIsCategoriesVisible(true);
		} catch (error) {
			setCategories([]);
		}
	}, []);

	useEffect(() => {
		if (isOnSearch) {
			const delayDebounce = setTimeout(() => {
				fetchSuggestions(query);
				onSearch(query);
			}, 300);
			return () => clearTimeout(delayDebounce);
		}
	}, [query, onSearch, fetchSuggestions, isOnSearch]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsOnSearch(true);
		setQuery(e.target.value);
	};

	const handleSuggestionClick = (suggestion: string) => {
		setQuery(suggestion);
		onSearch(suggestion);
		setIsOnSearch(false);
		setSuggestions([]);
		fetchCategories(suggestion);
	};

	const handleFocus = () => {
		setIsOnSearch(false); // Réinitialise les filtres lors du focus sur la barre de recherche
		setSuggestions([]);
		setCategories([]);
		setIsCategoriesVisible(false); // Cache les catégories
		onSearchFocus(); // Optionnel, selon ton besoin
	};

	const handleClickOutside = useCallback((event: MouseEvent) => {
		const target = event.target as Node;
		const isClickInsideSearchContainer =
			searchContainerRef.current?.contains(target);
		const isClickInsideSuggestions = suggestionsRef.current?.contains(target);
		const isClickInsideCategories = categoriesRef.current?.contains(target);

		// Si le clic est en dehors de tous les éléments de recherche
		if (
			!isClickInsideSearchContainer &&
			!isClickInsideSuggestions &&
			!isClickInsideCategories
		) {
			setIsOnSearch(false);
			setSuggestions([]);
			setCategories([]);
			setIsCategoriesVisible(false); // Cache les catégories
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [handleClickOutside]);

	return (
		<div ref={searchContainerRef} className="search-container">
			<img src={searchIcon} alt="Search Icon" className="search-icon" />
			<input
				type="text"
				placeholder="Rechercher..."
				value={query}
				onChange={handleInputChange}
				onFocus={handleFocus} // Ajouté ici
			/>
			{suggestions.length > 0 && (
				<ul ref={suggestionsRef} className="suggestions-list">
					{suggestions.map((suggestion) => (
						<li
							key={suggestion}
							onClick={() => handleSuggestionClick(suggestion)}
							onKeyUp={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleSuggestionClick(suggestion);
								}
							}}
							className="suggestion-item"
						>
							{suggestion.toLowerCase()}
						</li>
					))}
				</ul>
			)}

			{isCategoriesVisible && categories.length > 0 && (
				<div ref={categoriesRef} className="categories-container">
					<h3>Catégories associées :</h3>
					<ul>
						{categories.map((category) => (
							<li key={category}>{category}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default SearchBar;
