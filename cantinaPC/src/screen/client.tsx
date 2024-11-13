import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../config/firebaseconfig";

interface User {
  id: string;
  name: string;
  surname: string;
  image: string;
  email: string;
}

export default function Client() {
  const [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    const userCollection = collection(database, "user");

    const unsubscribe = onSnapshot(userCollection, (querySnapshot) => {
      const list: User[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as User);
      });
      setUser(list);
      console.log(list.map((user) => user.name)); // Para verificar nomes no console
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center h-[550px] overflow-y-auto overflow-x-hidden pr-2 pb-4">
      {user.map((item) => (
        <div
          key={item.id}
          className="flex bg-white rounded-lg shadow-sm shadow-neutral-500"
        >
          <div className="bg-gray-400 rounded-lg w-28 h-28">
            <img
              src={item.image}
              alt="Imagem de usuário"
              className="rounded-s-lg"
            />
          </div>
          <div className="p-2">
            <p className="text-lg">
              {item.name} {item.surname}
            </p>
            <p className="text-gray-500">{item.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
