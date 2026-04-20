import { useParams } from "@tanstack/react-router";
import { useMutateSong, useSong } from "../../hooks/SongsHooks.tsx";
import { SongEdit } from "../../components/Song.tsx";
const SongEditPage = () => {
  const { songId } = useParams({ from: "/songs/edit/$songId" });
  const { mutate } = useMutateSong();
  const { data, isLoading } = useSong(songId);
  if (!data || isLoading) {
    return;
  }
  const handleSongUpdate = (song) => {
    console.log("handleSongUpdate");
    console.log(song);
    mutate({ songId: songId, data: song });
  };
  return (
    <div>
      <button type={"submit"}>lookup</button>
      <SongEdit song={data} onSongUpdate={handleSongUpdate} />
    </div>
  );
};

export default SongEditPage;
