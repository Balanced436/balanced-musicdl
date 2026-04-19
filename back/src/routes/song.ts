import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { StatusCodes } from "http-status-codes";
import { updateID3tags } from "../utils/id3tags.ts";
import logger from "../utils/logger.ts";
import { downloadCoverArt } from "../utils/musicBrainz.ts";
import NodeID3 from "node-id3";

export const songRouter = Router();

songRouter.post(
  "/songs",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { filename, title, artist, album } = req.body;
      const song = await prisma.song.create({
        data: {
          album: album,
          artist: artist,
          title: title,
          fileName: filename,
        },
      });
      res.status(StatusCodes.CREATED).json(song);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Could not create song. Ensure URL is unique." });
    }
  },
);

songRouter.get(
  "/songs",
  async (_req: Request, res: Response): Promise<void> => {
    const songs = await prisma.song.findMany();
    res.json(songs);
  },
);

songRouter.get(
  "/songs/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const song = await prisma.song.findUnique({
      where: { id },
    });

    if (!song)
      res.status(StatusCodes.NOT_FOUND).json({ error: "Song not found" });
    res.json(song);
  },
);

songRouter.patch(
  "/songs/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { album, title, artist, year, cover } = req.body;

    try {
      const updatedSong = await prisma.song.update({
        where: { id },
        data: { album, title, artist, year },
      });

      const songPath = `${process.env.SONGS_DIR}/${updatedSong.fileName || title}`;

      const updatedTags: NodeID3.Tags = {};

      // TODO: check how id3tags update handle undefined and null
      if (album) updatedTags.album = album;
      if (title) updatedTags.title = title;
      if (artist) updatedTags.artist = artist;

      if (cover) {
        try {
          const { filePath, id3Image } = await downloadCoverArt(cover);
          const coverName = filePath.split("/").at(-1);

          // update the song cover name
          await prisma.song.update({
            where: { id },
            data: { cover: coverName },
          });

          updatedTags.image = id3Image;
        } catch (error) {
          logger.error("Cover download/save failed:", error);
        }
      }

      updateID3tags(songPath, updatedTags);

      res.json(updatedSong);
    } catch (error) {
      logger.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Update failed" });
    }
  },
);
songRouter.delete(
  "/songs/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      await prisma.song.delete({
        where: { id },
      });
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Song not found" });
    }
  },
);

export default songRouter;
