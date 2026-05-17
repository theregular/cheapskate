import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const scriptName = process.argv[2];

if (!scriptName) {
  console.error("Usage: node scripts/run-workspaces-if-present.mjs <script>");
  process.exit(2);
}

const hasWorkspacePackage = ["apps", "packages"].some((workspaceRoot) => {
  if (!existsSync(workspaceRoot)) {
    return false;
  }

  return readdirSync(workspaceRoot, { withFileTypes: true }).some((entry) => {
    return entry.isDirectory() && existsSync(`${workspaceRoot}/${entry.name}/package.json`);
  });
});

if (!hasWorkspacePackage) {
  process.exit(0);
}

const result = spawnSync(
  "npm",
  ["run", scriptName, "--workspaces", "--if-present"],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);
