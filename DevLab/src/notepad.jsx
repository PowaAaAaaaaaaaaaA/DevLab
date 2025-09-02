import { getAuth } from "firebase/auth";


useEffect(() => {
    const fetchPing = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        return null;
    }
    const token = await user.getIdToken(true);
    console.log("Token being sent:", token);
    try {
            console.log("sadas")
const response = await fetch("http://127.0.0.1:5174/openAI/evaluate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ prompt: "Do you know iyot puno saging" }),
});
 // replace with your server URL
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching ping:", error);
    }
    };

    fetchPing();
}, []);