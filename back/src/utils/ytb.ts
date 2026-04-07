import { spawn } from "child_process";

export async function getYouTubeTitle(videoId: string) {
  return new Promise<string>((resolve, reject) => {
    const process = spawn("yt-dlp", ["--get-title", `--`, videoId]);

    let title = "";
    process.stdout.on("data", (data) => {
      title += data.toString();
    });

    process.on("close", (code) => {
      if (code === 0) resolve(title.trim());
      else reject("Failed to fetch title");
    });
  });
}
