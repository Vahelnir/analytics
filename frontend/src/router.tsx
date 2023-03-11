import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "./pages/DashboardLayout";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { Applications } from "./pages/Applications";
import { Application } from "./pages/Applications/Application";

export const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <>Dashboard home</>,
      },
      {
        path: "applications",
        element: <Applications />,
      },
      {
        path: "applications/:applicationId",
        element: <Application />,
      },
    ],
  },
]);
