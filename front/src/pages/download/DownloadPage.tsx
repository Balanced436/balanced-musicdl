import { useDownload } from "../../hooks/DonwloadHooks.tsx";
import { DonwloadBar, DownloadTable } from "../../components/Download.tsx";

const DonwloadPage = () => {
  const { data = [], isLoading } = useDownload();
  const handleDownload = (url: string) => {
    try {
      const ytlurl = new URL(url);
      const v = ytlurl.searchParams.get("v");
      console.log(v);
    } catch (e) {
      console.error(e);
    }
  };

  if (!data && isLoading) {
    return;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <DonwloadBar onDownload={handleDownload} />
      </div>
      <DownloadTable download={data} />
    </div>
  );
};
export default DonwloadPage;
