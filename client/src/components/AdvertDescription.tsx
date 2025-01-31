type AdvertDescriptionProps = {
	description: string;
};

function AdvertDescription({ description }: AdvertDescriptionProps) {
	return (
		<div className="advert-description">
			<p>
				<strong> {description} </strong>
			</p>
		</div>
	);
}

export default AdvertDescription;
