/**
 * This script parse all songs inside folder $SONGS_DIR and store id3 tags inside the database
 */
import logger from "../utils/logger";
import { listSong, parseID3tags, saveCoverArt } from "../utils/id3tags";
import { prisma } from "../lib/prisma";

async function main() {
  const songs = listSong();
  const coverDir = process.env.COVER_ART_DIR || "/data/covers";

  for (const songPath of songs) {
    const tags = parseID3tags(songPath);
    const artist = tags.artist || "Unknown Artist";
    const album = tags.album || "Unknown Album";
    const title = tags.title || "Unknown Title";
    const coverPath = saveCoverArt(songPath, coverDir);
    const filename = songPath.split("/").at(-1);
    if (!filename) {
      throw new Error("No filename ?");
    }
    console.info(filename);
    await prisma.song.create({
      data: {
        album: album,
        artist: artist,
        title: title,
        fileName: filename,
        cover: coverPath,
      },
    });
  }
}

main();
