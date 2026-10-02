import { fileURLToPath } from "node:url";

/** Start the Eve CLI from the project root without shell-dependent directory commands. */
const projectRoot = new URL("../", import.meta.url);
const binary = new URL("node_modules/eve/bin/eve.js", projectRoot);

process.chdir(fileURLToPath(projectRoot));
process.argv = [
  process.execPath,
  fileURLToPath(binary),
  "dev",
  "--no-ui",
  ...process.argv.slice(2),
];
await import(binary.href);
