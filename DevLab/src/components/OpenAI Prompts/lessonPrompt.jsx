import axios from "axios";
import {auth} from "../../Firebase/Firebase"

const lessonPrompt = async ({ receivedCode, instruction, description }) => {
  if (!receivedCode) return null;

  try {
    const currentUser = auth.currentUser;
    const token = await currentUser?.getIdToken(true);

    const res = await axios.post(
      `http://localhost:8082/openAI/lessonPrompt`,
      {
        html: receivedCode.html || "",
        css: receivedCode.css || "",
        js: receivedCode.js || "",
        instructions: instruction,
        description,
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
    console.error("lessonPrompt API call failed:", error);
    return null;
  }
};

export default lessonPrompt;
