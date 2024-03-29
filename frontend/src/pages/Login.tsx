import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { trpc } from "../trpc";
import { Input } from "../components/ui/form/Input";
import { setAuthTokens } from "../service/auth";

export function Login() {
  const navigate = useNavigate();
  const loginMutation = trpc.api.auth.login.useMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function changeEvent(setter: Dispatch<SetStateAction<string>>) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };
  }

  async function loginUser() {
    const tokens = await loginMutation.mutateAsync({
      email,
      password,
    });
    setAuthTokens(tokens);
  }

  async function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loginUser();
    navigate("/");
  }

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm bg-base-300 border-base-300 border rounded-md p-4">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <form onSubmit={onFormSubmit}>
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
          <div className="flex justify-center">
            <Link to="/register" className="link">
              Pas encore inscrit ?
            </Link>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn mt-3">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
