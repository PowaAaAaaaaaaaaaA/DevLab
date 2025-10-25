import axios from "axios";
import {auth} from "../../../Firebase/Firebase"


const deleteLevel = async ({ category, lessonId, levelId }) => {
  const token = await auth.currentUser?.getIdToken(true);

  try {
    const res = await axios.post(
      `https://api-soyulx5clq-uc.a.run.app/fireBaseAdmin/deleteLevel`,
      { category, lessonId, levelId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error deleting level:", error);
    throw error;
  }
};

export default deleteLevel;
