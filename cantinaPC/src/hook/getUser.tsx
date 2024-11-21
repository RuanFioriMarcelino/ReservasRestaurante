import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, database } from "../config/firebaseconfig";

const useUserProfile = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userID = user.uid;

        const userDoc = doc(database, "user", userID);

        const unsubscribeFirestore = onSnapshot(userDoc, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUserName(userData.name);
          } else {
            console.log("Usuário não encontrado");
            setUserName(null);
          }
          setIsLoading(false);
        });

        return () => unsubscribeFirestore();
      } else {
        console.log("Usuário não está autenticado");
        setUserName(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { userName, isLoading };
};

export default useUserProfile;
