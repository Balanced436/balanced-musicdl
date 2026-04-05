import {
  parseID3tags,
  updateID3tags,
  renameFileFromTags,
} from "../utils/id3tags";
import fs from "fs";
import NodeID3 from "node-id3";

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
