// ============================================================
// Auth Configuration
// ============================================================

export interface AuthConfig {
  sessionStrategy: "jwt";
  secret: string;
}

const defaultConfig: AuthConfig = {
  sessionStrategy: "jwt",
  secret: process.env.AUTH_SECRET ?? "dev-secret-change-me",
};

export { defaultConfig as authConfig };
