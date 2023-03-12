import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/form/Input";
import { trpc } from "../../trpc";

type CreateApplicationFormData = { name: string; domain: string };

export function CreateApplication() {
  const navigate = useNavigate();
  const createApplicationMutation = trpc.api.applications.new.useMutation();
  const [state, setState] = useState<CreateApplicationFormData>({
    name: "",
    domain: "",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createApplicationMutation.mutateAsync(state);
    navigate("/applications");
  }

  function onChange(propertyName: keyof CreateApplicationFormData) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setState((currentState) => ({
        ...currentState,
        [propertyName]: event.target.value,
      }));
    };
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="my-2 flex flex-col">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nom de l&apos;application</span>
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Nom de l'application"
              onChange={onChange("name")}
              value={state.name}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Domaine</span>
            </label>
            <Input
              type="text"
              name="domain"
              placeholder="example.fr"
              onChange={onChange("domain")}
              value={state.domain}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn mt-3">
            Créer l&apos;application
          </button>
        </div>
      </form>
    </div>
  );
}
