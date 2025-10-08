import axios from "axios";
import { auth } from "../../Firebase/Firebase";

const dbPlaygroundEval = async ({ sql }) => {
  if (!sql) return null;

  try {
    const currentUser = auth.currentUser;
    const token = await currentUser?.getIdToken(true);

    const res = await axios.post(
      `http://localhost:8082/openAI/dbPlayGroundEval`,
      { sql },
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
    console.error("dbPlaygroundEval API call failed:", error);
    return null;
  }
};

export default dbPlaygroundEval;
