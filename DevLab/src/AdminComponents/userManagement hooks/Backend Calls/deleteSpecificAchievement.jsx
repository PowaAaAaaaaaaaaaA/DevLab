import { auth } from "../../../Firebase/Firebase";
import axios from "axios";

export const deleteSpecificAchievement = async ({ category, uid }) => {
  try {
    const token = await auth.currentUser?.getIdToken(true);
    const response = await axios.delete(`
https://devlab-server-railway-production.up.railway.app/fireBaseAdmin/deleteAchievement`, {
      data: {
        category: category,
        uid: uid,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // return backend response
  } catch (error) {
    console.error("Error deleting achievement:", error);
    throw error; // rethrow so React Query or caller can handle it
  }
};
