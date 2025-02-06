import { Outlet } from "react-router-dom";
import WeekScheduler from "./components/AdvertBooking";
import "./App.css";
import "./Reset.css";
import { Bounce, ToastContainer } from "react-toastify";
import NavBar from "./components/NavBar";

function App() {
	return (
		<>
			<Outlet />
			<WeekScheduler advertId={1} />
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
