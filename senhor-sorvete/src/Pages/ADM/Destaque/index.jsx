import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import "./destaque.css";
import TableContainer from "@mui/material/TableContainer";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from "../../../Components/BotaoVoltarGerenciamento";
import { toast } from "react-toastify";
import axios from "axios";
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";

const Destaque = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtosInicio, setProdutosInicio] = useState([]);
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [produtoRecomendado, setProdutoRecomendado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [valor, setValor] = useState('');

  // Função para buscar o produto recomendado
  const fetchProdutoRecomendado = async (token) => {
    try {
      const response = await axios.get('http://10.0.0.25:8080/produtos/destaque', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data) {
        const produtoFormatado = {
          id: response.data.id,
          nome: response.data.produto.nome || "Nome não informado",
          preco: response.data.produto.preco || 0,
          marca: response.data.produto.marca || { nome: "Marca não informada" },
          texto: response.data.texto || ""
        };
        setProdutos([produtoFormatado]);
        setProdutosInicio([produtoFormatado]);
        setProdutoRecomendado(produtoFormatado);
      }
    } catch (error) {
      console.error("Erro ao buscar produto recomendado:", error);
      setErro("Erro ao carregar produto recomendado.");
      toast.error("Erro ao carregar produto recomendado.");
    }
  };

  // Função para buscar todos os produtos
  const fetchTodosProdutos = async (token) => {
    try {
      const response = await axios.get('http://10.0.0.25:8080/produtos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const produtosFormatados = response.data.map((produto) => ({
        id: produto.id,
        nome: produto.nome || "Nome não informado",
        preco: produto.preco || 0,
        marca: produto.marca || { nome: "Marca não informada" },
        subtipo: produto.subtipo,
        isAtivo: produto.isAtivo,
        emEstoque: produto.emEstoque,
      }));

      setTodosProdutos(produtosFormatados);
    } catch (error) {
      console.error("Erro ao buscar todos os produtos:", error);
      setErro("Erro ao carregar lista de produtos.");
      toast.error("Erro ao carregar lista de produtos.");
    }
  };

  // Efeito para carregar dados iniciais
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setErro("Token não encontrado");
      return;
    }

    setIsLoading(true);

    Promise.all([
      fetchProdutoRecomendado(token),
      fetchTodosProdutos(token),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleEditClick = (produto) => {
    setProdutoRecomendado(produto);
    setModalOpen(true);
  };

  const handleChange = (event) => {
    setValor(event.target.value);
  };

  const atualizarProduto = async () => {
    if (produtoRecomendado.id == null) {
      toast.error("Nenhum produto selecionado.");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Token não encontrado");
      return;
    }

    try {
      const response = await fetch(`http://10.0.0.25:8080/produtos/destaque`, {
          method: "PUT",
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            produtoId: produtoRecomendado.id,
            texto: valor
          })
      });

      if (response.status === 200) {
        toast.success("Produto recomendado atualizado com sucesso!");
        await fetchProdutoRecomendado(token); // Atualiza a lista após sucesso
        setModalOpen(false);
        setValor("");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao atualizar produto recomendado";
      toast.error(errorMessage);
      console.error("Erro na atualização:", error);
    }
  };

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

    useEffect(() => {
      setSelectedProduto(produtoAtual);
    }, [produtoAtual]);

    const handleChangeProduto = (event) => {
      const produtoSelecionado = todosProdutos.find(
        (produto) => produto.id === parseInt(event.target.value)
      );
      setSelectedProduto(produtoSelecionado);
    };

    const handleSave = () => {
      if (selectedProduto) {
        setProdutoRecomendado(selectedProduto);
        setProdutosInicio([selectedProduto]);
        setModalOpen(false);
      } else {
        toast.error("Selecione um produto");
      }
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Editar Destaque do Dia</DialogTitle>
        <DialogContent>
          <TextField
            select
            value={selectedProduto?.id || ""}
            onChange={handleChangeProduto}
            fullWidth
            margin="dense"
            label="Selecione um produto"
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Selecione um produto</option>
            {todosProdutos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {`${produto.nome} - ${produto.marca
                  } (R$ ${produto.preco?.toFixed(2)})`}
              </option>
            ))}
          </TextField>
          <Button
            className="botaoModal"
            onClick={handleSave}
            variant="contained"
            fullWidth
            disabled={!selectedProduto}
            style={{ marginTop: "10px" }}
          >
            Atualizar Destaque
          </Button>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <HeaderGerenciamento />

      <div className="botao-voltar-destaque">
        <BotaoVoltarGerenciamento />
      </div>

      <div className="tabela-produtos-destaque">
        {erro ? (
          <p style={{ color: "red" }}>{erro}</p>
        ) : (
          <TableContainer
            component={Paper}
            className="container-tabela-destaque"
          >
            <Table
              sx={{
                width: "100%",
                "& .MuiTableCell-root": {
                  width: "25%",
                  textAlign: "center",
                },
                "& .MuiTableCell-root:last-child": {
                  width: "5%", // Ajusta a largura da última coluna (Editar)
                },
              }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell className="tabela-head-destaque">
                    Nome
                  </TableCell>
                  <TableCell className="tabela-head-destaque">
                    Marca
                  </TableCell>
                  <TableCell className="tabela-head-destaque">
                    Preço
                  </TableCell>
                  <TableCell className="tabela-head-destaque">
                    Editar
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: "center" }}>
                      Carregando produtos recomendados...
                    </TableCell>
                  </TableRow>
                ) : produtos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: "center" }}>
                      Nenhum produto recomendado encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  produtosInicio.map((produto) => (
                    <TableRow key={produto.id} className="tabela-row">
                      <TableCell className="tabela-cell-content">
                        {produto.nome}
                      </TableCell>
                      <TableCell className="tabela-cell-content">
                        {produto.marca || "N/A"}
                      </TableCell>
                      <TableCell className="tabela-cell-content">
                        {typeof produto.preco === "number"
                          ? produto.preco.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                          : "R$ 0,00"}
                      </TableCell>
                      <TableCell className="tabela-cell">
                        <button
                          onClick={() => handleEditClick(produto)}
                          className="edit-button"
                        >
                          <EditIcon />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

        )}

        <div class="informativo-descricao-destaque-do-dia">
          <h3>Descrição Atual: </h3>
          <h3>Nova Descrição: </h3>
        </div>
        <div className="campo-texto-destaque-do-dia">
          <textarea 
            class="input-texto-destaque-do-dia" 
            type="text" 
            readOnly="true" 
            disabled="true"
            placeholder="Descrição atual sobre o produto, para sugestão do dia..." 
            value={produtos.map((produto) => (produto.texto))}  />
          <textarea 
            class="input-texto-destaque-do-dia" 
            type="text" 
            value={valor}  // Vincula o valor do input ao estado
            onChange={handleChange}
            placeholder="Coloque uma descrição sobre o produto, para sugestão do dia..." />
        </div>
          <BotaoGerenciamento botao="Atualizar Sugestão" onClick={atualizarProduto}/>  
      </div>

      <ModalEditarProduto
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        todosProdutos={todosProdutos}
        produtoAtual={produtoRecomendado}
        onSave={atualizarProduto}
      />
    </>
  );
};

export default Destaque;
