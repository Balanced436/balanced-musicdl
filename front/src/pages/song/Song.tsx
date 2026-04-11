import useSongs from "../../hooks/SongsHooks";
import { SongTable } from "../../components/Song.tsx";
import { Song } from "@shared/prisma";
export const SongsPage = () => {
  const { data = [], isLoading, isError } = useSongs();
  if (!data || isLoading) {
    return null;
  }
  return (
    <SongTable songs={data} onSongClick={(song: Song) => console.log(song)} />
  );
};
