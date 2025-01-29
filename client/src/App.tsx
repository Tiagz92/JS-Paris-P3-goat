import { Outlet } from "react-router-dom";
import "./Reset.css";
import "./App.css";
import NavBar from "./components/NavBar";

function App() {
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	);
}

export default App;
