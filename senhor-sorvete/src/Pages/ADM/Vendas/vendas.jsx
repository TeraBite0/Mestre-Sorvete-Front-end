import { useEffect, useState } from "react";
import axios from "axios";
import "./vendas.css";
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from "../../../Components/BotaoVoltarGerenciamento";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";

const Vendas = () => {
  const [rows, setRows] = useState([]);
  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [novasVendas, setNovasVendas] = useState([
    {
      produtoId: "",
      quantidade: 1,
      precoUnitario: 0,
      precoTotal: 0,
    },
  ]);
  const [precoTotal, setPrecoTotal] = useState(0);
  const [openBuscar, setOpenBuscar] = useState(false);
  const [dataBusca, setDataBusca] = useState("");
  const [resultadoBusca, setResultadoBusca] = useState(null);
  const [vendasDoDia, setVendasDoDia] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);

  const agruparVendasPorData = (vendas) => {
    return vendas
      .reduce((acc, venda) => {
        const dataCompra = venda.dataCompra
          ? new Date(venda.dataCompra).toLocaleDateString("pt-BR")
          : "Data não disponível";

        const vendaExistente = acc.find(
          (v) =>
            new Date(v.dataCompra).toLocaleDateString("pt-BR") === dataCompra
        );

        if (vendaExistente) {
          return acc.map((v) => {
            if (
              new Date(v.dataCompra).toLocaleDateString("pt-BR") === dataCompra
            ) {
              return {
                ...v,
                produtos: [...v.produtos, ...venda.produtos],
              };
            }
            return v;
          });
        }

        return [...acc, venda];
      }, [])
      .sort((a, b) => new Date(b.dataCompra) - new Date(a.dataCompra));
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      toast.error("Token não encontrado. Faça login novamente.");
      return;
    }

    axios
      .get("http://localhost:8080/saidas-estoque", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if(response.data.length != 0){
          const vendasAgrupadas = agruparVendasPorData(response.data);
          setRows(vendasAgrupadas);
        }
      })
      .catch((error) => {
        console.error("Error loading vendas:", error);
        toast.error("Erro ao carregar vendas.");
      });
  }, []);

  const handleOpenAdicionar = async () => {
    setIsLoadingProdutos(true);
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:8080/produtos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProdutosDisponiveis(response.data);
      setOpenAdicionar(true);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar lista de produtos.");
    } finally {
      setIsLoadingProdutos(false);
    }
  };

  const handleOpenBuscar = () => setOpenBuscar(true);

  // const calcularPrecoTotal = (produtos) => {
  //   return produtos.reduce(
  //     (total, item) => total + item.produto.preco * item.qtdVendida,
  //     0
  //   );
  // };

  const handleChangeNovaVenda = (index, field, value) => {
    setNovasVendas((prevVendas) => {
      const updatedVendas = [...prevVendas];
      const venda = { ...updatedVendas[index] };

      if (field === "produtoId") {
        const produtoSelecionado = produtosDisponiveis.find(
          (p) => p.id === parseInt(value)
        );
        if (produtoSelecionado) {
          venda.produtoId = parseInt(value);
          venda.precoUnitario = produtoSelecionado.preco;
          venda.precoTotal = produtoSelecionado.preco * venda.quantidade;
        }
      } else if (field === "quantidade") {
        const quantidade = parseInt(value) || 0;
        venda.quantidade = quantidade;
        venda.precoTotal = venda.precoUnitario * quantidade;
      }

      updatedVendas[index] = venda;

      // Atualizar o preço total
      const novoPrecoTotal = updatedVendas.reduce(
        (total, v) => total + (v.precoTotal || 0),
        0
      );
      setPrecoTotal(novoPrecoTotal);

      return updatedVendas;
    });
  };

  const handleAdicionarCampo = () => {
    setNovasVendas((prev) => [
      ...prev,
      {
        produtoId: "",
        quantidade: 1,
        precoUnitario: 0,
        precoTotal: 0,
      },
    ]);
  };

  const handleCloseAdicionar = () => {
    setOpenAdicionar(false);
    setNovasVendas([
      {
        produtoId: "",
        quantidade: 1,
        precoUnitario: 0,
        precoTotal: 0,
      },
    ]);
    setPrecoTotal(0);
  };

  const handleConfirmarSaida = async (novasVendas) => {
    debugger
    const token = sessionStorage.getItem('token');

    if (!token) {
      toast.error("Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      const saida = []

      novasVendas.map((venda) => {
        const dadosProduto = 
          {
            produtoId: venda.produtoId,
            qtdCaixasSaida: venda.quantidade,
          }

        saida.push(dadosProduto);
      })

      const saidaEstoque = {
        dtSaida: dataBusca,
        saidaEstoques: saida,
      };

      const response = await axios.post("http://localhost:8080/saidas-estoque", saidaEstoque, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      setOpenAdicionar(false);
      window.location.reload();

      // if (response.data.length === 0) {
      //   setResultadoBusca("Nenhuma venda encontrada nesta data.");
      //   setVendasDoDia([]);
      // } else {
      //   console.log("Dados da venda:", response.data); 
      //   setVendasDoDia(response.data);
      //   setResultadoBusca("Vendas encontradas!");
      // }
    } catch (error) {
      console.error("Erro ao buscar venda:", error.response || error.message);
      toast.error("Erro ao buscar venda.");
      setVendasDoDia([]);
      setResultadoBusca("Erro ao buscar vendas.");
    }
  };

  const handleSubmitBuscar = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      toast.error("Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      const dataFormatada = dataBusca;
      const response = await axios.get("http://localhost:8080/vendas/data", {
        params: { data: dataFormatada },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.data.length === 0) {
        setResultadoBusca("Nenhuma venda encontrada nesta data.");
        setVendasDoDia([]);
      } else {
        console.log("Dados da venda:", response.data); // Para debug
        setVendasDoDia(response.data);
        setResultadoBusca("Vendas encontradas!");
      }
    } catch (error) {
      console.error("Erro ao buscar venda:", error.response || error.message);
      toast.error("Erro ao buscar venda.");
      setVendasDoDia([]);
      setResultadoBusca("Erro ao buscar vendas.");
    }
  };

  const handleCloseBuscar = () => {
    setOpenBuscar(false);
    setDataBusca("");
    setResultadoBusca(null);
    setVendasDoDia([]);
  }

  const subtotal = 20*4

  return (
    <div className="container-vendas">
      <HeaderGerenciamento />

      <div className="botao-voltar-vendas">
        <BotaoVoltarGerenciamento />
      </div>
      <div className="container-informacoes">
        <h1>Vendas</h1>
        <div className="container-botoes">
          <BotaoGerenciamento botao="Buscar" onClick={handleOpenBuscar} />
          <BotaoGerenciamento
            botao="+ Nova Venda"
            onClick={handleOpenAdicionar}
          />
        </div>
      </div>

      <div className="tabela-vendas">
        <TableContainer component={Paper}
          className="tabela-container"
          sx={{
            maxHeight: '80vh',  // altura máxima
            overflow: 'auto'
          }}
        >
          <Table
            sx={{
              width: '100%',
              '& .MuiTableCell-root': {
                padding: '8px', // Reduz o padding das células
              },
              '& .MuiTableCell-root:last-child': {
                width: '60px', // Ajusta a largura da última coluna (Editar)
              }
            }}
            size="small"
            aria-label="tabela de vendas"
          >
          </Table>
          <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
            <TableHead className="tabela-Head">
              <TableRow>
                <TableCell className="tabela-Head">Data da Compra</TableCell>
                <TableCell className="tabela-Head">Produtos</TableCell>
                <TableCell className="tabela-Head">Qtd de Caixas Saídas</TableCell>
                <TableCell className="tabela-Head">Subtotal</TableCell>
                <TableCell className="tabela-Head" align="right">Valor Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .filter((row) => row.saidaEstoques?.length > 0)
                .map((row, rowIndex) => (
                  row.saidaEstoques.map((item, index) => (
                    <TableRow
                      key={`${rowIndex}-${index}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row"> {row.dtSaida} </TableCell>
                      <TableCell className="tabela-row-vendas">{item.produto.nome}</TableCell>
                      <TableCell className="tabela-row-vendas">{item.qtdCaixasSaida}</TableCell>
                      <TableCell className="tabela-row-vendas">{subtotal} </TableCell>
                      <TableCell className="tabela-row-vendas" align="right">R$ {subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ))
                }
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openAdicionar} onClose={handleCloseAdicionar}>
        <DialogTitle>Adicionar Venda</DialogTitle>
        <DialogContent>
          {isLoadingProdutos ? (
            <div>Carregando produtos...</div>
          ) : (
            <>
            <TextField
                type="date"
                value={dataBusca}
                onChange={(e) => setDataBusca(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {novasVendas.map((venda, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "20px",
                    padding: "10px",
                    border: "1px solid #eee",
                    borderRadius: "4px",
                  }}
                >
                  <TextField
                    select
                    value={venda.produtoId}
                    onChange={(e) =>
                      handleChangeNovaVenda(index, "produtoId", e.target.value)
                    }
                    fullWidth
                    margin="dense"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">Selecione o produto</option>
                    {produtosDisponiveis.map((produto) => (
                      <option key={produto.id} value={produto.id}>
                        {`${produto.nome} - ${produto.marca
                          } (R$ ${produto.preco?.toFixed(2)})`}
                      </option>
                    ))}
                  </TextField>

                  <TextField
                    type="number"
                    label="Qtd de caixas que serão retiradas "
                    value={venda.quantidade}
                    onChange={(e) =>
                      handleChangeNovaVenda(index, "quantidade", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                    inputProps={{
                      min: 1,
                    }}
                  />
                </div>
              ))}

              <Button
                onClick={handleAdicionarCampo}
                style={{ marginTop: "15px" }}
                variant="outlined"
              >
                Adicionar produto
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button className="botaoModal" onClick={handleCloseAdicionar}>
            Cancelar
          </Button>
          <Button
            className="botaoModal"
            onClick={() => handleConfirmarSaida(novasVendas)}  
            disabled={
              isLoadingProdutos ||
              novasVendas.some((v) => !v.produtoId || !v.quantidade)
            }
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBuscar} onClose={handleCloseBuscar}>
        <DialogTitle>Buscar Venda</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            value={dataBusca}
            onChange={(e) => setDataBusca(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          {resultadoBusca && (
            <div>
              <p>{resultadoBusca}</p>
              {vendasDoDia.length > 0 && (
                <div>
                  {vendasDoDia.map((venda) => {

                    return (
                      <div key={venda.id} className="mb-4 border-b pb-2">
                        <h3>Venda #{venda.id}</h3>
                        <div>
                          <strong>Produtos:</strong>
                          <ul>
                            {venda.produtos?.map((item, index) => (
                              <li key={index}>
                                {item.produto?.nome} - {item.qtdVendida} unidades
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button className="botaoModal" onClick={handleCloseBuscar}>Fechar</Button>
          <Button className="botaoModal" onClick={handleSubmitBuscar}>Buscar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Vendas;
