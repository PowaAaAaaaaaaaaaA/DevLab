import bugBustPrompt from "../../components/OpenAI Prompts/bugBustPrompt";
import codeCrafterPrompt from "../../components/OpenAI Prompts/codeCrafterPrompt";
import codeRushPrompt from "../../components/OpenAI Prompts/codeRushPrompts";

export const gameModeSubmitHandlers = {
  BugBust: async ({submittedCode,setIsCorrect,setShowIsCorrect,instruction,providedCode,description,subject}) => {
    try {
      const result = await bugBustPrompt({
        submittedCode,
        instruction,
        providedCode,
        description,
        subject,
      });
      setIsCorrect(result?.correct || false);
      setShowIsCorrect(true);
      console.log(result);
    } catch (error) {
      console.error("BugBust handler error:", error);
      setIsCorrect(false);
      setShowIsCorrect(true);
    }
  },
  CodeCrafter: async ({submittedCode,setIsCorrect,setShowIsCorrect,instruction,providedCode,description,subject}) => {
    try {

      const result = await codeCrafterPrompt({
        submittedCode,
        instruction,
        providedCode: providedCodeContent || "",
        description,
        subject,
      });

      setIsCorrect(result?.correct || false);
      setShowIsCorrect(true);
      console.log(result);
    } catch (error) {
      console.error(" CodeCrafter handler error:", error);
      setIsCorrect(false);
      setShowIsCorrect(true);
    }
  },

  CodeRush: async ({submittedCode,setIsCorrect,setShowIsCorrect,instruction,providedCode,description,subject}) => {
    try {
      const result = await codeRushPrompt({
        submittedCode,
        instruction,
        providedCode,
        description,
        subject,
      });

      setIsCorrect(result?.correct || false);
      setShowIsCorrect(true);
      console.log(result);
    } catch (error) {
      console.error("CodeRush handler error:", error);
      setIsCorrect(false);
      setShowIsCorrect(true);
    }
  },

  BrainBytes: async ({ params }) => {
    goToNextStage(params);
  },
};
