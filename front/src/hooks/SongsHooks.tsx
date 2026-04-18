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

interface LookupResponse {
  title: string;
  cover?: string;
  "artist-credit": Array<{
    name: string;
    artist: {
      name: string;
      id: string;
    };
  }>;
  releases: Array<{
    title: string;
    id: string;
  }>;
}

export const useSongLookup = (songId: string) => {
  return useQuery<LookupResponse, Error, Partial<Song>>({
    queryKey: ["songLookup", songId],
    queryFn: async (): Promise<LookupResponse> => {
      const response = await fetch(
        `http://localhost:4000/api/lookup/${songId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Song Lookup");
      }
      return response.json();
    },
    enabled: false,
    select: (data): Partial<Song> => ({
      title: data.title,
      artist: data["artist-credit"]?.[0]?.name || "Unknown Artist",
      album: data.releases?.[0]?.title || data.title,
      cover: data.cover,
    }),
  });
};
