import { trpc } from "../trpc";

export function Home() {
  const authentication = trpc.api.user.authentication.useQuery();

  return (
    <div>
      <a href="/register">Inscription</a>
      <a href="/login">Connexion</a>
      <div>{authentication.data?.working}</div>
    </div>
  );
}
