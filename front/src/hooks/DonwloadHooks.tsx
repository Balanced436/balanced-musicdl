import { useQuery } from "@tanstack/react-query";
import { Download } from "@shared/prisma";
export const useDownload = () => {
  const fn = async () => {
    const request = await fetch("http://localhost:4000/api/download");
    if (!request.ok) {
      throw new Error("Failed to fetch Download");
    } else {
      return await request.json();
    }
  };
  return useQuery<Download[]>({
    queryKey: ["DOWNLOAD_QUERY_KEY"],
    queryFn: fn,
    staleTime: 0,
  });
};
