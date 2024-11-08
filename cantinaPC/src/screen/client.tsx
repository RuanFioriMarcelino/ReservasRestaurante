import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../config/firebaseconfig";

interface User {
  id: string;
  name: string;
}

export default function Client() {
  const [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    const productCollection = collection(database, "user");

    const unsubscribe = onSnapshot(productCollection, (query) => {
      const list: User[] = [];
      query.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as User);
      });
      setUser(list);
      console.log(list.map((list) => list.name));
    });

    return () => unsubscribe();
  }, []);
  return <div>{user.map((item) => item.name)}</div>;
}
