import { randomUUID } from "node:crypto";
import path from "path";
import { writeFile } from "fs/promises";
import NodeID3 from "node-id3";
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
  country?: string;
  quality?: string;
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
  releases: MusicBrainzRelease[];
}

export const musicBrainzRecording = async (
  mbid: string,
): Promise<MusicBrainzRecording> => {
  const url = new URL(`https://musicbrainz.org/ws/2/recording/${mbid}`);
  url.searchParams.set("fmt", "json");
  url.searchParams.set("inc", "artists+releases+genres");

  const requestOptions = {
    headers: {
      "User-Agent": "Balancedmusicdl/1.0.0 ( dev@isaid.dev )",
      Accept: "application/json",
    },
  };

  const request = await fetch(url.toString(), requestOptions);

  if (!request.ok) {
    throw new Error(
      `MusicBrainz API error: ${request.status} ${request.statusText}`,
    );
  }

  const response: MusicBrainzRecording = await request.json();
  return response;
};

export const musicBrainzAlbumCover = (releaseMBID: string): string => {
  return `https://coverartarchive.org/release/${releaseMBID}/front-250`;
};

// Ensure we return exactly what the Promise signature promises
export const downloadCoverArt = async (
  url: string,
): Promise<{ filePath: string; id3Image: NodeID3.Tags["image"] }> => {
  const imageDir = path.resolve(process.env.COVERS_ART_DIR || "data/music");
  const imageName = `${randomUUID()}.jpeg`;
  const filePath = path.join(imageDir, imageName);

  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Failed to fetch cover art: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const id3Image: NodeID3.Tags["image"] = {
    mime: "image/jpeg",
    type: {
      id: 3,
    },
    description: "Cover Art",
    imageBuffer: buffer,
  };

  await writeFile(filePath, buffer);

  return { filePath, id3Image };
};
