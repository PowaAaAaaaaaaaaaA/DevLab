import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteLevel from "./deleteLevel";

export function useDeleteLevel(activeTab) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteLevel'],
    mutationFn: deleteLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lesson_data", activeTab],
      });
    },
  });
}
