import { Outlet } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { trpc } from "../trpc";

export function DashboardLayout() {
  trpc.api.auth.isAuthenticated.useQuery();

  return (
    <>
      <Navbar />
      <div className="mx-64">
        <Outlet />
      </div>
    </>
  );
}
