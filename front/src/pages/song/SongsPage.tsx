import useSongs from "../../hooks/SongsHooks";
import { SongTable } from "../../components/Song.tsx";
import { Song } from "@shared/prisma";
import { useRouter } from "@tanstack/react-router";
export const SongsPage = () => {
  const router = useRouter();
  const handleSongClick = (song: Song) => {
    router.navigate({ to: `/songs/${song.id}` });
  };
  const { data = [], isLoading, isError } = useSongs();
  if (!data || isLoading) {
    return null;
  }
  return <SongTable songs={data} onSongClick={handleSongClick} />;
};
