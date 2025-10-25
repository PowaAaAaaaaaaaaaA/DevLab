import axios from "axios";
import { auth } from "../../Firebase/Firebase";
import { useGameStore } from "./useBugBustStore";

const codeRushPrompt = async ({submittedCode,instruction,providedCode,description,subject,}) => {
  if (!submittedCode) return null;
    const setLoading = useGameStore.getState().setLoading;
    const { setSubmittedCode } = useGameStore.getState();
    const { setIsCorrect } = useGameStore.getState();

  setLoading(true);

  try {
    const currentUser = auth.currentUser;
    const token = await currentUser?.getIdToken(true);

    const res = await axios.post(
      `https://api-soyulx5clq-uc.a.run.app/openAI/codeRushPrompts`,
      {submittedCode,instruction,providedCode,description,subject},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let raw = res.data.response;

    // Clean response if wrapped in triple backticks
    if (typeof raw === "string") {
      raw = raw.replace(/```json|```/g, "").trim();
    }

    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse JSON:", e, raw);
    }

    return parsed;
  } catch (error) {
    console.error("codeRushPrompt API call failed:", error);
    return null;
  }finally {
    setLoading(false); // HIDE loader
      setSubmittedCode({
      HTML: "",
      CSS: "",
      JS: "",
      SQL: "",
    });
    setIsCorrect(null);
  }
};

export default codeRushPrompt;
