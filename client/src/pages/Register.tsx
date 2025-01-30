import { useEffect, useRef, useState } from "react";
import type { MainTag } from "../types/Advert";
import "./Register.css";
import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";

function Register() {
	const [profilePic, setProfilePic] = useState<string | null>(null);
	const avatar = useRef<HTMLInputElement | null>(null);
	const [edit, setEdit] = useState(false);

	const handleFileChange = () => {
		const file = avatar.current?.files?.[0];
		if (file) {
			setProfilePic(URL.createObjectURL(file));
		}
	};

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

	const [video, setVideo] = useState<string | null>(null);
	const videoInput = useRef<HTMLInputElement | null>(null);

	const handleVideoChange = () => {
		const file = videoInput.current?.files?.[0];
		if (file) {
			setVideo(URL.createObjectURL(file));
		}
	};

	const [currentStep, setCurrentStep] = useState(1);

	const nextStep = () => {
		setCurrentStep((prev) => Math.min(prev + 1, 3));
	};

	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1)); // Revient à l'étape précédente
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const form = new FormData();
		form.append("lastname", lastname);
		form.append("firstname", firstname);
		form.append("birthday", birthday);
		form.append("email", email);
		form.append("password", password);
		form.append("presentation", presentation);

		selectedTags.forEach((tag, index) => {
			if (tag) form.append(`tag${index + 1}`, tag);
		});

		if (avatar.current?.files?.[0]) {
			form.append("profilePic", avatar.current.files[0]);
		}

		if (videoInput.current?.files?.[0]) {
			form.append("video", videoInput.current.files[0]);
		}

		try {
			const response = await fetch("http://localhost:3310/api/goat", {
				method: "POST",
				body: form,
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				throw new Error("Erreur lors de l'inscription !");
			}

			//   const result = await response.json();
			//   console.log("Profil créé avec succès :", result);
			//   alert("Inscription réussie !");
		} catch (error) {
			console.error("Erreur :", error);
			alert("Une erreur est survenue !");
		}
	};

	return (
		<>
			<section className="register">
				{currentStep === 1 && (
					<section className="profil">
						<h1>crée ton compte !</h1>
						<h2>étape 1/3 - Ton profil :</h2>
						<section className="user">
							<section className="informations">
								<h3>Qui es-tu ?</h3>
								<section className="profilPicture">
									<button
										type="button"
										className="avatar"
										onClick={() => {
											if (avatar.current) {
												avatar.current.click();
												setEdit(true);
											}
										}}
									>
										<Avatar
											alt="Profil Picture"
											src={profilePic ?? undefined}
										/>
										<input
											type="file"
											hidden
											ref={avatar}
											onChange={handleFileChange}
										/>
									</button>
									{edit && (
										<Button type="button" variant="contained">
											OK !
										</Button>
									)}
								</section>
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
									<div className="form_birthday">
										<label htmlFor="birthday">Date d'anniversaire</label>
										<input
											type="date"
											value={birthday}
											onChange={(e) => setBirthday(e.target.value)}
											required
											name="birthday"
										/>
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
									<button
										type="button"
										onClick={() => videoInput.current?.click()}
										className="darkblue-button"
									>
										Ajouter une vidéo
									</button>

									<input
										type="file"
										accept="video/*"
										hidden
										ref={videoInput}
										onChange={handleVideoChange}
									/>

									{video && (
										// biome-ignore lint/a11y/useMediaCaption: <explanation>
										<video controls width="250">
											<source src={video} type="video/mp4" />
											Votre navigateur ne supporte pas la vidéo.
										</video>
									)}
								</section>
							</section>
						</section>
						<div className="submit-button">
							<button
								className="lightblue-button "
								type="submit"
								onClick={nextStep}
							>
								Passer à l'étape 2/3
							</button>
						</div>
					</section>
				)}

				{currentStep === 2 && (
					<section className="knowledge">
						<h2>étape 2/3 - Tes savoirs :</h2>
						<h3>
							Sélectionne les 3 catégories pour lesquelles tu as des
							connaissances et que tu souhaites partager
						</h3>
						<div className="form-group">
							{selectedTags.map((selectedTag, index) => (
								<select
									className="darkblue-button"
									key={`select-${index}-${selectedTag || "empty"}`}
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
							<button
								type="button"
								className="lightblue-button"
								onClick={prevStep}
							>
								Revenir à l'étape précédente
							</button>
							<button
								type="button"
								className="lightblue-button"
								onClick={nextStep}
							>
								Passer à l'étape 3/3
							</button>
						</div>
					</section>
				)}

				{currentStep === 3 && (
					<section className="slot">
						<h2>étape 3/3 - Tes dispos :</h2>
						<h3>Choisis au moins un créneau</h3>
						<p>CALENDRIER</p>
						<div className="submit-button">
							<button
								type="button"
								className="lightblue-button"
								onClick={prevStep}
							>
								Revenir à l'étape précédente
							</button>
							<button
								className="lightblue-button"
								type="button"
								onClick={handleSubmit}
							>
								Valider
							</button>
						</div>
					</section>
				)}
			</section>
		</>
	);
}

export default Register;
