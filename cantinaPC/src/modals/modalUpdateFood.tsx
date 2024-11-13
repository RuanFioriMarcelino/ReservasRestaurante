import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";

import { Button } from "../components/buttonFood";
import { Pencil } from "lucide-react";
import { Input } from "../components/input";

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

interface Foods {
  name: string;
  description: string;
  value: string;
  genre: string;
  imgURL: string;
}

export default function BasicModal({
  name,
  description,
  value,
  genre,
  imgURL,
}: Foods) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [nameEdit, setNameEdit] = useState(name);
  const [valueEdit, setValueEdit] = useState(value);
  const [descriptionEdit, setDescriptionEdit] = useState(description);
  const [genreEdit, setGenreEdit] = useState<string>(genre);
  const [imgURLEdit, setImgURLEdit] = useState(imgURL);
  const [progress, setProgress] = useState(0);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setGenreEdit(e.target.value);

  return (
    <div>
      <Button button={false} children={<Pencil />} onClick={handleOpen} />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-around">
            <form className="w-1/2 gap-3 grid">
              <h1 className="text-yellow font-bold text-xl uppercase text-center mb-4">
                Editar produto
              </h1>
              <Input icon={null}>
                <Input.Field
                  placeholder="Nome"
                  value={nameEdit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNameEdit(e.target.value)
                  }
                />
              </Input>
              <Input icon={null}>
                <Input.Field
                  placeholder="Descrição"
                  value={descriptionEdit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDescriptionEdit(e.target.value)
                  }
                />
              </Input>
              <Input icon={null}>
                <Input.Field
                  placeholder="Valor"
                  value={valueEdit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValueEdit(e.target.value)
                  }
                />
              </Input>
              <Input icon={null}>
                <select
                  className="flex-1 cursor-pointer"
                  value={genreEdit}
                  onChange={(e) => setGenreEdit(e.target.value)}
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
                className="file:bg-white file:text-yellow fonte file:border-none file:w-full file:h-10 file:rounded-lg file:hover:bg-yellow file:hover:text-white file:font-bold file:transition-all file:ease-in file:duration-75 file:cursor-pointer"
              />
              {!imgURL && (
                <progress className="w-full " value={progress} max="100" />
              )}

              <button type="submit" title="Cadastrar">
                GRAVAR
              </button>
            </form>
            <div className="items-center justify-center flex-1 max-h-80 max-w-80 rounded-lg border-4 border-yellow">
              {imgURL && (
                <img
                  className="w-full  rounded-sm "
                  src={imgURL}
                  alt="Imagem"
                />
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
