import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MainTag, SubTag } from "../types/Advert";
import "./AdvertForm.css";

function AdvertForm() {
	const [mainTags, setMainTags] = useState<MainTag[]>([]);
	const [subTags, setSubTags] = useState<SubTag[]>([]);
	const [selectedMainTag, setSelectedMainTag] = useState<number | null>(null);
	const navigate = useNavigate();
	const [formData, setFormData] = useState<{
		main_tag_id: number | null;
		sub_tag_id: number | null;
		description: string;
		goat_id: number;
	}>({
		main_tag_id: null,
		sub_tag_id: null,
		description: "",
		goat_id: 1,
	});

	useEffect(() => {
		fetch("http://localhost:3310/api/main-tag")
			.then((response) => response.json())
			.then((mainTags) => {
				setMainTags(mainTags);
			})
			.catch((error) => console.error("Erreur :", error));
	}, []);

	useEffect(() => {
		if (selectedMainTag !== null) {
			const mainTag = mainTags.find(
				(mainTag) => mainTag.id === selectedMainTag,
			);

			if (mainTag) {
				setSubTags(mainTag.subTags);
			}
		} else {
			setSubTags([]);
		}
	}, [mainTags, selectedMainTag]);

	const handleSubmit = async () => {
		if (
			formData.main_tag_id === null ||
			formData.sub_tag_id === null ||
			formData.description.trim() === ""
		) {
			alert("Tous les champs sont obligatoires !");
			return;
		}

		try {
			const response = await fetch("http://localhost:3310/api/advert", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error("Erreur lors de la création de l'annonce");
			}

			const result = await response.json();
			console.info("Annonce créée avec succès :", result);

			setFormData({
				main_tag_id: null,
				sub_tag_id: null,
				description: "",
				goat_id: 1,
			});
			setSelectedMainTag(null);
			navigate("/adverts");
		} catch (error) {
			console.error("Erreur lors de la soumission :", error);
			alert("Une erreur est survenue. Veuillez réessayer.");
		}
	};

	return (
		<div className="advert-form">
			<h1 className="title">Crée ton annonce !</h1>

			<form
				className="form"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<div className="form-group">
					<label htmlFor="main-tag-select">
						Quel savoir veux-tu transmettre ?
					</label>
					<select
						id="main-tag-select"
						className="darkblue-button tag-button"
						value={formData.main_tag_id ?? ""}
						onChange={(e) => {
							const mainTagId = e.target.value ? Number(e.target.value) : null;
							setFormData((prev) => ({ ...prev, main_tag_id: mainTagId }));
							setSelectedMainTag(mainTagId);
						}}
					>
						<option value="">Choisis un savoir</option>
						{mainTags.map((mainTag) => (
							<option key={mainTag.id} value={mainTag.id}>
								{mainTag.name}
							</option>
						))}
					</select>
				</div>

				<div className="form-group">
					<label htmlFor="sub-tag-select">
						Quelle sous-catégorie veux-tu proposer ?
					</label>
					<select
						id="sub-tag-select"
						className="darkblue-button tag-button"
						value={formData.sub_tag_id ? formData.sub_tag_id : ""}
						disabled={selectedMainTag === null}
						onChange={(e) => {
							const subTagId = e.target.value ? Number(e.target.value) : null;
							setFormData((prev) => ({ ...prev, sub_tag_id: subTagId }));
						}}
					>
						<option value="">
							{selectedMainTag === null ? "" : "Choisis une sous-catégorie"}
						</option>
						{subTags.map((subTag) => (
							<option key={subTag.id} value={subTag.id}>
								{subTag.name}
							</option>
						))}
					</select>
				</div>

				<div className="form-group-description">
					<label htmlFor="description">
						Ajoute un texte descriptif à ton annonce
					</label>
					<input
						id="description"
						type="text"
						className="description"
						value={formData.description}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								description: e.target.value,
							}))
						}
						required
					/>
				</div>

				<div className="submit-button">
					<button className="darkblue-button" type="submit">
						Valide ton annonce
					</button>
				</div>
			</form>

			<h3 className="advertising-text">
				Après cette étape, ton annonce sera disponible sur les créneaux de
				réservation que tu as définis sur ton profil !
			</h3>
		</div>
	);
}

export default AdvertForm;
