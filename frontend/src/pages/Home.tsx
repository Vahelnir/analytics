import { useEffect } from "react";
import { trpc } from "../trpc";

export function Home() {
  async function test() {
    await trpc.api.user.authentication.query();
  }
  useEffect(() => {
    test();
  }, []);
  return (
    <div>
      <a href="/register">Inscription</a>
      <a href="/login">Connexion</a>
    </div>
  );
}
