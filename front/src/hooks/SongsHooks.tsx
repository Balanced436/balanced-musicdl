import { useQuery } from "@tanstack/react-query";
import { Song } from "@shared/prisma";

export const useSongs = () => {
  const fn = async () => {
    const request = await fetch("http://localhost:4000/api/songs");
    if (!request.ok) {
      throw new Error("Failed to fetch Songs");
    } else {
      return await request.json();
    }
  };
  return useQuery<Song[]>({
    queryKey: ["SONGS_QUERY_KEY"],
    queryFn: fn,
    staleTime: 0,
  });
};

export const useSong = (songId: string) => {
  const fn = async () => {
    const request = await fetch(`http://localhost:4000/api/songs/${songId}`);
    if (!request.ok) {
      throw new Error("Failed to fetch Songs");
    } else {
      return await request.json();
    }
  };
  return useQuery<Song>({
    queryKey: ["SONGS_QUERY_KEY", songId],
    queryFn: fn,
    staleTime: 0,
  });
};
