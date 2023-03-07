import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthTokens } from "../service/auth";
import { trpc } from "../trpc";

export function Logout() {
  const navigate = useNavigate();
  const logoutMutation = trpc.api.user.logout.useMutation();

  async function logout() {
    await logoutMutation.mutateAsync();
    setAuthTokens({ accessToken: "", refreshToken: "" });
    navigate("/login");
  }

  useEffect(() => {
    logout();
  }, []);
  return <></>;
}
