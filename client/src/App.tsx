import { Outlet } from "react-router-dom";
import WeekScheduler from "./components/advertBooking";
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
