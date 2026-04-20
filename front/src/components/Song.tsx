import { Song as SongType } from "@shared/prisma";
import { useState } from "react";
import { useSongLookup } from "../hooks/SongsHooks.tsx";

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
  const {
    data: suggestion,
    refetch: fetchSuggestion,
    isFetching: isFetchingSuggestion,
  } = useSongLookup(song.id);

  const handleSongUpdate = (e) => {
    e.preventDefault();
    onSongUpdate(formData);
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    fetchSuggestion();
  };

  const handleAcceptSuggestion = async (e) => {
    e.preventDefault();
    if (suggestion) onSongUpdate(suggestion);
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
            suggestion?.artist || formData.artist || "unknow artist"
          }
          onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
        />
        {suggestion?.artist && <span>{suggestion?.artist}</span>}
      </div>

      <div>
        <label>Title:</label>
        <input
          type={"text"}
          defaultValue={formData.title || "unknow title"}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {suggestion?.title && <span>{suggestion?.title}</span>}
      </div>

      <div>
        <label>Album</label>
        <input
          type={"text"}
          defaultValue={formData.album || "unknow album"}
          onChange={(e) => setFormData({ ...formData, album: e.target.value })}
        />
        {suggestion?.album && <span>{suggestion?.album}</span>}
      </div>

      <div>
        <label>Filename</label>
        <input
          type={"text"}
          defaultValue={formData.fileName || "unknow album"}
        />

        {song.cover && song.cover && (
          <div>
            <img
              height={200}
              src={`http://localhost:4000/covers/${song.cover}`}
            />
          </div>
        )}

        {suggestion?.cover && (
          <div>
            <img height={200} src={suggestion.cover} />
          </div>
        )}
      </div>
      <div>
        <button type={"submit"}>update</button>
        <button type={"submit"} onClick={handleLookup}>
          lookup
        </button>

        {suggestion && (
          <button onClick={handleAcceptSuggestion}>accept suggestion</button>
        )}
      </div>
    </form>
  );
};
