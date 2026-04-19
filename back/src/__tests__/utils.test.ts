import {
  updateID3tags,
  renameFileFromTags,
} from "../utils/id3tags";
import fs from "fs";
import NodeID3 from "node-id3";
import { mkdirSync, rmSync } from "node:fs";
import { downloadCoverArt } from "../utils/musicBrainz.ts";

describe("utils functions", () => {
  const fixturePath = "src/__tests__/fixtures/last light.mp3";
  const tempPath = "src/__tests__/fixtures/temp_test.mp3";

  beforeEach(() => {
    fs.copyFileSync(fixturePath, tempPath);
  });

  afterEach(() => {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    const renamedPath =
      "src/__tests__/fixtures/Artist Test - Album Test - Title Test.mp3";
    if (fs.existsSync(renamedPath)) fs.unlinkSync(renamedPath);
  });

  describe("ID3 Tags Operations", () => {
    it("should update id3tags correctly", () => {
      const newTags = {
        artist: "Artist Test",
        album: "Album Test",
        title: "Title Test",
      };

      updateID3tags(tempPath, newTags);

      const updatedTags = NodeID3.read(tempPath);
      expect(updatedTags.artist).toBe("Artist Test");
      expect(updatedTags.album).toBe("Album Test");
      expect(updatedTags.title).toBe("Title Test");
    });

    it("should rename the file based on its tags", () => {
      const tags = {
        artist: "Artist Test",
        album: "Album Test",
        title: "Title Test",
      };
      updateID3tags(tempPath, tags);

      const newPath = renameFileFromTags(tempPath);

      expect(newPath).toContain("Artist Test - Album Test - Title Test.mp3");
      expect(fs.existsSync(newPath)).toBe(true);
      expect(fs.existsSync(tempPath)).toBe(false);
    });
  });
});

describe("downloadCoverArt", () => {
  const mockDir = "src/__tests__/fixtures/covers";
  const realImageUrl =
    "https://coverartarchive.org/release/468deced-0848-447e-b93a-0b51db3303ae/front-250";

  beforeAll(async () => {
    process.env.COVERS_ART_DIR = mockDir;
    if (!fs.existsSync(mockDir)) {
      mkdirSync(mockDir, { recursive: true });
    }
  });

  afterAll(async () => {
    if (fs.existsSync(mockDir)) {
      rmSync(mockDir, { recursive: true, force: true });
    }
  });

  it("should download a real image from the web and save it", async () => {
    // TODO also test id3Image
    const { filePath, id3Image } = await downloadCoverArt(realImageUrl);
    expect(fs.existsSync(filePath)).toBe(true);
    expect(filePath).toContain(mockDir);
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(1000);
  }, 15000);
});
