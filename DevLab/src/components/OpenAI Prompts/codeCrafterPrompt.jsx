import axios from "axios";
import { auth } from "../../Firebase/Firebase";

import { useGameStore } from "./useBugBustStore";

const codeCrafterPrompt = async ({
  submittedCode,
  instruction,
  providedCode,
  description,
  subject,
}) => {
  if (!submittedCode) return null;

  const setLoading = useGameStore.getState().setLoading;
  const { setSubmittedCode } = useGameStore.getState();
  const { setIsCorrect } = useGameStore.getState();

  setLoading(true);
  try {
    const currentUser = auth.currentUser;
    const token = await currentUser?.getIdToken(true);

    const res = await axios.post(
      `http://localhost:8082/openAI/codeCrafter`,
      {
        submittedCode,
        instruction,
        providedCode,
        description,
        subject,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let raw = res.data.response;

    // Clean response if wrapped in ```json ... ```
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
    console.error("codeCrafterCall API failed:", error);
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

export default codeCrafterPrompt;
