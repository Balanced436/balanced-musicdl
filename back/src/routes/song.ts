import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { StatusCodes } from "http-status-codes";

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
    const { title, artist, album } = req.body;

    try {
      const updatedSong = await prisma.song.update({
        where: { id },
        data: { artist: artist, album: album, title: title },
      });
      res.json(updatedSong);
    } catch (error) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Song not found or update failed" });
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
