import axios from "axios";
import { auth } from "../../../Firebase/Firebase";

const fetchUsers = async () => {
  const token = await auth.currentUser?.getIdToken(true);

  try {
    const res = await axios.get(`https://api-soyulx5clq-uc.a.run.app/fireBaseAdmin/getUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // this will contain the array of users
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export default fetchUsers;
