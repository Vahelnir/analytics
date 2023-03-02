import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { trpc } from "../trpc";
import { Input } from "../components/ui/form/Input";
import { setAuthTokens } from "../service/auth";

export function Login() {
  const loginMutation = trpc.api.user.login.useMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function changeEvent(setter: Dispatch<SetStateAction<string>>) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };
  }

  async function submit() {
    const tokens = await loginMutation.mutateAsync({
      email,
      password,
    });
    setAuthTokens(tokens);
  }

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm bg-base-300 border-base-300 border rounded-md p-4">
        <h1>Connexion</h1>
        <div>
          <div className="my-2 flex flex-col">
            <label htmlFor="email">Adresse email</label>
            <Input
              type="text"
              name="email"
              placeholder="Adresse email"
              onChange={changeEvent(setEmail)}
              value={email}
            />
          </div>
          <div className="my-2 flex flex-col">
            <label htmlFor="password">Mot de passe</label>
            <Input
              type="password"
              name="password"
              placeholder="Mot de passe"
              onChange={changeEvent(setPassword)}
              value={password}
            />
          </div>
          <button type="button" className="btn mt-3" onClick={() => submit()}>
            Se connecter
          </button>
        </div>
      </div>
    </section>
  );
}
