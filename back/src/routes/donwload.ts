import { StatusCodes } from "http-status-codes";
import {DownloadStatus, prisma} from "../lib/prisma";
import { Router, Request, Response } from "express";

export const donwloadRouter = Router();

export const DOWNLOAD_ROUTE_ERROR = {
    MISSING_OR_INVALID_VIDEO_ID: "No video ID ('v') found in the request parameters.",
} as const;

donwloadRouter.post(
    "/songs/download",
    async (req: Request, res: Response): Promise<void> => {
        const url = new URL(req.url, "http://localhost");
        const v = url.searchParams.get("v");

        try {
            if (!v || v.trim() === "") {
                throw new Error(DOWNLOAD_ROUTE_ERROR.MISSING_OR_INVALID_VIDEO_ID);
            }
            const download = await prisma.download.create({
                data: {
                    videoId: v,
                    status: DownloadStatus.PENDING
                }
            });

            res.status(StatusCodes.CREATED).json(download);

        } catch (error: any) {
            res.status(StatusCodes.BAD_REQUEST).json({
                error: error.message || "An unexpected error occurred"
            });
        }
    },
);
