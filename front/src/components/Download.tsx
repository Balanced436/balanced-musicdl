import { Download } from "@shared/prisma";
import { useState } from "react";
interface DownloadTableProps {
  download: Download[];
}
export const DownloadTable = ({ download }: DownloadTableProps) => {
  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
            <th>ID</th>
            <th>Video id</th>
            <th>Title</th>
            <th>Status</th>
            <th>Creation date</th>
          </tr>
        </thead>
        <tbody>
          {download.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.videoId}</td>
                <td>{item.title}</td>
                <td>{item.status}</td>
                <td>{item.createdAt.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

interface DownloadBarProps {
  onDownload: (url: string) => void;
}
export const DonwloadBar = ({ onDownload }: DownloadBarProps) => {
  const [url, setUrl] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onDownload(url);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label id={"url"}>URL</label>
      <input
        id={"url"}
        type={"text"}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit">Download</button>
    </form>
  );
};
