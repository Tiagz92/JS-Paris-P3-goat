// import { useEffect, useState } from "react";
import "./AdvertForm.css";

function AdvertForm() {
	// const [mainTag, setMainTag] = useState([]);

	// useEffect(() => {
	// 	fetch("http://localhost:3310/api/main-tag")
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			setMainTag(data);
	// 		});
	// }, []);

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
					>
						<option value="">--Choisis un savoir--</option>
						{/* <option value="1">{main_tag.name}</option> */}
						<option value="1">Français</option>
						<option value="2">Histoire-Géographie</option>
						<option value="3">Sciences</option>
						<option value="4">Langues</option>
						<option value="5">Culture</option>
						<option value="6">Musique</option>
						<option value="7">Art & design</option>
						<option value="8">Numérique</option>
						<option value="9">Développement personnel</option>
						<option value="10">Finance / Administratif</option>
						<option value="11">Sport</option>
						<option value="12">Santé / Bien-être</option>
						<option value="13">Voyage</option>
						<option value="14">Autres</option>
						<option value="15">Maths</option>
					</select>
				</div>

				<div className="form-group">
					<label htmlFor="main-tag-select">
						Quelle sous-catégorie veux-tu proposer ?
					</label>

					<select
						name="sub-tag"
						className="darkblue-button"
						id="sub-tag-select"
					>
						<option value="">--Choisis un savoir--</option>
						{/* <option value="1">{sub_tag.name}</option> */}
						<option value="1">Français</option>
						<option value="2">Histoire-Géographie</option>
						<option value="3">Sciences</option>
						<option value="4">Langues</option>
						<option value="5">Culture</option>
						<option value="6">Musique</option>
						<option value="7">Art & design</option>
						<option value="8">Numérique</option>
					</select>
				</div>
				<div className="form-group-description">
					<label htmlFor="main-tag-select">
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
