import { useNavigate } from "react-router-dom";
import "./ProfileLogin.css";
import { useRef, useState } from "react";
import type { FormEventHandler } from "react";

function Login() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const [error, setError] = useState("");

	const submitLogin: FormEventHandler = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: (emailRef.current as HTMLInputElement).value,
						password: (passwordRef.current as HTMLInputElement).value,
					}),
				},
			);
			if (response.status === 200) navigate("/adverts");
			else setError("Veuillez remplir tous les champs.");
		} catch (error) {
			console.error(error);
			setError("Une erreur est survenue.");
		}
	};

	const navigate = useNavigate();
	return (
		<div className="profilecontainer">
			<div className="profileframe">
				{error && error}
				<form className="form" onSubmit={submitLogin}>
					<div className="emailSection">
						<label htmlFor="email">Email :</label>
						<input type="email" id="email" name="email" ref={emailRef} />
					</div>
					<div className="passwordSection">
						<label htmlFor="password">Mot de passe :</label>
						<input
							type="password"
							id="password"
							name="password"
							ref={passwordRef}
						/>
					</div>
					<div className="submit-container">
						<input
							type="submit"
							value="Se connecter"
							className="lightblue-button"
						/>
					</div>
				</form>
				<button
					type="button"
					className="darkblue-button"
					onClick={() => navigate("/register")}
				>
					S'inscrire
				</button>
			</div>
		</div>
	);
}

export default Login;
