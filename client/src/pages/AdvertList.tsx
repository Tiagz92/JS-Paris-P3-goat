import type React from "react";
import AdvertCard from "../components/AdvertCard";

const adverts = [
	{
		id: 1,
		title: "Annonce 1",
		description: "Description 1",
		goat_picture: "picture1.jpg",
		goat_firstname: "Goat 1",
		main_tag_name: "Tag 1",
		sub_tag_name: "SubTag 1",
	},
	{
		id: 2,
		title: "Annonce 2",
		description: "Description 2",
		goat_picture: "picture2.jpg",
		goat_firstname: "Goat 2",
		main_tag_name: "Tag 2",
		sub_tag_name: "SubTag 2",
	},
];

const AdvertList: React.FC = () => {
	return (
		<div>
			{adverts.map((advert) => (
				<AdvertCard key={advert.id} advert={advert} />
			))}
		</div>
	);
};

export default AdvertList;
