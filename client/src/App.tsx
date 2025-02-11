import { Outlet } from "react-router-dom";
import "./App.css";
import "./Reset.css";
import { useState } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import NavBar from "./components/NavBar";

function App() {
	const [user, setUser] = useState(null);
	return (
		<>
			<NavBar />
			<Outlet context={{ user, setUser }} />
			<ToastContainer
				position="top-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
				transition={Bounce}
			/>
		</>
	);
}

export default App;
