import type { AppEnv } from "./types.ts";
import { handleRequest } from "./handler.ts";

export { MetricsStore } from "./metrics.ts";
export { FilesStore } from "./files.ts";

export default {
  fetch(req: Request, env: AppEnv): Promise<Response> {
    return handleRequest(req, env);
  },
};
