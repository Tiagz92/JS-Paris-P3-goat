import { useEffect, useState } from "react";
import "./Filter.css";

interface AdvertListWithFiltersProps {
	onSearch: (query: string, mainTagId?: number, subTagId?: number) => void;
	selectedMainTag: number | null;
	selectedSubTag: number | null;
}

const Filter: React.FC<AdvertListWithFiltersProps> = ({
	onSearch,
	selectedMainTag,
	selectedSubTag,
}) => {
	const [mainTags, setMainTags] = useState<{ id: number; name: string }[]>([]);
	const [subTags, setSubTags] = useState<{ id: number; name: string }[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [startIndex, setStartIndex] = useState(0);
	const [subStartIndex, setSubStartIndex] = useState(0);
	const visibleCount = 7;
	const visibleSubCount = 4;

	useEffect(() => {
		const fetchMainTags = async () => {
			setIsLoading(true);
			try {
				const response = await fetch("http://localhost:3310/advert/maintags");
				const data = await response.json();
				setMainTags(data);
			} catch (error) {
				console.error("Erreur récupération main tags:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchMainTags();
	}, []);

	useEffect(() => {
		if (selectedMainTag === null) {
			setSubTags([]);
			return;
		}
		const fetchSubTags = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(
					`http://localhost:3310/advert/search/subtag/${selectedMainTag}`,
				);
				const data = await response.json();
				setSubTags(data);
			} catch (error) {
				console.error("Erreur récupération sub tags:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchSubTags();
	}, [selectedMainTag]);

	const handleMainTagChange = (id: number) => {
		onSearch("", id, undefined);
	};

	const handleSubTagChange = (id: number) => {
		onSearch("", selectedMainTag ?? undefined, id);
	};

	const handleNext = () => {
		if (startIndex + visibleCount < mainTags.length) {
			setStartIndex(startIndex + 1);
		}
	};

	const handlePrev = () => {
		if (startIndex > 0) {
			setStartIndex(startIndex - 1);
		}
	};

	const handleSubNext = () => {
		if (subStartIndex + visibleSubCount < subTags.length) {
			setSubStartIndex(subStartIndex + 1);
		}
	};

	const handleSubPrev = () => {
		if (subStartIndex > 0) {
			setSubStartIndex(subStartIndex - 1);
		}
	};

	if (isLoading) {
		return <div>Chargement...</div>;
	}

	return (
		<div className="filter-container">
			<div className="filter-wrapper">
				<button type="button" className="scroll-btn" onClick={handlePrev}>
					&lt;
				</button>
				<div className="filter-list">
					{mainTags.slice(startIndex, startIndex + visibleCount).map((tag) => (
						<button
							type="button"
							key={tag.id}
							onClick={() => handleMainTagChange(tag.id)}
							className={`filter-btn ${selectedMainTag === tag.id ? "selected" : ""}`}
						>
							{tag.name}
						</button>
					))}
				</div>
				<button type="button" className="scroll-btn" onClick={handleNext}>
					&gt;
				</button>
			</div>

			{selectedMainTag && subTags.length > 0 && (
				<div className="sub-tags">
					<div className="filter-wrapper">
						<button
							type="button"
							className="scroll-btn"
							onClick={handleSubPrev}
						>
							&lt;
						</button>
						<div className="filter-list">
							{subTags
								.slice(subStartIndex, subStartIndex + visibleSubCount)
								.map((subTag) => (
									<button
										type="button"
										key={subTag.id}
										onClick={() => handleSubTagChange(subTag.id)}
										className={`filter-btn ${selectedSubTag === subTag.id ? "selected" : ""}`}
									>
										{subTag.name}
									</button>
								))}
						</div>
						<button
							type="button"
							className="scroll-btn"
							onClick={handleSubNext}
						>
							&gt;
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Filter;
