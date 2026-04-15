import {useDownload, useDownloadMutation} from "../../hooks/DonwloadHooks.tsx";
import { DonwloadBar, DownloadTable } from "../../components/Download.tsx";

const DonwloadPage = () => {
  const { data = [], isLoading } = useDownload();
  const { mutate, isPending } = useDownloadMutation();

  const handleDownload = (url: string) => {
    try {
      const ytlurl = new URL(url);
      const v = ytlurl.searchParams.get("v");
      if (!v){
        throw new Error("URL not valid");
      }
      mutate(v);

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
