import connexionIcon from "../assets/images/connexion-icon.png";
import logo from "../assets/images/logoGOAT.png";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";

function NavBar() {
	const navigate = useNavigate();

	return (
		<div className="navbar">
			<img
				src={logo}
				alt="logo"
				className="logo"
				onClick={() => navigate("/")}
				onKeyPress={() => navigate("/")}
			/>
			<section className="title-container">
				<h1 className="title">
					<b>GOAT</b>
				</h1>
				<h2 className="subtitle">
					<b>GO A</b>pprendre & <b>T</b>ransmettre
				</h2>
			</section>
			<div className="navbar-links">
				<button
					type="button"
					className="add-advert-button"
					onClick={() => navigate("/adverts/add")}
				>
					Crée ton annonce !
				</button>
				<img src={connexionIcon} alt="connexion" className="connexion-icon" />
			</div>
		</div>
	);
}

export default NavBar;
