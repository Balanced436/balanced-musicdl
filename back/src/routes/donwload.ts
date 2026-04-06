import { spawn } from "child_process";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import songRouter from "./song";
import { Router, Request, Response } from "express";
// ... your other imports

export const donwloadRouter = Router();

donwloadRouter.post(
  "/songs/download",
  async (req: Request, res: Response): Promise<void> => {
    const { url } = req.body;
    const path = process.env.song_dir;
    const songDir = process.env.SONGS_DIR || "/data/music";
  },
);
