import { useState, useContext } from "react";
import { Button } from "../components/buttonLogin";
import { Input } from "../components/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseconfig";
import { useNavigate } from "react-router-dom"; // Novo hook para navegação
import { AuthContext } from "../context/authContext"; // Importando o contexto de autenticação

export default function Signin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext); // Consumindo o contexto de autenticação

  // Garantir que o contexto não seja undefined
  if (!authContext) {
    // Em um caso extremo, podemos lançar um erro ou retornar uma tela de erro
    throw new Error("AuthContext não foi encontrado.");
  }

  const { user } = authContext; // Agora, 'user' não é undefined

  if (user) {
    // Se o usuário já estiver logado, redireciona para a página inicial
    navigate("/", { replace: true });
  }

  const LoginUser = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuário logado:", user);

      localStorage.setItem("IsLoged", "true");
      localStorage.setItem("button", "1");

      window.location.replace("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen items-center justify-center flex bg-black_">
      <div className="bg-zinc-950 flex-col flex gap-8 text-center w-1/4 px-8 py-10 rounded-xl shadow-slate-800 shadow-lg">
        <h1 className="text-white font-bold text-2xl">LOGIN</h1>
        <Input icon={null}>
          <Input.Field
            placeholder="E-MAIL"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </Input>
        <Input icon={null}>
          <Input.Field
            placeholder="SENHA"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            type="password"
          />
        </Input>
        {error && (
          <div className="h-4">
            <p className="text-yellow">Email ou senha inválidos</p>
          </div>
        )}

        <Button
          title={loading ? "CARREGANDO..." : "ENTRAR"}
          onClick={LoginUser}
          disabled={loading}
        />
      </div>
    </div>
  );
}
