import { useQuery } from "@tanstack/react-query";
import { Download } from "@shared/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useDownloadMutation = () => {
  const queryClient = useQueryClient();

  const downloadMutationFn = async (v: string) => {
    const response = await fetch(`http://localhost:4000/api/download?v=${v}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to trigger download");
    }

    return await response.json();
  };

  return useMutation({
    mutationFn: downloadMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["DOWNLOAD_QUERY_KEY"] });

      console.log("Download successful", data);
    },
    onError: (error) => {
      console.error("Mutation error:", error.message);
    },
  });
};
