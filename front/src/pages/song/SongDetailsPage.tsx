import { useParams } from "@tanstack/react-router";
import { useSong } from "../../hooks/SongsHooks.tsx";
import { Song } from "../../components/Song.tsx";
const SongDetailsPage = () => {
  const { songId } = useParams({ from: "/songs/$songId" });
  const { data, isLoading } = useSong(songId);
  if (!data || isLoading) {
    return;
  }
  return <Song song={data} />;
};

export default SongDetailsPage;
