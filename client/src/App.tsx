import { RouterProvider, createBrowserRouter } from "react-router-dom";
import About from "./pages/About";
import Advert from "./pages/Advert";
import AdvertDetails from "./pages/AdvertDetails";
import AdvertResults from "./pages/AdvertResults";
import Faq from "./pages/Faq";
import Home from "./pages/Home";
import ProfilDetails from "./pages/ProfilDetails";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/resultats-annonces",
    element: <AdvertResults />,
  },
  {
    path: "/annonces",
    element: <Advert />,
  },
  {
    path: "/annonces/:id",
    element: <AdvertDetails />,
  },
  {
    path: "/profil/:id",
    element: <ProfilDetails />,
  },
  {
    path: "/a-propos",
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
