import { auth, doc, database } from "../config/firebaseconfig";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

interface Usuario {
  id: string;
  name: string;
  photoURL: string;
  email:string
  cpf:string
}

export function useGetUser(): Usuario | null {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const user = auth.currentUser?.uid;

  useEffect(() => {
    if (!user) return;

    const userDoc = doc(database, "user", user);

    const unsubscribe = onSnapshot(userDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as Usuario;
        setUsuario({ ...data, id: docSnapshot.id });
      } else {
        console.log("Usuário não encontrado!");
        setUsuario(null); // Explicitamente define como null se não encontrado
      }
    });

    return () => unsubscribe();
  }, [user]);

  return usuario;
}