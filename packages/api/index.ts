import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { serve } from "@hono/node-server";
import auth from "./routes/auth";
import protectedRoute from "./routes/protected";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

app.route('/auth', auth);            // POST /auth/login
app.route('/api', protectedRoute);     // GET /api/profile

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;

serve({
  fetch: app.fetch,
  port: 8123,
});
