import { useQuery } from "@tanstack/react-query";

const useSongs = () => {
  const fn = async () => {
    const request = await fetch("http://localhost:4000/api/songs");
    if (!request.ok) {
      throw new Error("Failed to fetch Songs");
    } else {
      return await request.json();
    }
  };
  return useQuery({ queryKey: ["SONGS_QUERY_KEY"], queryFn: fn, staleTime: 0 });
};
export default useSongs;
