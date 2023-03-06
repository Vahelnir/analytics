import { createBrowserRouter, redirect } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";

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
    path: "/",
    loader: () => redirect("/dashboard"),
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);
