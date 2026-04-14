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

export const getMBIDRecords = async (
  accoustidClient: string,
  fingerPrint: fingerPrint,
): Promise<AcoustIDResponse> => {
  const { duration, fingerprint } = fingerPrint;
  const client = process.env.client;

  if (!client) {
    throw new Error(
      "AcoustID client key is missing from environment variables",
    );
  }

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

export interface MusicBrainzArtist {
  id: string;
  name: string;
  "sort-name": string;
  disambiguation?: string;
}

export interface MusicBrainzRelease {
  id: string;
  title: string;
  "status-id"?: string;
  status?: string;
  date?: string;
  "country"?: string;
  "quality"?: string;
}

export interface MusicBrainzRecording {
  id: string;
  title: string;
  length: number | null;
  video: boolean;
  disambiguation?: string;
  "artist-credit"?: Array<{
    artist: MusicBrainzArtist;
    name: string;
    joinphrase?: string;
  }>;
  releases?: MusicBrainzRelease[];
}

export const getMusicBrainzRecords = async (mbid: string): Promise<MusicBrainzRecording> => {
  const url = new URL(`https://musicbrainz.org/ws/2/recording/${mbid}`);
  url.searchParams.set("fmt", "json");

  const requestOptions = {
    headers: {
      "User-Agent": "Balancedmusicdl/1.0.0 ( dev@isaid.dev )",
      "Accept": "application/json"
    }
  };

  const request = await fetch(url.toString(), requestOptions);

  if (!request.ok) {
    throw new Error(
        `MusicBrainz API error: ${request.status} ${request.statusText}`,
    );
  }

  const response: MusicBrainzRecording = await request.json();
  return response;
}