import { useState } from "react";
import {
  addDoc,
  auth,
  collection,
  database,
  storage,
} from "../config/firebaseconfig";
import { Input } from "../components/input";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function CreateFood() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [imgURL, setImgURL] = useState<string>("");
  const [progress, setProgress] = useState(0);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDescription(e.target.value);
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValor(e.target.value);
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setGenre(e.target.value);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const storageRef = ref(storage, `images/foods/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setImgURL(url);
          });
        }
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imgURL) {
      alert("Por favor, aguarde até que a imagem seja carregada.");
      return;
    }
    await addFood();
  };

  const addFood = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No user is authenticated");
      }

      const taskCollection = collection(database, "foods");
      await addDoc(taskCollection, {
        name,
        description,
        valor,
        genre,
        imgURL,
      });
      console.log("Produto cadastrado com sucesso");
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <div className="flex justify-around">
      <form onSubmit={handleSubmit} className="w-1/2 gap-3 grid">
        <h1 className="text-yellow font-bold text-xl uppercase text-center mb-4">
          Cadastrar novo produto
        </h1>
        <Input icon={null}>
          <Input.Field placeholder="Nome" onChange={handleNameChange} />
        </Input>
        <Input icon={null}>
          <Input.Field
            placeholder="Descrição"
            onChange={handleDescriptionChange}
          />
        </Input>
        <Input icon={null}>
          <Input.Field placeholder="Valor" onChange={handleValorChange} />
        </Input>
        <Input icon={null}>
          <select
            className="flex-1 cursor-pointer"
            value={genre}
            onChange={handleGenreChange}
          >
            <option value="">Selecione um gênero</option>
            <option value="almoco">Almoço</option>
            <option value="marmitex">Marmitex</option>
            <option value="bebida">Bebida</option>
          </select>
        </Input>

        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
          className="file:bg-white file:text-yellow fonte file:border-none file:w-full file:h-10 file:rounded-lg file:hover:bg-yellow file:hover:text-white file:font-bold file:transition-all file:ease-in file:duration-75 file:cursor-pointer"
        />
        {!imgURL && <progress className="w-full " value={progress} max="100" />}

        <button type="submit" title="Cadastrar">
          GRAVAR
        </button>
      </form>
      <div className="items-center justify-center flex-1 max-h-80 max-w-80 rounded-lg border-4 border-yellow">
        {imgURL && (
          <img className="w-full  rounded-sm " src={imgURL} alt="Imagem" />
        )}
      </div>
    </div>
  );
}

export default CreateFood;
