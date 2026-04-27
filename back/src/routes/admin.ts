import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import fs from "node:fs/promises";
import { StatusCodes } from "http-status-codes";
import path from "path";
import logger from "../utils/logger.ts";
import {listSong} from "../utils/id3tags.ts";
import {processSingleSong} from "../scripts/processSongs.ts";

export const adminRouter: Router = Router();

adminRouter.post("/clear", async (req: Request, res: Response) => {
  try {
    const songs = await prisma.song.findMany();
    const coversDir = process.env.COVERS_ART_DIR || "/data/covers";

    const deletePromises = songs
      .map((s) => s.cover)
      .filter((cover) => cover != null) // Ensures type safety
      .map(async (cover) => {
        const fullPath = path.join(coversDir, cover);
        try {
          return await fs.unlink(fullPath);
        } catch (err) {
          return logger.error(`Failed to delete ${cover}:`, err);
        }
      });

    await Promise.all(deletePromises);
    await prisma.download.deleteMany();
    await prisma.song.deleteMany();

    res.status(StatusCodes.OK).json({ message: "Reset successful" });
  } catch (e) {
    logger.error(e);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to reset server data" });
  }
});

adminRouter.post("/import",async (req: Request, res: Response) => {
    try {
        const songs = listSong();

        for (const songPath of songs) {
            await processSingleSong(songPath);
        }
        res.status(StatusCodes.OK).json({ message: "import successful" });
    }catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
})