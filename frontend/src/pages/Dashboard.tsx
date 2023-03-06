import { Navbar } from "../components/ui/Navbar";
import { trpc } from "../trpc";

export function Dashboard() {
  const authentication = trpc.api.user.authentication.useQuery();

  return (
    <>
      <Navbar />
      <div>
        <div>{authentication.data?.working}</div>
      </div>
    </>
  );
}
