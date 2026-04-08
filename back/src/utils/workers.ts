import { DownloadStatus, prisma } from "../lib/prisma";
import logger from "./logger";
import { downloadYouTubeAudio, getYouTubeTitle } from "./ytb";

export const metadataWorker = async () => {
  logger.info("Metadata worker started");

  while (true) {
    logger.info(`Checking for pending jobs...`);
    const job = await prisma.download.findFirst({
      where: { status: DownloadStatus.PENDING },
      orderBy: { createdAt: "asc" },
    });

    if (job) {
      logger.info(`Found job: ${job.id} for video ID: ${job.videoId}`);
      try {
        logger.info(`Processing metadata for: ${job.videoId}`);

        await prisma.download.update({
          where: { id: job.id },
          data: { status: DownloadStatus.ANALYZING },
        });

        const title = await getYouTubeTitle(job.videoId);

        await prisma.download.update({
          where: { id: job.id },
          data: {
            status: DownloadStatus.AWAITING_CONFIRMATION,
            title: title,
          },
        });

        logger.info(`Title found: ${title}. Awaiting user`);
      } catch (error) {
        logger.error(`Error fetching metadata for ${job.id}`, error);
        await prisma.download.update({
          where: { id: job.id },
          data: { status: DownloadStatus.FAILED },
        });
      }
    }

    await new Promise((resolve) => setTimeout(resolve, job ? 100 : 2000));
  }
};

export const downloadWorker = async () => {
  while (true) {
    logger.info(`Checking for QUEUED_FOR_DOWNLOAD jobs...`);
    const job = await prisma.download.findFirst({
      where: { status: DownloadStatus.QUEUED_FOR_DOWNLOAD },
      orderBy: { createdAt: "asc" },
    });

    if (job) {
      try {
        logger.info(`Starting download for: ${job.videoId}`);
        await prisma.download.update({
          where: { id: job.id },
          data: {
            status: DownloadStatus.DOWNLOADING,
          },
        });

        const path = process.env.SONGS_DIR || "/data/music";

        const filePath = `${path}/%(title)s.%(ext)s`;

        logger.info(job.videoId);
        const res: string = await downloadYouTubeAudio(job.videoId, filePath);
        await prisma.download.update({
          where: { id: job.id },
          data: {
            status: DownloadStatus.COMPLETED,
            filePath: res,
          },
        });
        logger.info(`Download completed for: ${job.videoId}, saved to ${res}`);
      } catch (e) {
        await prisma.download.update({
          where: { id: job.id },
          data: {
            status: DownloadStatus.FAILED,
          },
        });
        logger.error(`Error downloading ${job.id}`, e);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, job ? 100 : 2000));

  }
};
