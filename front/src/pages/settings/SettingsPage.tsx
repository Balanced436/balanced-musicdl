import useAdminHook from "../../hooks/AdminHooks.ts";

const SettingsPage = () => {
  const { mutate: clearData } = useAdminHook();
  const handleClearData = (e) => {
    e.preventDefault();
    clearData();
  };

  const handleImportSong = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <div>
        <span>Clear data</span>
        <button onClick={handleClearData}>OK</button>
      </div>

      <div>
        <span>Resync data</span>
        <button onClick={handleImportSong}>OK</button>
      </div>
    </div>
  );
};

export default SettingsPage;
