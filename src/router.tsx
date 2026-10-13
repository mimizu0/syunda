import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

function routerBasepath(): string | undefined {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (!base || base === "." || base === "/") return undefined;
  return base;
}

export function getRouter() {
  const basepath = routerBasepath();
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    ...(basepath ? { basepath } : {}),
  });
}
