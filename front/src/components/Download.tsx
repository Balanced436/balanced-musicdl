import { Download } from "@shared/prisma";
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
