import { useEffect, useState } from "react";
import type { MainTag } from "../types/Advert";
import "./Register.css";

function Register() {
	const [lastname, setLastname] = useState("");
	const [firstname, setFirstname] = useState("");
	const [birthday, setBirthday] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [presentation, setPresentation] = useState("");
	const [mainTags, setMainTags] = useState<MainTag[]>([]);
	const [selectedTags, setSelectedTags] = useState<(string | null)[]>([
		null,
		null,
		null,
	]);

	useEffect(() => {
		fetch("http://localhost:3310/api/main-tag")
			.then((response) => response.json())
			.then((mainTags) => {
				setMainTags(mainTags);
			})
			.catch((error) => console.error("Erreur :", error));
	}, []);

	const handleTagChange = (index: number, value: string) => {
		const newSelections = [...selectedTags];
		newSelections[index] = value;
		setSelectedTags(newSelections);
	};

	const getAvailableTags = (index: number) => {
		return mainTags.filter(
			(tag) =>
				!selectedTags?.includes(tag.id.toString()) ||
				selectedTags[index] === tag.id.toString(),
		);
	};

	return (
		<>
			<section className="register">
				<section className="profil">
					<h1>crée ton compte !</h1>
					<h2>étape 1/3 - Ton profil :</h2>
					<section className="user">
						<section className="informations">
							<h3>Qui es-tu ?</h3>
							<p>PHOTO</p>
							<form className="form_items">
								<div className="form_inputs">
									<input
										name="lastname"
										type="text"
										value={lastname}
										onChange={(e) => setLastname(e.target.value)}
										required
									/>
									<label htmlFor="lastname">Nom</label>
								</div>
								<div className="form_inputs">
									<input
										type="text"
										value={firstname}
										onChange={(e) => setFirstname(e.target.value)}
										required
										name="firstname"
									/>
									<label htmlFor="firstname">Prénom</label>
								</div>
								<div className="form_inputs">
									<input
										type="text"
										value={birthday}
										onChange={(e) => setBirthday(e.target.value)}
										required
										name="birthday"
									/>
									<label htmlFor="birthday">Date d'anniversaire</label>
								</div>
							</form>
						</section>
						<section>
							<section className="connexion">
								<h3>Comment te connecter ?</h3>
								<div className="form_inputs">
									<input
										name="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
									<label htmlFor="email">Adresse email</label>
								</div>
								<div className="form_inputs">
									<input
										name="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<label htmlFor="password">Mot de passe</label>
								</div>
							</section>
							<section className="presentation">
								<h3>Parle nous un peu de toi : </h3>
								<div className="form_inputs">
									<input
										name="presentation"
										type="text"
										value={presentation}
										onChange={(e) => setPresentation(e.target.value)}
										required
									/>
									<label htmlFor="password">Je suis...</label>
								</div>
								<p>AJOUTE UNE VIDEO</p>
							</section>
						</section>
					</section>
					<div className="submit-button">
						<button className="lightblue-button " type="submit">
							Passer à l'étape 2/3
						</button>
					</div>
				</section>
				<section className="knowledge">
					<h2>étape 2/3 - Tes savoirs :</h2>
					<h3>
						Sélectionne les 3 catégories pour lesquelles tu as des connaissances
						et que tu souhaites partager
					</h3>
					<div className="form-group">
						{selectedTags.map((selectedTag, index) => (
							<select
								className="darkblue-button"
								key={selectedTag}
								value={selectedTags[index] || ""}
								onChange={(e) => handleTagChange(index, e.target.value)}
							>
								<option value="">Choisis ton savoir {index + 1}</option>
								{getAvailableTags(index).map((mainTag) => (
									<option key={mainTag.id} value={mainTag.id}>
										{mainTag.name}
									</option>
								))}
							</select>
						))}
					</div>
					<div className="submit-button">
						<button className="lightblue-button" type="submit">
							Passer à l'étape 3/3
						</button>
					</div>
				</section>

				<section className="slot">
					<h2>étape 3/3 - Tes dispos :</h2>
					<h3>Choisis au moins un créneau</h3>
					<p>CALENDRIER</p>
					<div className="submit-button">
						<button className="lightblue-button" type="submit">
							Valider ton profil
						</button>
					</div>
				</section>
			</section>
		</>
	);
}

export default Register;
