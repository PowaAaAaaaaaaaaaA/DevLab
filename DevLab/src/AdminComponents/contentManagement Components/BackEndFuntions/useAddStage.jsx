import { useMutation, useQueryClient } from "@tanstack/react-query";
import addStage from "./addStage"

export function useAddStage(activeTab) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['addStage'],
    mutationFn: addStage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lesson_data", activeTab],
      });
    },
  });
}
