import { spawn } from "child_process";
import logger from "./logger";

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

export async function downloadYouTubeAudio(
  videoId: string,
  outputPath: string,
) {
  return new Promise<string>((resolve, reject) => {
    const process = spawn("yt-dlp", [
      "-x",
      "--audio-format",
      "mp3",
      "--output",
      outputPath,
      "--audio-quality",
      "0",
      "--write-thumbnail",
      `--`,
      videoId,
    ]);

    process.on("close", (code) => {
      if (code === 0) resolve(outputPath);
      else reject("Failed to download audio");
    });

    process.on("error", (err) => {
      logger.info(`Error executing yt-dlp for video ${videoId}:`, err);
        //reject(`Error executing yt-dlp: ${err.message}`);
    })
  });
}
