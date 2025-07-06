import { Hono } from "hono";
import { authMiddleware } from "../utils/middleware";

const protectedRoute = new Hono();

protectedRoute.use("/*", authMiddleware);

protectedRoute.get("/profile", (c) => {
  const user = c.get("jwtPayload");
  return c.json({ user });
});

export default protectedRoute;
