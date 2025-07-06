import { jwt } from "hono/jwt";

export const authMiddleware = jwt({
  secret: "secret_key", // Replace with a secure key in production
  cookie: "auth_token", // optional: check this cookie first
});
