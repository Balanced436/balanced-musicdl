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
import { SongsPage } from "./pages/song/SongsPage.tsx";
import SongDetailsPage from "./pages/song/SongDetailsPage.tsx";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: RootPage,
});

export const songsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/songs",
  component: SongsPage,
});

export const songDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/songs/$songId",
  component: SongDetailsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  songsIndexRoute,
  songDetailsRoute,
]);

const client = new QueryClient();
const router = createRouter({ routeTree });
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  </StrictMode>,
);
