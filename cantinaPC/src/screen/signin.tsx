import { useState } from "react";
import { Button } from "../components/buttonLogin";
import { Input } from "../components/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseconfig";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<boolean>();

  const LoginUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
        .then((userCredential) => {
          // Usuário logado
          const user = userCredential.user;
          console.log("Usuário logado:", user);
          localStorage.setItem("IsLoged", "true");
          localStorage.setItem("button", "1");
          window.location.replace("/");
        })
        .catch((error) => {
          console.error("Erro ao logar:", error);
        });

      console.log("Credencial do cusuário: ", userCredential);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError(true);
    }
  };

  return (
    <div className="w-full h-screen items-center justify-center flex bg-black_">
      <div className="bg-slate-800 flex-col flex gap-8 text-center w-1/4 px-8 py-10 rounded-xl  shadow-slate-800 shadow-lg">
        <h1 className="text-white font-bold text-2xl">LOGIN</h1>
        <Input icon={null}>
          <Input.Field
            placeholder="E-MAIL"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          ></Input.Field>
        </Input>
        <Input icon={null}>
          <Input.Field
            placeholder="SENHA"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          ></Input.Field>
        </Input>
        {error ? (
          <div className="h-4">
            <p className="text-yellow">Email ou senha inválidos</p>
          </div>
        ) : (
          <div className="h-4"></div>
        )}

        <Button title="ENTRAR" onClick={LoginUser} />
      </div>
    </div>
  );
}
