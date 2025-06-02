import { Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const ModalEditarProduto = ({
  open,
  onClose,
  todosProdutos,
  produtoAtual,
  onSave,
}) => {
  const [selectedProduto, setSelectedProduto] = useState(
    produtoAtual || null
  );
  const [status, setStatus] = useState([
    { id: 1, nome: "Aguardando entrega" },
    { id: 2, nome: "Entregue" },
    { id: 3, nome: "Cancelado" },
    { id: 4, nome: "Entregue com pendência" },
    { id: 5, nome: "Concluído com pendência" }
  ]);

  useEffect(() => {
    setSelectedProduto(produtoAtual);
  }, [produtoAtual]);

  const handleChangeProduto = (event) => {
    const produtoSelecionado = todosProdutos.find(
      (produto) => produto.id === parseInt(event.target.value)
    );
    setSelectedProduto(produtoSelecionado);
  };

  // const handleSave = () => {
  //   if (selectedProduto) {
  //     setProdutoRecomendado(selectedProduto);
  //     setProdutosInicio([selectedProduto]);
  //     setModalOpen(false);
  //   } else {
  //     toast.error("Selecione um produto");
  //   }
  // };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Status do Lote</DialogTitle>
      <DialogContent>
        <TextField
          select
          value={selectedProduto?.id || ""}
          onChange={handleChangeProduto}
          fullWidth
          margin="dense"
          label="Selecione um Status do Lote"
          SelectProps={{
            native: true,
          }}
        >
          {status.map((s) => (
            <option key={s.id} value={s.id}>
              {`${s.nome}`}
            </option>
          ))}
        </TextField>

        <TextField
            margin="dense"
            name="observacoes"
            label="Observações"
            type="text"
            fullWidth
            // value={novoProduto.qtdPorCaixas}
            // onChange={handleInputChange}
        />
        <Button
          className="botaoModal"
          // onClick={handleSave}
          variant="contained"
          disabled={!selectedProduto}
          style={{ marginTop: "10px" }}
        >
          Atualizar Status
        </Button>

        <Button
          className="botaoModal"
          onClose={onClose}
          variant="contained"
          disabled={!selectedProduto}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          Cancelar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditarProduto;