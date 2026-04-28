import useClearDataHook from "../../hooks/AdminHooks.ts";
import { useResyncDataHook } from "../../hooks/AdminHooks.ts";

const SettingsPage = () => {
  const { mutate: clearData } = useClearDataHook();
  const { mutate: resyncData } = useResyncDataHook();
  const handleClearData = (e: React.MouseEvent) => {
    e.preventDefault();
    clearData();
  };

  const handleResyncData = (e: React.MouseEvent) => {
    e.preventDefault();
    resyncData();
  };
  return (
    <div>
      <h1>Settings</h1>
      <div>
        <h2>Data</h2>
        <span>Clear data</span>
        <button onClick={handleClearData}>OK</button>
      </div>

      <div>
        <span>Resync data</span>
        <button onClick={handleResyncData}>OK</button>
      </div>
    </div>
  );
};

export default SettingsPage;
