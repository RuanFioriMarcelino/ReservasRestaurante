import React, { useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import { getAuth, signOut } from "firebase/auth";
import UserProfile from "../hook/getUser";
import useUserProfile from "../hook/getUser";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function logout() {
    await localStorage.removeItem("IsLoged");
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Usuário desconectado!");
        alert("Usuário deconectado!");
        localStorage.removeItem("button");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const { userName, isLoading } = useUserProfile();

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Typography sx={{ minWidth: 100, display: "flex", gap: 1 }}>
          {isLoading
            ? "Carregando..."
            : `Olá ${userName}` || "Usuário não encontrado"}
        </Typography>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {userName ? userName.substr(0, 1) : "?"}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose} className="w-40 gap-2">
          <Avatar />

          {isLoading ? "Carregando..." : userName || "Usuário não encontrado"}
        </MenuItem>
        <Divider />
        <button className="flex-1 w-full" onClick={logout}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </button>
      </Menu>
    </React.Fragment>
  );
}
