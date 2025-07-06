import { Hono } from "hono";
import { sign } from "hono/jwt";

const auth = new Hono();
const SECRET = "secret_key"; // Replace with a secure key in production

auth.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  // Replace with real DB validation
  if (username === "admin" && password === "password") {
    const token = await sign({ sub: username, role: "admin" }, SECRET);
    return c.json({ token });
  }
  return c.text("Unauthorized", 401);
});

export default auth;
