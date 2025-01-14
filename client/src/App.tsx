import { RouterProvider, createBrowserRouter } from "react-router-dom";
import About from "./pages/About";
import AdvertList from "./pages/Advert";
import AdvertDetails from "./pages/AdvertDetails";
import Faq from "./pages/Faq";
import Home from "./pages/Home";
import ProfileDetails from "./pages/ProfileDetails";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/advertList",
    element: <AdvertList />,
  },
  {
    path: "/advertList/:id",
    element: <AdvertDetails />,
  },
  {
    path: "/profile/:id",
    element: <ProfileDetails />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/faq",
    element: <Faq />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
