import { createBrowserRouter } from "react-router";
import LandingPage from "../../features/landing/pages/LandingPage";
import NotFound from "../../features/erros/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
