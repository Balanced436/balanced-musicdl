import { useParams, useRouter } from "@tanstack/react-router";
import { useSong } from "../../hooks/SongsHooks.tsx";
import { Song } from "../../components/Song.tsx";
const SongDetailsPage = () => {
  const { songId } = useParams({ from: "/songs/$songId" });
  const router = useRouter();
  const { data, isLoading } = useSong(songId);
  if (!data || isLoading) {
    return;
  }

  const handleEditSong = () => {
    router.navigate({ to: `/songs/edit/${data.id}` });
  };
  return (
    <div>
      <h1>Song details</h1>
      <button onClick={handleEditSong}>edit</button>
      <Song song={data} />
    </div>
  );
};

export default SongDetailsPage;
