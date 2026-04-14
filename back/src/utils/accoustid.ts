import logger from "./logger.ts";
import { spawn } from "child_process";

type fingerPrint = { duration: number; fingerprint: string };
export const computeSongFingerPrint = (
  outputPath: string,
): Promise<fingerPrint> => {
  logger.info(`computeSongFingerPrint ${outputPath}`);

  return new Promise<fingerPrint>((resolve, reject) => {
    const fpcalc = spawn("fpcalc", ["-json", outputPath]);

    let resultData = "";
    let errorData = "";

    fpcalc.stdout.on("data", (data) => {
      resultData += data.toString();
    });

    fpcalc.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    fpcalc.on("close", (code: number) => {
      if (code === 0) {
        try {
          const json = JSON.parse(resultData);
          resolve({
            fingerprint: json.fingerprint,
            duration: Math.floor(json.duration),
          });
        } catch (e) {
          //logger.error(errorData);
          reject(errorData);
        }
      } else {
        reject(new Error(`fpcalc failed ${code}`));
      }
    });
  });
};

interface AcoustIDResponse {
  status: string;
  results: Array<{
    id: string;
    score: number;
    recordings?: Array<{
      id: string;
      title: string;
      artists?: unknown[];
    }>;
  }>;
}

export const accoustidLookup = async (
  accoustidClient: string,
  fingerPrint: fingerPrint,
): Promise<AcoustIDResponse> => {
  const { duration, fingerprint } = fingerPrint;

  const url = new URL("https://api.acoustid.org/v2/lookup");
  url.searchParams.set("client", accoustidClient);
  url.searchParams.set("meta", "recordings");
  url.searchParams.set("duration", duration.toString());
  url.searchParams.set("fingerprint", fingerprint);

  const request = await fetch(url.toString());

  if (!request.ok) {
    throw new Error(
      `AcoustID API error: ${request.status} ${request.statusText}`,
    );
  }

  const response: AcoustIDResponse = await request.json();

  if (response.status !== "ok") {
    throw new Error("AcoustID API returned a non-ok status");
  }

  return response;
};
