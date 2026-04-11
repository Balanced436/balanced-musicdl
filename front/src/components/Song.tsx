import { Song as SongType } from "@shared/prisma";
type SongProps = {
  song: SongType;
};

type SongTableProps = {
  songs: SongType[];
  onSongClick: (song: SongType) => void;
};

export const Song = ({ song }: SongProps) => {
  return (
    <div>
      <span>id: {song.id}</span>
      <span>title: {song.title}</span>
      <span>album: {song.album}</span>
      <span>creation date: {song.createdAt.toLocaleString()}</span>
      <span>update date: {song.updatedAt.toLocaleString()}</span>
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
            <th>Titre</th>
            <th>Fichier</th>
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
              <td>{song.title || "Sans titre"}</td>
              <td>
                <code>{song.fileName}</code>
              </td>
              <td>{song.artist || "Inconnu"}</td>
              <td>{song.album || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
