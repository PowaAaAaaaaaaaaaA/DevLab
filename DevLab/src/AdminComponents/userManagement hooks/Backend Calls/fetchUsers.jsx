import axios from "axios";
import { auth } from "../../../Firebase/Firebase";

const fetchUsers = async () => {
  const token = await auth.currentUser?.getIdToken(true);
  try {
    const res = await axios.get(
      "http://localhost:8082/fireBaseAdmin/getUsers",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Response data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error;
  }
};


export default fetchUsers;
