export type AppEnv = {
  AGY_REFRESH_TOKEN?: string;
  AGY_ACCESS_TOKEN?: string;
  AGY_OAUTH_CLIENT_ID?: string;
  AGY_OAUTH_CLIENT_SECRET?: string;
  AGY_OAUTH_REDIRECT_URI?: string;
  AGY_SEARCH_PROJECT?: string;
  AGY_SEARCH_MODEL?: string;
  AGY_SEARCH_ENDPOINT?: string;
  MCP_AUTH_TOKEN?: string;
};

export type SessionSource = "env" | "header" | "file" | "missing";

export type RequestSession = {
  refreshToken?: string;
  accessToken?: string;
  source: SessionSource;
};
