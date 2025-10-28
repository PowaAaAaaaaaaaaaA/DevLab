import { auth } from "../../../Firebase/Firebase";
import axios from "axios";

export const deleteAllProgress = async (uid) => {
  const token = await auth?.currentUser?.getIdToken(true);
  if (!token) throw new Error("User not authenticated");

  const response = await axios.post(
    `https://devlab-server-railway-production.up.railway.app/fireBaseAdmin/reset`,
    { uid },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("deleteAllProgress response:", response.data);
  return response.data;
};
