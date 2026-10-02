import { withEve } from "eve/vercel";

const config = await withEve({
  routes: [{ destination: { service: "web", type: "service" }, src: "^(.*)$" }],
  services: {
    web: { framework: "nextjs", root: "apps/web" },
  },
});

/** Keep the generated service layout while avoiding shell commands on Windows. */
export default {
  ...config,
  services: {
    ...config.services,
    eve: {
      ...config.services.eve,
      ...(process.platform === "win32"
        ? {
            devCommand: "node ../../../scripts/eve-dev.mjs",
          }
        : {}),
    },
  },
};
