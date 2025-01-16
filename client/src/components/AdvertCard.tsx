import type Advert from "../types/Advert";

interface CardsProps {
	advert: Advert;
}

const advertCard = ({ advert }: CardsProps) => {
	return (
		<div className="cards">
			<img className="goat-picture" src={advert.goat_picture} alt="" />
			<h4 className="goat-firstname">{advert.goat_firstname}</h4>
		</div>
	);
};

export default advertCard;
