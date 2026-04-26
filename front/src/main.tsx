import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RootPage } from "./App.tsx";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SongsPage } from "./pages/song/SongsPage.tsx";
import SongDetailsPage from "./pages/song/SongDetailsPage.tsx";
import SongEditPage from "./pages/song/SongEditPage.tsx";
import DonwloadPage from "./pages/download/DownloadPage.tsx";
import SettingsPage from "./pages/settings/SettingsPage.tsx";

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <nav style={{ display: "flex", gap: 10, paddingBottom: 10 }}>
        <a href={"/songs"}>Songs</a>
        <a href={"/download"}>Download</a>
        <a href={"/settings"}>Settings</a>
      </nav>
      <Outlet />
    </div>
  ),
});

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

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  songsIndexRoute,
  songDetailsRoute,
  songEditRoute,
  downloadIndexRoute,
  settingsRoute,
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
