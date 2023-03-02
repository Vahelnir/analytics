export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export function setAuthTokens({ accessToken, refreshToken }: AuthTokens) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function getAuthTokens() {
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
}
