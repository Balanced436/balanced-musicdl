/**
 * This script parse all songs inside folder $SONGS_DIR and store id3 tags inside the database
 */
import logger from "../utils/logger";
import { listSong, parseID3tags, saveCoverArt } from "../utils/id3tags";
import { prisma } from "../lib/prisma";
import { computeSongFingerPrint } from "../utils/accoustid.ts";
import path from "path";
import fs from "fs";

async function main() {
  const songs = listSong();

  for (const songPath of songs) {
    processSingleSong(songPath);
  }
}

export async function processSingleSong(songPath: string) {
  const coverDir = process.env.COVER_ART_DIR || "/data/covers";

  if (!fs.existsSync(songPath)) {
    throw new Error(`File not found at path: ${songPath}`);
  }
  try {
    const tags = parseID3tags(songPath);
    const fingerPrint = await computeSongFingerPrint(songPath);

    const artist = tags.artist || "Unknown Artist";
    const album = tags.album || "Unknown Album";
    const title = tags.title || "Unknown Title";
    const filename = path.basename(songPath);
    const coverPath = saveCoverArt(songPath, coverDir);

    logger.info(`Processing: ${filename}`);

    return await prisma.song.create({
      data: {
        album,
        artist,
        title,
        fileName: filename,
        cover: coverPath,
        fingerPrint: JSON.stringify(fingerPrint),
      },
    });

  } catch (error) {
    logger.error(`Failed to process song: ${songPath}`, error);
    throw error;
  }
}


main();
