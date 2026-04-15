import { useDownload } from "../../hooks/DonwloadHooks.tsx";
import { DownloadTable } from "../../components/Download.tsx";

const DonwloadPage = () => {
  const { data = [], isLoading } = useDownload();

  if (!data && isLoading) {
    return;
  }
  return <DownloadTable download={data} />;
};
export default DonwloadPage;
