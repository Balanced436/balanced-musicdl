import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import { StatusCodes } from "http-status-codes";
import {musicBrainzAlbumCover, musicBrainzRecording} from "../utils/musicBrainz.ts";
import { accoustidLookup } from "../utils/accoustid.ts";

const lookupRouter = Router();

const MIN_SCORE_THRESHOLD = 0.5;

lookupRouter.get(
  "/lookup/:songid",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { songid } = req.params;

      const song = await prisma.song.findUnique({
        where: { id: songid },
        select: { fingerPrint: true },
      });

      if (!song) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Song not found" });
      }

      if (!song.fingerPrint) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Song does not have a fingerprint" });
      }

      const { duration, fingerprint } = JSON.parse(song.fingerPrint);
      const accoustidClient = process.env.ACCOUSTID_CLIENT;

      if (!accoustidClient) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Accoustid client not configured" });
      }

      const accoustidResponse = await accoustidLookup(accoustidClient, {
        duration,
        fingerprint,
      });
      const bestResult = accoustidResponse.results?.[0];

      if (!bestResult || bestResult.recordings?.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "No records found" });
      }

      if (bestResult.score < MIN_SCORE_THRESHOLD) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          error: "Match found but score is too low",
          score: bestResult.score,
        });
      }

      const mbid = bestResult.recordings[0].id;
      const musicBrainzMetas = await musicBrainzRecording(mbid);

      const firstRelease = musicBrainzMetas.releases?.[0];

      return res.json({
        ...musicBrainzMetas,
        album: firstRelease?.title || "Unknown Album",
        cover: firstRelease
          ? musicBrainzAlbumCover(firstRelease.id)
          : null,
      });
    } catch (error) {
      console.error("Lookup Error:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "An error occurred during metadata lookup",
      });
    }
  },
);

export default lookupRouter;
