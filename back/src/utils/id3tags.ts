import { readdirSync, readFileSync, renameSync } from "fs";
import NodeID3 from "node-id3";
import path from "path";
export const listSong = (): string[] => {
  const songDir = process.env.SONGS_DIR || "/data/music";
  return readdirSync(songDir).map((name) => `${songDir}/${name}`);
};

export const parseID3tags = (songPath: string) => {
  return NodeID3.read(songPath);
};

export const updateID3tags = (songPath: string, tags: NodeID3.Tags) => {
  const success = NodeID3.update(tags, songPath);
  if (success instanceof Error) {
    throw new Error(
      `Erreur lors de la mise à jour des tags: ${success.message}`,
    );
  }
  return success;
};

export const renameFileFromTags = (songPath: string) => {
  const tags = NodeID3.read(songPath);

  const artist = tags.artist || "Unknown Artist";
  const album = tags.album || "Unknown Album";
  const title = tags.title || "Unknown Title";

  const sanitize = (str: string) => str.replace(/[\\/:*?"<>|]/g, "");

  const newFileName = `${sanitize(artist)} - ${sanitize(album)} - ${sanitize(title)}.mp3`;
  const directory = path.dirname(songPath);
  const newPath = path.join(directory, newFileName);

  try {
    renameSync(songPath, newPath);
    console.info(`Fichier renommé en : ${newFileName}`);
    return newPath;
  } catch (error) {
    console.error("Erreur lors du renommage :", error);
    return songPath;
  }
};
