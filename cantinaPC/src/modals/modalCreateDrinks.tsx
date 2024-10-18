import * as React from "react";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import { useState } from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Input } from "../components/input";
import ProgressBar from "../components/progressBar";

const auth = getAuth();
const database = getFirestore();
const storage = getStorage();

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "8px",
  p: 4,
};

export default function ModalCreateDrinks() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [imgURL, setImgURL] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const testData = [{ bgcolor: "#6a1b9a", completed: progress }];

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
    await addProduct();
  };

  const addProduct = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No user is authenticated");
      }

      const taskCollection = collection(database, "products");
      await addDoc(taskCollection, {
        name: name,
        description: description,
        value: value,
        genre: genre,
        imgURL: imgURL,
        category: "drink",
      });
      /*      handleClose();
      setProgress(0);
      setGenre("");
      setImgURL("");
      alert("Produto cadastrado com sucesso"); */
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };
  return (
    <div>
      <button
        className="text-white uppercase font-regular bg-yellow p-2 rounded-lg hover:bg-white hover:text-yellow transition-all duration-75 ease-in"
        onClick={handleOpen}
      >
        Cadastrar
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-around">
            <form onSubmit={handleSubmit} className="w-1/2 gap-3 grid">
              <h1 className="text-yellow font-bold text-xl uppercase text-center mb-4">
                Cadastrar nova Bebida
              </h1>
              <Input icon={null}>
                <Input.Field
                  placeholder="Nome"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                />
              </Input>
              <Input icon={null}>
                <Input.Field
                  placeholder="Descrição"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDescription(e.target.value)
                  }
                />
              </Input>
              <Input icon={null}>
                <Input.Field
                  placeholder="Valor"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue(e.target.value)
                  }
                />
              </Input>
              <Input icon={null}>
                <select
                  className="flex-1 cursor-pointer"
                  value={genre}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setGenre(e.target.value)
                  }
                >
                  <option value="">Selecione um gênero</option>
                  <option value="refrigerante">Refrigerante</option>
                  <option value="agua">Água</option>
                  <option value="suco">Suco</option>
                </select>
              </Input>

              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
                className="file:bg-white file:text-yellow fonte file:border-none file:w-full file:h-10 file:rounded-lg file:hover:bg-yellow file:hover:text-white file:font-bold file:transition-all file:ease-in file:duration-75 file:cursor-pointer"
              />

              <button
                type="submit"
                title="Cadastrar"
                className="bg-yellow py-2 rounded-lg font-bold text-white hover:scale-105 transition-all duration-75"
              >
                GRAVAR
              </button>
            </form>
            <div className="gap-4 h-full flex flex-col">
              <div className="w-80 max-h-80 min-h-52 flex rounded-lg border-4 border-yellow ">
                {imgURL ? (
                  <img
                    className="w-full  rounded-sm "
                    src={imgURL}
                    alt="Imagem"
                  />
                ) : (
                  <h1 className="w-full justify-center items-center flex uppercase font-bold bg-yellow/15">
                    Nenhuma imagem selecionada!
                  </h1>
                )}
              </div>
              <div>
                {!imgURL &&
                  testData.map((item, idx) => (
                    <ProgressBar
                      key={idx}
                      bgcolor={item.bgcolor}
                      completed={item.completed}
                    />
                  ))}
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
