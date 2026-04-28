import { Song as SongType } from "@shared/prisma";
import { useState } from "react";
import { useMbidLookup, useSongLookup } from "../hooks/SongsHooks.tsx";

type SongProps = {
  song: SongType;
};

type SongTableProps = {
  songs: SongType[];
  onSongClick: (song: SongType) => void;
};

type SongEditProps = {
  song: SongType;
  onSongUpdate: (song: Partial<SongType>) => void;
};

export const Song = ({ song }: SongProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>id: {song.id}</span>
      <span>title: {song.title}</span>
      <span>album: {song.album}</span>
      <span>creation date: {song.createdAt.toLocaleString()}</span>
      <span>update date: {song.updatedAt.toLocaleString()}</span>
      <div>
        {song.cover && (
          <img
            height={200}
            src={`http://localhost:4000/covers/${song.cover}`}
          />
        )}
      </div>
    </div>
  );
};

export const SongTable = ({ songs, onSongClick }: SongTableProps) => {
  const handleSongClick = (song: SongType) => {
    onSongClick(song);
  };
  return (
    <div className="table-container">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
            <th>Fichier</th>
            <th>Titre</th>
            <th>Artiste</th>
            <th>Album</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr
              key={song.id}
              onClick={() => handleSongClick(song)}
              style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
            >
              <td>{song.fileName}</td>
              <td>{song.title || "Sans titre"}</td>
              <td>{song.artist || "Inconnu"}</td>
              <td>{song.album || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const SongEdit = ({ song, onSongUpdate }: SongEditProps) => {
  const [formData, setFormData] = useState<SongType>(song);
  const [mbid, setMbid] = useState("");
  const {
    data: suggestion,
    refetch: fetchSuggestion,
    isFetching: isFetchingSuggestion,
  } = useSongLookup(song.id);

  const { data: mbidSuggestion, refetch: fetchMbidSuggestion } =
    useMbidLookup(mbid);

  const handleSongUpdate = (e) => {
    e.preventDefault();
    onSongUpdate(formData);
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    fetchSuggestion();
  };

  const handleMbidLookup = async (e) => {
    e.preventDefault();
    fetchMbidSuggestion();
  };

  const currentSuggestion = mbidSuggestion || suggestion;

  const handleAcceptSuggestion = async (e) => {
    e.preventDefault();
    if (currentSuggestion) onSongUpdate(currentSuggestion);
  };
  return (
    <form
      onSubmit={handleSongUpdate}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div>
        <label>Artist:</label>
        <input
          type={"text"}
          defaultValue={
            currentSuggestion?.artist || formData.artist || "unknow artist"
          }
          onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
        />
        {currentSuggestion?.artist && <span>{currentSuggestion?.artist}</span>}
      </div>

      <div>
        <label>Title:</label>
        <input
          type={"text"}
          defaultValue={formData.title || "unknow title"}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {currentSuggestion?.title && <span>{currentSuggestion?.title}</span>}
      </div>

      <div>
        <label>Album</label>
        <input
          type={"text"}
          defaultValue={formData.album || "unknow album"}
          onChange={(e) => setFormData({ ...formData, album: e.target.value })}
        />
        {currentSuggestion?.album && <span>{currentSuggestion?.album}</span>}
      </div>

      <div>
        <label>Filename</label>
        <input
          type={"text"}
          defaultValue={formData.fileName || "unknow album"}
        />

        {song.cover && (
          <div>
            <img
              height={200}
              src={`http://localhost:4000/covers/${song.cover}`}
            />
          </div>
        )}

        {currentSuggestion?.cover && (
          <div>
            <img height={200} src={currentSuggestion.cover} />
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          borderTop: "1px solid #ccc",
          paddingTop: "10px",
        }}
      >
        <label>MBID (MusicBrainz ID):</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Enter MBID..."
            value={mbid}
            onChange={(e) => setMbid(e.target.value)}
          />
          <button type="button" onClick={handleMbidLookup}>
            Lookup by MBID
          </button>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button type={"submit"}>update</button>
        <button type={"button"} onClick={handleLookup}>
          lookup by Fingerprint
        </button>

        {currentSuggestion && (
          <button onClick={handleAcceptSuggestion}>accept suggestion</button>
        )}
      </div>
    </form>
  );
};
