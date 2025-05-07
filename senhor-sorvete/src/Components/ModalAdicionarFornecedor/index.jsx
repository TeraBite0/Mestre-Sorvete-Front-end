import React, { useState } from "react";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";

const ModalAdicionarFornecedor = ({
  open,
  onClose,
  title,
}) => {
    const [novoFornecedor, setNovoFornecedor] = useState('');

    const adicionarNovoFornecedor = async () => {
       if (!novoFornecedor.trim()) {
            toast.error("O nome do fornecedor não pode ser vazio");
            return;
        }

        console.log("Objeto enviado para API:", novoFornecedor.trim());

        const novoFornecedorObj = JSON.parse(JSON.stringify({ nome: novoFornecedor.trim() }));
        console.log("JSON final enviado:", JSON.stringify(novoFornecedorObj));

        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.error("Erro de autenticação");
            return;
        }

        try {
            const response = await fetch('http://10.0.0.25:8080/fornecedores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novoFornecedorObj)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro do servidor:", errorData);
                throw new Error(`Erro ao adicionar fornecedor: ${errorData.message || 'Erro desconhecido'}`);
            }
            
            onClose()
            toast.success("Fornecedor adicionado com sucesso!");
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro ao adicionar fornecedor. Tente novamente.");
        }
    };

  return (
    <Dialog
        open={open}
        onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Nome da Marca"
                fullWidth
                value={novoFornecedor}
                onChange={(e) => setNovoFornecedor(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button className="botaoModal" onClick={onClose}>
                Cancelar
            </Button>
            <Button className="botaoModal" onClick={adicionarNovoFornecedor}>
                Adicionar
            </Button>
        </DialogActions>
    </Dialog>
  );
};

export default ModalAdicionarFornecedor;
