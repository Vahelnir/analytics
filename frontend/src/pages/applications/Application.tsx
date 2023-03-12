import { useNavigate, useParams } from "react-router-dom";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import atomDark from "react-syntax-highlighter/dist/esm/styles/prism/atom-dark";
import { trpc } from "../../trpc";

export type ApplicationParams = { applicationId: string };
SyntaxHighlighter.registerLanguage("markup", markup);

const scriptUrl = "http://localhost:3000/engine/analytics.iife.js";
const script = (
  url: string,
  token: string
) => `<script defer src="${url}"></script>
<script defer>
  analytics.init({
    applicationId: "${token}",
  });
</script>`;

export function Application() {
  const navigate = useNavigate();
  const { applicationId } = useParams<ApplicationParams>();
  if (!applicationId) {
    throw new Error("applicationId param is not defined");
  }
  const applicationQuery = trpc.api.applications.find.useQuery({
    id: applicationId,
  });
  const deleteApplicationMutation = trpc.api.applications.delete.useMutation();
  const application = applicationQuery.data;

  async function deleteApplication() {
    const res = confirm(
      "Etes-vous sur de vouloir supprimer cette application?"
    );
    if (!res) {
      return;
    }
    await deleteApplicationMutation.mutateAsync({ id: applicationId ?? "" });
    navigate("/applications");
  }
  return (
    <div>
      {!applicationQuery.isLoading ? (
        application ? (
          <>
            <h2 className="text-3xl mt-4">
              Application &quot;{application?.name}&quot;
            </h2>
            <button
              type="button"
              className="btn btn-error"
              onClick={deleteApplication}
            >
              Supprimer
            </button>

            <div className="card bg-base-100 shadow-xl m-4">
              <div className="card-body">
                <h3 className="text-2xl card-title">Installation</h3>
                <p className="text-lg">
                  Il faut ajouter ce script à toutes les pages de votre site où
                  vous souhaitez tracker les utilisateurs
                </p>

                <SyntaxHighlighter language="markup" style={atomDark}>
                  {script(scriptUrl, application.token)}
                </SyntaxHighlighter>
              </div>
            </div>
          </>
        ) : (
          <>Aucune application trouvée avec cet ID</>
        )
      ) : (
        <>Chargement...</>
      )}
    </div>
  );
}
