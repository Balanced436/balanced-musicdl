import { useMutation } from "@tanstack/react-query";
const useAdminHook = () => {
  const requestOptions = {
    method: "POST",
  };
  const fn = async () => {
    const request = await fetch(
      "http://localhost:4000/admin/clear",
      requestOptions,
    );
    if (!request.ok) {
      throw new Error("Failed to reset request");
    }
    return await request.json();
  };

  return useMutation({ mutationFn: fn });
};

export default useAdminHook;
