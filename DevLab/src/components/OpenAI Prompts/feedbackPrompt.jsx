import axios from "axios";
import { auth } from "../../Firebase/Firebase"; 
import { useGameStore } from "./useBugBustStore";

export const fetchLevelSummary = async () => {
  const feedbackList = useGameStore.getState().stageFeedbacks;
  const feedbackArray = Object.values(feedbackList).flat();

  if (!feedbackArray || feedbackArray.length === 0) {
    console.log("No stage feedback to summarize.");
    return null;
  }

  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No authenticated user found.");
      return null;
    }
    const token = await currentUser.getIdToken(true);

    console.log("stageFeedbacks before sending:", feedbackArray);

    const response = await axios.post(
      "http://localhost:8082/openAI/feedbackPrompts",
      { stageFeedbacks: feedbackArray },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Level Summary:", response.data.response);
    return response.data.response;
  } catch (error) {
    if (error.response) {
      console.error("Backend responded with error:", error.response.data);
    } else if (error.request) {
      console.error("No response from backend. Request:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return null;
  }
};
