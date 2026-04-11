import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RootPage } from "./App.tsx";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SongsPage } from "./pages/song/Song.tsx";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: RootPage,
});

const songsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/songs",
  component: SongsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, songsRoute]);

const client = new QueryClient();
const router = createRouter({ routeTree });
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  </StrictMode>,
);
