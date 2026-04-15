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
import SongEditPage from "./pages/song/SongEditPage.tsx";
import DonwloadPage from "./pages/download/DownloadPage.tsx";

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

export const songEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/songs/edit/$songId",
  component: SongEditPage,
});

export const downloadIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/download",
  component: DonwloadPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  songsIndexRoute,
  songDetailsRoute,
  songEditRoute,
  downloadIndexRoute
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
