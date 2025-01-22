import type React from "react";

type AdvertDescriptionProps = {
	description: string;
};

const AdvertDescription: React.FC<AdvertDescriptionProps> = ({
	description,
}) => {
	return (
		<div className="advert-description">
			<p>
				<strong> {description} </strong>
			</p>
		</div>
	);
};

export default AdvertDescription;
