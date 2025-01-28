import { Outlet } from "react-router-dom";
import WeekScheduler from "./components/AdvertBooking";
import "./App.css";

function App() {
	return (
		<>
			<Outlet />
			<WeekScheduler />
		</>
	);
}

export default App;
