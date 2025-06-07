import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalEditarProduto = ({
  open,
  onClose,
  produtoAtual,
  idLote,
}) => {
  const [observacao, setObservacao] = useState("");
  const [selectedProduto, setSelectedProduto] = useState(
    produtoAtual || null
  );
  const [status] = useState([
    { id: 1, nome: "Aguardando entrega", status: "AGUARDANDO_ENTREGA" },
    { id: 2, nome: "Entregue", status: "ENTREGUE" },
    { id: 3, nome: "Cancelado", status: "CANCELADO" },
    { id: 4, nome: "Entregue com pendência", status: "ENTREGUE_COM_PENDENCIA" },
    { id: 5, nome: "Concluído com pendência", status: "CONCLUIDO_COM_PENDENCIA" }
  ]);

  useEffect(() => {
    setSelectedProduto(produtoAtual);
  }, [produtoAtual]);

  const handleAtualizarStatus = async () => {
    const token = sessionStorage.getItem("token");

    const corpoParaAtualizarStatus = {
      status: selectedProduto?.status || "",
      observacao: observacao || "",
    };
    debugger
    try {
      await axios.patch(
        `http://54.243.180.4:80/api/lotes/${idLote}`,
        corpoParaAtualizarStatus,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar status do lote produtos:", error);
      toast.error(error.response?.data?.mensagem || "Erro ao atualizar status do lote.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="tituloModal">
        {"Editar Status do Lote"}
      </DialogTitle>
      <DialogContent>
        <Autocomplete
          autoFocus
          fullWidth
          options={status}
          value={status.find((s) => s.id === selectedProduto?.id) || null}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedProduto(newValue);
            } else {
              setSelectedProduto(null);
            }
          }}
          getOptionLabel={(option) => option.nome || ''}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="dense"
              label="Selecione um Status do Lote"
              fullWidth
            />
          )}
        />

        <TextField
          margin="dense"
          name="observacao"
          value={observacao}
          onChange={event => setObservacao(event.target.value)}
          label="Observação"
          type="text"
          fullWidth
        />

      </DialogContent>
      <DialogActions>
        <Button
          className="botaoModal"
          onClick={onClose}
          variant="contained"
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          Cancelar
        </Button>

        <Button
          className="botaoModal"
          onClick={handleAtualizarStatus}
          variant="contained"
          disabled={!selectedProduto}
          style={{ marginTop: "10px" }}
        >
          Atualizar Status
        </Button>


      </DialogActions>
    </Dialog>
  );
};

export default ModalEditarProduto;