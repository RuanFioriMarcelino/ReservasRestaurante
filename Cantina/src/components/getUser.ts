import { auth, doc, database } from "../config/firebaseconfig";
import { onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

interface Usuario {
  id: string;
  name: string;
  photoURL: string;
  email: string;
  cpf: string;
}

export function useGetUser(): Usuario | null {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Escuta mudanças de autenticação
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId(null);
        setUsuario(null); // Limpa o estado do usuário ao deslogar
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const userDoc = doc(database, "user", userId);

    const unsubscribeFirestore = onSnapshot(userDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as Usuario;
        setUsuario({ ...data, id: docSnapshot.id });
      } else {
        console.log("Usuário não encontrado!");
        setUsuario(null); // Explicitamente define como null se não encontrado
      }
    });

    return () => unsubscribeFirestore();
  }, [userId]);

  return usuario;
}
