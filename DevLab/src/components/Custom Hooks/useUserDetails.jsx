import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/Firebase";
import { useQuery } from "@tanstack/react-query";

// Use Hook for UserDetails

export default function useUserDetails() {

  const fetchUserData = () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        unsubscribe(); 

        if (user) {
          const getUser = doc(db, "Users", user.uid);
          const userDocs = await getDoc(getUser);

          if (userDocs.exists()) {
            resolve(userDocs.data()); 
          } 
        } 
      });
    });
  };


  const { data: Userdata, isLoading } = useQuery({
    queryKey: ["User_Details"],
    queryFn: fetchUserData,
  });

  return { Userdata, isLoading };
}

