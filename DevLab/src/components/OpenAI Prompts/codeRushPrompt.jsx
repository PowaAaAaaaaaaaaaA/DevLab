import axios from "axios";
import { auth } from "../../Firebase/Firebase";

const codeRushPrompt = async ({submittedCode,instruction,providedCode,description,subject,}) => {
  if (!submittedCode) return null;

  try {
    const currentUser = auth.currentUser;
    const token = await currentUser?.getIdToken(true);

    const res = await axios.post(
      `http://localhost:8082/openAI/codeRushPrompts`,
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
  }
};

export default codeRushPrompt;
