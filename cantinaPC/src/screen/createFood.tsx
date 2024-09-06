import { useState } from "react";
import { addDoc, auth, collection, database } from "../config/firebaseconfig";
import { Input } from "../components/input";

function CreateFood() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [valor, setValor] = useState("");
  const [image, setImage] = useState("");
  const [genre, setGenre] = useState("");

  const addFood = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No user is authenticated");
      }

      const taskCollection = collection(database, "foods");
      await addDoc(taskCollection, {
        name: name,
        description: description,
        valor: valor,
        image: image,
        genre: genre,
      });
    } catch {}
  };
  return (
    <div>
      <form action="" className="w-1/2 gap-3 grid ">
        <h1 className="text-yellow font-bold text-xl uppercase text-center mb-4">
          Cadastrar novo produto
        </h1>
        <Input icon={null}>
          <Input.Field placeholder="Nome" />
        </Input>
        <Input icon={null}>
          <Input.Field placeholder="Descrição" />
        </Input>
        <Input icon={null}>
          <Input.Field placeholder="Valor" />
        </Input>
        <Input icon={null}>
          <select className="flex-1  cursor-pointer ">
            <option className="">Selecione um genêro</option>
            <option value="">Almoço</option>
            <option value="">Marmitex</option>
            <option value="">Bebida</option>
          </select>
        </Input>

        <input
          type="file"
          accept="image/png, image/jpeg"
          className="file:bg-white file:text-yellow fonte file:border-none file:w-full file:h-10 file:rounded-lg file:hover:bg-yellow file:hover:text-white file:font-bold file:transition-all file:ease-in file:duration-75 file:cursor-pointer"
        />
      </form>
    </div>
  );
}

export default CreateFood;
