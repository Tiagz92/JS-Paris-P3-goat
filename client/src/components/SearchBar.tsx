import { useCallback, useEffect, useRef, useState } from "react";
import "./SearchBar.css";
import searchIcon from "../assets/search_icon_white.png";

interface SearchBarProps {
	onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const suggestionsRef = useRef<HTMLUListElement | null>(null);

	useEffect(() => {
		const fetchSuggestions = async () => {
			if (query.trim() === "") {
				setSuggestions([]);
				onSearch("");
				return;
			}

			try {
				const descriptionUrl = `http://localhost:3310/search/description?q=${encodeURIComponent(query)}`;
				const mainTagUrl = `http://localhost:3310/search/maintags?q=${encodeURIComponent(query)}`;
				const subTagUrl = `http://localhost:3310/search/subtags?q=${encodeURIComponent(query)}`;

				const descriptionResponse = await fetch(descriptionUrl);
				if (!descriptionResponse.ok) {
					throw new Error(
						`Erreur HTTP : ${descriptionResponse.status} - ${descriptionResponse.statusText}`,
					);
				}
				const descriptionData = await descriptionResponse.json();

				const mainTagResponse = await fetch(mainTagUrl);
				if (!mainTagResponse.ok) {
					throw new Error(
						`Erreur HTTP : ${mainTagResponse.status} - ${mainTagResponse.statusText}`,
					);
				}
				const mainTagData = await mainTagResponse.json();

				const subTagResponse = await fetch(subTagUrl);
				if (!subTagResponse.ok) {
					throw new Error(
						`Erreur HTTP : ${subTagResponse.status} - ${subTagResponse.statusText}`,
					);
				}
				const subTagData = await subTagResponse.json();

				const combinedSuggestions = [
					...new Set([
						...mainTagData.slice(0, 5).map((tag: { name: string }) => tag.name),
						...subTagData.slice(0, 5).map((tag: { name: string }) => tag.name),
						...descriptionData.slice(0, 5),
					]),
				];

				setSuggestions(combinedSuggestions);
			} catch (error) {
				setSuggestions([]);
			}
		};

		const delayDebounce = setTimeout(() => {
			fetchSuggestions();
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [query, onSearch]);

	const removeSuggestion = (word: string) => {
		setSuggestions((prev) => prev.filter((suggestion) => suggestion !== word));
		onSearch(word);
	};

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (
			suggestionsRef.current &&
			!suggestionsRef.current.contains(event.target as Node)
		) {
			setSuggestions([]);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleClickOutside]);

	return (
		<div className="search-container">
			<img src={searchIcon} alt="Search Icon" className="search-icon" />
			<input
				type="text"
				placeholder="Rechercher..."
				value={query}
				onChange={(e) => {
					setQuery(e.target.value);
					onSearch(e.target.value);
				}}
			/>
			{suggestions.length > 0 && (
				<ul ref={suggestionsRef} className="suggestions-list">
					{suggestions.slice(0, 5).map((word) => (
						<li
							key={word}
							onClick={() => removeSuggestion(word)}
							onKeyPress={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									removeSuggestion(word);
								}
							}}
							className="suggestion-item"
						>
							{word.toLowerCase()}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SearchBar;
