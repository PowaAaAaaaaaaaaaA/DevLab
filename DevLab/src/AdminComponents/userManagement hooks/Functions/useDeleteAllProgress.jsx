import { deleteAllProgress } from "../Backend Calls/deleteAllProgress";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteAllProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid }) => deleteAllProgress(uid),

    onMutate: ({ uid }) => {
      queryClient.cancelQueries({ queryKey: ["allUser"] });

      const previousQueryData = queryClient.getQueryData(["allUser"]);

      queryClient.setQueryData(["allUser"], (old = []) =>
        old.map((user) =>
          user.id === uid
            ? {
                ...user,
                levelCount: {
                  ...user.levelCount,
                  Html: 0,
                  Css: 0,
                  JavaScript: 0,
                  Database: 0,
                },
              }
            : user
        )
      );

      return { previousQueryData };
    },

    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["allUser"], context?.previousQueryData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allUser"] });
    },
  });
};
