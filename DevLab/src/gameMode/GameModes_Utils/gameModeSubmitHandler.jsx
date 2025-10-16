import bugBustPrompt from "../../components/OpenAI Prompts/bugBustPrompt";
import codeCrafterPrompt from "../../components/OpenAI Prompts/codeCrafterPrompt";
import codeRushPrompt from "../../components/OpenAI Prompts/codeRushPrompt";

import { useGameStore } from "../../components/OpenAI Prompts/useBugBustStore";


export const gameModeSubmitHandlers = {
  BugBust: async ({submittedCode,setIsCorrect,setShowIsCorrect,instruction,providedCode,description,subject, stageId}) => {
    try {
      const result = await bugBustPrompt({
        submittedCode,
        instruction,
        providedCode,
        description,
        subject,
      });
      if (result?.correct && result?.feedback) {
          useGameStore.getState().addStageFeedback({
    stageId: stageId || "UnknownStage", 
    evaluation: result.correct ? "Correct" : "Incorrect",
    feedback: result.feedback,
  });
      }
      setIsCorrect(result?.correct || false);
      setShowIsCorrect(true);
      console.log(result);
    } catch (error) {
      console.error("BugBust handler error:", error);
      setIsCorrect(false);
      setShowIsCorrect(true);
    }
  },
  CodeCrafter: async ({submittedCode,setIsCorrect,setShowIsCorrect,instruction,providedCode,description,subject, stageId}) => {
    try {
      console.log("na cacall ba ako?")
      const result = await codeCrafterPrompt({
        submittedCode,
        instruction,
        providedCode,
        description,
        subject,
      });
      if (result?.correct && result?.feedback) {
          useGameStore.getState().addStageFeedback({
    stageId: stageId || "UnknownStage", // or pass this in params
    evaluation: result.correct ? "Correct" : "Incorrect",
    feedback: result.feedback,
  });
      }
      setIsCorrect(result?.correct || false);
      setShowIsCorrect(true);
      console.log(result);
    } catch (error) {
      console.error(" CodeCrafter handler error:", error);
      setIsCorrect(false);
      setShowIsCorrect(true);
    }
  },

  CodeRush: async ({submittedCode,setIsCorrect,setShowIsCorrect,instruction,providedCode,description,subject, stageId}) => {
    const { setIsEvaluating } = useGameStore.getState();
    try {
      setIsEvaluating(true);
      const result = await codeRushPrompt({
        submittedCode,
        instruction,
        providedCode,
        description,
        subject,
      });
      if (result?.correct && result?.feedback) {
          useGameStore.getState().addStageFeedback({
    stageId: stageId || "UnknownStage", // or pass this in params
    evaluation: result.correct ? "Correct" : "Incorrect",
    feedback: result.feedback,
  });
      }
      setIsCorrect(result?.correct || false);
      setShowIsCorrect(true);
      console.log(result);
    } catch (error) {
      console.error("CodeRush handler error:", error);
      setIsCorrect(false);
      setShowIsCorrect(true);
    }finally {
      setIsEvaluating(false);
    }
  },

  BrainBytes: async ({ params }) => {
    goToNextStage(params);
  },
};
