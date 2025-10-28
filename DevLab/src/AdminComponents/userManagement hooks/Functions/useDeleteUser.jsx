import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../Backend Calls/deleteUser";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uid) => deleteUser(uid),
    onMutate: (uid) => {
      const previousUsers = queryClient.getQueryData(["allUser"]);
      queryClient.setQueryData(["allUser"], (old) =>
        old.filter((user) => user.id !== uid)
      );
      return { previousUsers };
    },
    onError: (_err, _uid, context) => {
      queryClient.setQueryData(["allUser"], context?.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["allUser"]);
    },
  });
};
