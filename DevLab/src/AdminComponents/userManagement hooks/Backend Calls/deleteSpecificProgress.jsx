import { auth } from "../../../Firebase/Firebase";
import axios from "axios";


export const deleteSpecificProgress = async (uid, subject) => {
  const token = await auth?.currentUser?.getIdToken(true);

  if (!token) throw new Error("User not authenticated");

  const response = await axios.post(
    `http://localhost:8082/fireBaseAdmin/progress/reset`,
    { uid, subject },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(response.data, "deleteSpecificProgress");
  return response.data;
};
