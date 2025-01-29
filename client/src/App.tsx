import { Outlet } from "react-router-dom";
import "./App.css";
import "./Reset.css";
import { Bounce, ToastContainer } from "react-toastify";
import NavBar from "./components/NavBar";

function App() {
	return (
		<>
			<NavBar />
			<Outlet />
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
