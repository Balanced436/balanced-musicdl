import useSongs from "../../hooks/SongsHooks";
export const SongsPage = () => {
  const { data = [], isLoading, isError } = useSongs();
  if (!data || isLoading) {
    return null;
  }
  return (
    <div>
      {data.map((e) => {
        return (
          <p key={e.id}>
            {e.title} {e.fileName}
          </p>
        );
      })}
    </div>
  );
};
