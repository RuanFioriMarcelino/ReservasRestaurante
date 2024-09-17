import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";

const UserProfile = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("UID:", user.uid);
        if (!user.displayName) {
          updateProfile(user, {
            displayName: userName,
          })
            .then(() => {
              console.log("Nome do usuário atualizado com sucesso");
              setUserName(user.displayName);
            })
            .catch((error) => {
              console.error("Erro ao atualizar o nome do usuário:", error);
            });
        } else {
          setUserName(user.displayName);
        }

        user.providerData.forEach((profile) => {
          console.log("Sign-in provider: " + profile.providerId);
          console.log("Provider-specific UID: " + profile.uid);
          console.log("Name: " + profile.displayName);
          console.log("Email: " + profile.email);
          setUserName(profile.displayName);
        });
      } else {
        console.log("Nenhum usuário logado");
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div>
      <h1> {userName}</h1>
    </div>
  );
};

export default UserProfile;
