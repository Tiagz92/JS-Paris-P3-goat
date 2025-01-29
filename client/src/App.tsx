import { Outlet } from "react-router-dom";
import WeekScheduler from "./components/AdvertBooking";
import "./App.css";
import "./Reset.css";

function App() {
	return (
		<>
			<Outlet />
			<WeekScheduler />
		</>
	);
}

export default App;
