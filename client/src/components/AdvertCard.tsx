import type Advert from "../types/Advert";
import "../components/AdvertCard.css";

interface AdvertCardProps {
	advert: Advert;
}

function AdvertCard({ advert }: AdvertCardProps) {
	return (
		<div className="cards">
			<img
				className="goat-picture"
				src={advert.goat_picture}
				alt={advert.goat_firstname}
			/>
			<h2 className="goat-firstname">{advert.goat_firstname}</h2>
			<div className="tags">
				<h3 className="main-tag-name">{advert.main_tag_name}</h3>
				<h3 className="sub-tag-name">{advert.sub_tag_name}</h3>
			</div>
			<button type="button" className="yellow-button">
				En savoir plus
			</button>
		</div>
	);
}

export default AdvertCard;
