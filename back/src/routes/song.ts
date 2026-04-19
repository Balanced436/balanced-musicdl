import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { StatusCodes } from "http-status-codes";
import {  randomUUID } from "node:crypto";
import { updateID3tags } from "../utils/id3tags.ts";
import logger from "../utils/logger.ts";
import path from "path";

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


songRouter.patch("/songs/:id", async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { album, title, artist, year, cover } = req.body;

    try {
        const updatedSong = await prisma.song.update({
            where: { id },
            data: { album, title, artist, year },
        });

        const songPath = `${process.env.SONGS_DIR}/${updatedSong.fileName || title}`;

        let imagePath: string | undefined;

        if (cover) {
            try {
                const dir = process.env.COVERS_ART_DIR || "./covers";
                const fileName = `${randomUUID()}.jpg`;
                imagePath = path.join(dir, fileName);

                const response = await fetch(cover, {
                    method: 'GET',
                    redirect: 'follow',
                });

                if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);

                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                await prisma.song.update({
                    where: { id },
                    data: { cover: fileName },
                });

            } catch (error) {
                logger.error("Cover download/save failed:", error);
            }
        }

        updateID3tags(songPath, {
            album,
            title,
            artist,
            year: year?.toString(),
            image: imagePath
        });


        res.json(updatedSong);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Update failed" });
    }
});
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
