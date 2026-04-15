import { Song as SongType } from "@shared/prisma";
type SongProps = {
  song: SongType;
};

type SongTableProps = {
  songs: SongType[];
  onSongClick: (song: SongType) => void;
};

type SongEditProps = {
  song: SongType;
  onSongUpdate: () => void;
};

export const Song = ({ song }: SongProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>id: {song.id}</span>
      <span>title: {song.title}</span>
      <span>album: {song.album}</span>
      <span>creation date: {song.createdAt.toLocaleString()}</span>
      <span>update date: {song.updatedAt.toLocaleString()}</span>
      {song.cover && (
        <img height={200} src={`http://localhost:4000/covers/${song.cover}`} />
      )}
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
  const handleSongUpdate = (e) => {
    e.preventDefault();
    // handle form values
    onSongUpdate();
  };
  return (
    <form
      onSubmit={handleSongUpdate}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <label>Artist:</label>
      <input type={"text"} defaultValue={song.title || "unknow artist"} />

      <label>Title:</label>
      <input type={"text"} defaultValue={song.title || "unknow title"} />

      <label>Album</label>
      <input type={"text"} defaultValue={song.album || "unknow album"} />

      <label>Filename</label>
      <input type={"text"} defaultValue={song.fileName || "unknow album"} />

      {song.cover && song.cover && (
        <div>
          <img
            height={250}
            src={`http://localhost:4000/covers/${song.cover}`}
          />
        </div>
      )}
      <div>
        <button type={"submit"}>update</button>
      </div>
    </form>
  );
};
