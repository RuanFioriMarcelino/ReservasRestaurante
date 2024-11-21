import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../config/firebaseconfig";

interface User {
  id: string;
  name: string;
  surname: string;
  photoURL: string;
  email: string;
  registrationDate: string;
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
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date: string): string => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("pt-BR");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center h-[550px] overflow-y-auto overflow-x-hidden pr-2 pb-4">
      {user.map((item) => (
        <div
          key={item.id}
          className="flex bg-white rounded-lg shadow-sm shadow-neutral-500 h-min"
        >
          <div className="bg-gray-400 rounded-lg w-28 h-28">
            <img
              src={item.photoURL}
              alt="Imagem de usuário"
              className="rounded-s-lg"
            />
          </div>
          <div className="p-2">
            <p className="text-lg font-medium">
              {item.name} {item.surname}
            </p>
            <p className="text-gray-500">{item.email}</p>
            <p className="text-gray-500">
              Data de registro:{" "}
              <span className="underline">
                {formatDate(item.registrationDate)}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
