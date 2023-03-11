import { useParams } from "react-router-dom";

export type ApplicationParams = { id: string };

export function Application() {
  const { id } = useParams<ApplicationParams>();
  return <>{id}</>;
}
