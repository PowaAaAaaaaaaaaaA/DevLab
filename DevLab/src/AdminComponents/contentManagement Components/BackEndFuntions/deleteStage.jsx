// src/AdminComponents/contentManagementComponents/BackEndFunctions/deleteStage.jsx
import axios from "axios";
import { auth } from "../../../Firebase/Firebase";

const deleteStage = async ({ category, lessonId, levelId, stageId }) => {
  const token = await auth.currentUser?.getIdToken(true);

  try {
    const res = await axios.post(
      "http://localhost:8082/fireBaseAdmin/deleteStage",
      { category, lessonId, levelId, stageId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error Deleting Stage:", error);
    throw error;
  }
};

export default deleteStage;
