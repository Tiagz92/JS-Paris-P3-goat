import type Advert from "../types/Advert";

interface CardsProps {
	advert: Advert;
}

const advertCard = ({ advert }: CardsProps) => {
	return (
		<div className="cards">
			<img className="goat-picture" src={advert.goat_picture} alt="" />
			<h4 className="goat-firstname">{advert.goat_firstname}</h4>
			<h5 className="main-tag-name">{advert.main_tag_name}</h5>
			<h5 className="sub-tag-name">{advert.sub_tag_name}</h5>
			<button type="button" className="booking-button">
				Réserver
			</button>
		</div>
	);
};

export default advertCard;
// main & sub tags + bouton reserver
