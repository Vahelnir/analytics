import { Outlet } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";

export function DashboardLayout() {
  return (
    <>
      <Navbar />
      <div className="mx-64">
        <Outlet />
      </div>
    </>
  );
}
