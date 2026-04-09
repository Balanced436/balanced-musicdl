import logger from "./logger";
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
