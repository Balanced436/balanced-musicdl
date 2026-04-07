import { DownloadStatus, prisma } from "../lib/prisma";
import logger from "./logger";
import { getYouTubeTitle } from "./ytb";

export const metadataWorker = async () => {
  logger.info("Metadata worker started");

  while (true) {
    const job = await prisma.download.findFirst({
      where: { status: DownloadStatus.PENDING },
      orderBy: { createdAt: "asc" },
    });

    if (job) {
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

export const downloadWorker = async () => {};
