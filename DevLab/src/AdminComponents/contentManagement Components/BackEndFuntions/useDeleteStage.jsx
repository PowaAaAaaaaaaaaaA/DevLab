// src/AdminComponents/contentManagementComponents/BackEndFunctions/useDeleteStage.jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import deleteStage from "./deleteStage";

export function useDeleteStage(category, lessonId, levelId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stageId) =>
      deleteStage({ category, lessonId, levelId, stageId }),
    onSuccess: () => {
      toast.success("Stage deleted successfully!");
      queryClient.invalidateQueries(["stages", lessonId, levelId]);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete stage.");
    },
  });
}
