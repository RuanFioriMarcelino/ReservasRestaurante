import * as React from "react";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import CreateFood from "../screen/createFood";

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

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button
        className="text-white uppercase font-regular bg-yellow p-2 rounded-lg hover:bg-black_ hover:text-yellow transition-all duration-75 ease-in"
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
          <CreateFood />
        </Box>
      </Modal>
    </div>
  );
}
