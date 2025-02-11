import { useNavigate } from "react-router-dom";
import "./ProfileLogin.css";

function Login() {
	const navigate = useNavigate();
	return (
		<div className="profilecontainer">
			<div className="profileframe">
				<form className="form">
					<div className="emailSection">
						<label htmlFor="email">Email :</label>
						<input type="email" id="email" name="email" />
					</div>
					<div className="passwordSection">
						<label htmlFor="password">Mot de passe :</label>
						<input type="password" id="password" name="password" />
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
