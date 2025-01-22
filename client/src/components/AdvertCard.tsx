import type Advert from "../types/Advert";

interface AdvertCardProps {
	advert: Advert;
}

const AdvertCard = ({ advert }: AdvertCardProps) => {
	return (
		<div className="cards">
			<img className="goat-picture" src={advert.goat_picture} alt="" />
			<h4 className="goat-firstname">{advert.goat_firstname}Jean</h4>
			<h5 className="main-tag-name">{advert.main_tag_name}math</h5>
			<h5 className="sub-tag-name">{advert.sub_tag_name}géométrie</h5>
			<button type="button" className="yellow-button">
				Réserver
			</button>
		</div>
	);
};

export default AdvertCard;
