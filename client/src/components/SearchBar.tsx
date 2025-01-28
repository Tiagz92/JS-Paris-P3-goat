import { useCallback, useEffect, useRef, useState } from "react";
import "./SearchBar.css";
import searchIcon from "../assets/search_icon_white.png";

interface SearchBarProps {
	onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = () => {
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const suggestionsRef = useRef<HTMLUListElement | null>(null);

	useEffect(() => {
		const fetchSuggestions = async () => {
			if (query.trim() === "") {
				setSuggestions([]);
				return;
			}

			try {
				const response = await fetch(
					`http://localhost:3310/search?q=${encodeURIComponent(query)}`,
				);
				if (!response.ok) {
					throw new Error(
						`Erreur HTTP : ${response.status} - ${response.statusText}`,
					);
				}

				const data = await response.json();
				setSuggestions(data.slice(0, 5));
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des suggestions :",
					error,
				);
			}
		};

		const delayDebounce = setTimeout(() => {
			fetchSuggestions();
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [query]);

	const removeSuggestion = (word: string) => {
		setSuggestions((prev) => prev.filter((suggestion) => suggestion !== word));
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
				onChange={(e) => setQuery(e.target.value)}
			/>
			{suggestions.length > 0 && (
				<ul ref={suggestionsRef} className="suggestions-list">
					{suggestions.map((word) => (
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
