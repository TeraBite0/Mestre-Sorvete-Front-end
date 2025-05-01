import React, { useState } from "react";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const ModalAdicionarFornecedor = ({
  open,
  onClose,
  onDeletar,
  title,
  texto,
}) => {

  return (
    <Dialog
        open={open}
        onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <p>{texto}</p>
        </DialogContent>
        <DialogActions>
            <Button className="botaoModal" onClick={onClose}>
                Não
            </Button>
            <Button className="botaoModal" onClick={onDeletar}>
                Sim
            </Button>
        </DialogActions>
    </Dialog>
  );
};

export default ModalAdicionarFornecedor;
