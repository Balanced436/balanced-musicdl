import { useParams } from "@tanstack/react-router";

const SongDetailsPage = () => {
  const { songId } = useParams({ from: "/songs/$songId" });
  return <div>{songId}</div>;
};

export default SongDetailsPage;
