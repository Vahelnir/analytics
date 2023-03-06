import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to="/dashboard">
          Analytics
        </Link>
      </div>
      <div className="flex-none">
        <>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://api.dicebear.com/5.x/fun-emoji/svg" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Profil</a>
              </li>
              <li>
                <a>Applications</a>
              </li>
              <li>
                <a>Déconnexion</a>
              </li>
            </ul>
          </div>
        </>
        =
      </div>
    </div>
  );
}
