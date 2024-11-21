import { createContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../config/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";

interface AuthContextType {
  user: any; // Tipo do usuário Firebase, pode ser ajustado conforme necessário
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null); // Estado do usuário
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Atualiza o estado com o usuário atual
      setLoading(false); // Para de mostrar o carregando
    });

    return () => unsubscribe(); // Limpeza do listener
  }, []);

  if (loading) {
    return <div>Carregando...</div>; // Exibe carregando enquanto verifica o estado de autenticação
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
