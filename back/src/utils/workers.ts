import { DownloadStatus, prisma } from "../lib/prisma";
import logger from "./logger";
import { downloadYouTubeAudio, getYouTubeTitle } from "./ytb";
import { processSingleSong } from "../scripts/processSongs.ts";

export const metadataWorker = async () => {
  logger.info("metadataWorker: started");
  while (true) {
    const job = await prisma.download.findFirst({
      where: { status: DownloadStatus.PENDING },
      orderBy: { createdAt: "asc" },
    });

    if (job) {
      logger.info(`metadataWorker: ${job.id}`);

      try {
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
      } catch (error) {
        logger.error(
          `metadataWorker: error fetching metadata for ${job.id} ${error}`,
        );
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
  logger.info("downloadWorker: started");

  while (true) {
    //logger.info(`Checking for QUEUED_FOR_DOWNLOAD jobs...`);
    const job = await prisma.download.findFirst({
      // where: { status: DownloadStatus.QUEUED_FOR_DOWNLOAD },
      where: { status: DownloadStatus.AWAITING_CONFIRMATION },
      orderBy: { createdAt: "asc" },
    });

    if (job) {
      try {
        logger.info(`downloadWorker: ${job.title} - ${job.id}`);
        await prisma.download.update({
          where: { id: job.id },
          data: {
            status: DownloadStatus.DOWNLOADING,
          },
        });

        const path = process.env.SONGS_DIR || "/data/music";

        const filePath = `${path}/${job.title}.mp3`;
        logger.info(filePath);
        const res: string = await downloadYouTubeAudio(job.videoId, filePath);

        // update database
        await processSingleSong(res);
        await prisma.download.update({
          where: { id: job.id },
          data: {
            status: DownloadStatus.COMPLETED,
          },
        });
      } catch (error) {
        await prisma.download.update({
          where: { id: job.id },
          data: {
            status: DownloadStatus.FAILED,
          },
        });
        logger.error(`downloadWorker: Error downloading ${job.id} ${error}`);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, job ? 100 : 2000));
  }
};
