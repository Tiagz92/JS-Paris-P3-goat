import type { Advert } from "../types/Advert";
import "../components/AdvertCard.css";
import onlineCourse from "../assets/images/onlineCourse.png";

interface AdvertCardProps {
	advert: Advert;
}

function AdvertCard({ advert }: AdvertCardProps) {
	return (
		<div className="cards">
			<img
				className="online"
				src={onlineCourse}
				alt="online-course picto by HAJICON"
			/>
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
			<p className="description">{advert.description}</p>
			<button type="button" className="yellow-button">
				En savoir plus
			</button>
		</div>
	);
}

export default AdvertCard;
