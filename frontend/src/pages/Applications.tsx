import { Link } from "react-router-dom";
import { trpc } from "../trpc";

export function Applications() {
  const applications = trpc.api.user.applications.all.useQuery();
  return (
    <div>
      <h2 className="text-3xl mt-4">Liste des applications</h2>

      <div>
        <Link to="/application/new" className="btn">
          + Ajouter une application
        </Link>
        <div className="flex flex-wrap">
          {applications.data?.map(({ id, name, urls }) => (
            <Link to={`/applications/${id}`} key={id} className="w-1/5 block">
              <div className="border border-base-100 rounded m-4 p-2">
                <h3 className="text-xl">{name}</h3>
                <p>{urls.join(", ")}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
