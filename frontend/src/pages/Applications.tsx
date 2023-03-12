import { Link } from "react-router-dom";
import { trpc } from "../trpc";

export function Applications() {
  const applications = trpc.api.applications.all.useQuery();
  return (
    <div>
      <h2 className="text-3xl mt-4">Liste des applications</h2>

      <div>
        <Link to="/applications/new" className="btn">
          + Ajouter une application
        </Link>
        <div className="flex flex-wrap">
          {applications.data?.map(({ id, name, domain }) => (
            <Link to={`/applications/${id}`} key={id} className="w-1/5">
              <div className="card bg-base-100 shadow-xl m-4">
                <div className="card-body">
                  <h3 className="text-xl card-title">{name}</h3>
                  <p>{domain}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
