import { auth } from "../../../Firebase/Firebase";
import axios from "axios";

// API call to delete a user
export const deleteUser = async (uid) => {
  const token = await auth.currentUser?.getIdToken(true);

  if (!token) throw new Error("User not authenticated");

  const response = await axios.post(
    `http://localhost:8082/fireBaseAdmin/deleteUser`,
    { uid },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("deleteUser response:", response.data);
  return response.data;
};
