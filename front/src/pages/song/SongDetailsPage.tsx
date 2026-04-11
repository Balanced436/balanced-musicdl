import { useParams } from "@tanstack/react-router";
import { useSong } from "../../hooks/SongsHooks.tsx";

const SongDetailsPage = () => {
  const { songId } = useParams({ from: "/songs/$songId" });
  const { data, isLoading, isError } = useSong(songId);
  if (!data || isLoading) {
    return;
  }
  return <div>{data.title}</div>;
};

export default SongDetailsPage;
