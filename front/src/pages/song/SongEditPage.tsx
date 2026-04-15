import { useParams } from "@tanstack/react-router";
import { useSong } from "../../hooks/SongsHooks.tsx";
import { SongEdit } from "../../components/Song.tsx";
const SongEditPage = () => {
  const { songId } = useParams({ from: "/songs/edit/$songId" });
  const { data, isLoading } = useSong(songId);
  if (!data || isLoading) {
    return;
  }
  const handleSongUpdate = () => {
    console.log("handleSongUpdate");
  };
  return <SongEdit song={data} onSongUpdate={() => handleSongUpdate()} />;
};

export default SongEditPage;
