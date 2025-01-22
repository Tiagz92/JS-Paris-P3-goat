import { useEffect, useState } from "react";
import "./AdvertForm.css";

type MainTag = {
	id: number;
	name: string;
};

type SubTag = {
	id: number;
	name: string;
};

function AdvertForm() {
	const [mainTag, setMainTag] = useState<MainTag[]>([]);
	const [subTag, setSubTag] = useState<SubTag[]>([]);
	const [selectedMainTag, setSelectedMainTag] = useState<number | null>(null);

	useEffect(() => {
		fetch("http://localhost:3310/api/main-tag")
			.then((response) => response.json())
			.then((data) => {
				setMainTag(data);
			});
	}, []);

	useEffect(() => {
		if (selectedMainTag !== null) {
			fetch(`http://localhost:3310/api/sub-tag/${selectedMainTag}`)
				.then((response) => response.json())
				.then((data) => {
					setSubTag(data);
				});
		}
	}, [selectedMainTag]);

	return (
		<div className="advert-form">
			<h1 className="title">Crée ton annonce !</h1>

			<form action="" method="get" className="form">
				<div className="form-group">
					<label htmlFor="main-tag-select">
						Quel savoir veux-tu transmettre ?
					</label>
					<select
						name="main-tag"
						className="darkblue-button"
						id="main-tag-select"
						onChange={(e) => setSelectedMainTag(Number(e.target.value))}
					>
						<option value="">--Choisis un savoir--</option>
						{mainTag.map((tag) => (
							<option key={tag.id} value={tag.id}>
								{tag.name}
							</option>
						))}
					</select>
				</div>

				<div className="form-group">
					<label htmlFor="sub-tag-select">
						Quelle sous-catégorie veux-tu proposer ?
					</label>
					<select
						name="sub-tag"
						className="darkblue-button"
						id="sub-tag-select"
					>
						<option value="">--Choisis une sous-catégorie--</option>
						{subTag.map((tag) => (
							<option key={tag.id} value={tag.id}>
								{tag.name}
							</option>
						))}
					</select>
				</div>

				<div className="form-group-description">
					<label htmlFor="description">
						Ajoute un texte descriptif à ton annonce
					</label>
					<input
						type="text"
						className="description"
						name="description"
						required
					/>
				</div>
			</form>

			<h3 className="advertising-text">
				Après cette étape, ton annonce sera disponible sur les créneaux de
				réservation que tu as défini sur ton profil !
			</h3>
			<div className="submit-button">
				<button className="darkblue-button" type="submit">
					Valide ton annonce
				</button>
			</div>
		</div>
	);
}

export default AdvertForm;
