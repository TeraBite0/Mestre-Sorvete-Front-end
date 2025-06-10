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
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Tooltip } from "@mui/material";
import ModalConfirmarDeletar from "../../../Components/ModalConfirmarDeletar"


const Saidas = () => {
  const [rows, setRows] = useState([]);
  const [linha, setLinha] = useState([]);
  const [idProduto, setIdProduto] = useState();
  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [novasSaidas, setNovasSaidas] = useState([
    {
      produtoId: "",
      quantidade: 1,
      precoUnitario: 0,
      precoTotal: 0,
    },
  ]);
  const [abrirConfirmarDeletar, setAbrirConfirmarDeletar] = useState(false);
  const [openBuscar, setOpenBuscar] = useState(false);
  const [dataBusca, setDataBusca] = useState("");
  const [resultadoBusca, setResultadoBusca] = useState(null);
  const [saidasDoDia, setSaidasDoDia] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [editarSaida, setEditarSaida] = useState({
    dtSaida: '',
    saidaEstoque: [
      {
        produto: 0,
        qtdCaixasSaida: 0,
      },
    ],
    index: 0
  });

  const agruparSaidasPorData = (saidas) => {
    return saidas
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
      .get("http://54.80.52.5:80/api/saidas-estoque", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.length !== 0) {
          const saidasAgrupadas = agruparSaidasPorData(response.data);
          setRows(saidasAgrupadas);
        }
      })
      .catch((error) => {
        console.error("Error loading saídas:", error);
        toast.error("Erro ao carregar saídas.");
      });
  }, []);

  const handleOpenAdicionar = async () => {
    setIsLoadingProdutos(true);
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.get("http://54.80.52.5:80/api/produtos", {
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

  const handleChangeEditarSaida = (index, field, value) => {
    setEditarSaida((prevState) => {
      const novaSaidaEstoques = [...prevState.saidaEstoques];
      const item = { ...novaSaidaEstoques[index] };

      if (field === "produtoId") {
        const produtoSelecionado = produtosDisponiveis.find(
          (p) => p.id === parseInt(value)
        );
        if (produtoSelecionado) {
          item.produto = produtoSelecionado;
        }
      } else if (field === "quantidade") {
        const quantidade = parseInt(value) || 0;
        item.qtdCaixasSaida = quantidade;
      }

      novaSaidaEstoques[index] = item;

      return {
        ...prevState,
        saidaEstoques: novaSaidaEstoques,
      };
    });
  };


  const handleChangeNovaSaída = (index, field, value) => {
    setNovasSaidas((prevSaidas) => {
      const updatedSaidas = [...prevSaidas];
      const venda = { ...updatedSaidas[index] };

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

      updatedSaidas[index] = venda;

      return updatedSaidas;
    });
  };

  const handleAdicionarCampo = () => {
    setNovasSaidas((prev) => [
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
    setNovasSaidas([
      {
        produtoId: "",
        quantidade: 1,
        precoUnitario: 0,
        precoTotal: 0,
      },
    ]);
  };

  const handleCloseEditar = () => {
    setOpenEditar(false);
    setNovasSaidas([
      {
        produtoId: "",
        quantidade: 1,
        precoUnitario: 0,
        precoTotal: 0,
      },
    ]);
  };

  const handleConfirmarSaida = async (novasSaidas) => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      toast.error("Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      const saida = []

      novasSaidas.forEach((venda) => {
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

      await axios.post("http://54.80.52.5:80/api/saidas-estoque", saidaEstoque, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setOpenAdicionar(false);
      window.location.reload();

    } catch (error) {
      console.error("Erro ao buscar venda:", error.response || error.message);
      toast.error("Erro ao buscar venda.");
      setSaidasDoDia([]);
      setResultadoBusca("Erro ao buscar saídas.");
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
      const response = await axios.get("http://54.80.52.5:80/api/saidas-estoque/data", {
        params: { data: dataFormatada },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.data.length === 0) {
        setResultadoBusca("Nenhuma venda encontrada nesta data.");
        setSaidasDoDia([]);
      } else {
        console.log("Dados da venda:", response.data); // Para debug
        setSaidasDoDia(response.data);
        setResultadoBusca("Saidas encontradas!");
      }
    } catch (error) {
      console.error("Erro ao buscar venda:", error.response || error.message);
      toast.error("Erro ao buscar venda.");
      setSaidasDoDia([]);
      setResultadoBusca("Erro ao buscar saídas.");
    }
  };

  const handleCloseBuscar = () => {
    setOpenBuscar(false);
    setDataBusca("");
    setResultadoBusca(null);
    setSaidasDoDia([]);
  }

  const handleConfirmarEdicaoSaida = async (editarSaida) => {
    const token = sessionStorage.getItem("token");

    const saidaEditada = {
      id: editarSaida.saidaEstoques[0].id,
      produtoId: editarSaida.saidaEstoques[0].produto.id,
      qtdCaixasSaida: editarSaida.saidaEstoques[0].qtdCaixasSaida
    }

    try {
      await axios.put(`http://54.80.52.5:80/api/saidas-estoque/${saidaEditada.id}`, saidaEditada, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpenAdicionar(false);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar lista de produtos.");
    } finally {
      setIsLoadingProdutos(false);
    }
    console.log(editarSaida)

    setOpenEditar(false)
  }

  const encontrarEstoquePorId = (item, id) => {
    return item.saidaEstoques?.find((s) => s.id === id);
  };

  const handleEditar = async (item, id) => {
    const dadosEstoque = encontrarEstoquePorId(item, id)

    setEditarSaida({
      dtSaida: item.dtSaida,
      saidaEstoques: dadosEstoque ? [dadosEstoque] : []
    });
    console.log(editarSaida)
    setIsLoadingProdutos(true);
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.get("http://54.80.52.5:80/api/produtos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProdutosDisponiveis(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar lista de produtos.");
    } finally {
      setIsLoadingProdutos(false);
    }

    setOpenEditar(true)
  }

  const handleDeletar = async () => {
    const token = sessionStorage.getItem("token");
    const dadosEstoque = encontrarEstoquePorId(linha, idProduto)

    const produto = {
      id: dadosEstoque.id,
      produtoId: dadosEstoque.produto.id,
      qtdCaixasSaida: dadosEstoque.qtdCaixasSaida,
    }

    const saidaEstoque = {
      dtSaida: linha.dtSaida,
      saidaEstoques: produto ? [produto] : []
    };

    try {
      await axios.delete("http://54.80.52.5:80/api/saidas-estoque", {
        data: saidaEstoque, // o body da requisição
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // setProdutosDisponiveis(response.data);

      setOpenAdicionar(false);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar lista de produtos.");
    } finally {
      setIsLoadingProdutos(false);
    }
  };

  const handleChangeEditarQtdCaixaSaida = (index, campo, valor) => {
    const saidasAtualizadas = [...editarSaida.saidaEstoques];
    saidasAtualizadas[index][campo] = valor;

    setEditarSaida({
      ...editarSaida,
      saidaEstoques: saidasAtualizadas,
    });
  };

  const abrirModalConfirmarDeletar = (row, id) => {
    setLinha(row)
    setIdProduto(id)
    setAbrirConfirmarDeletar(true);
  }
  const fecharModalConfirmarDeletar = () => setAbrirConfirmarDeletar(false);

  return (
    <div className="container-saidas">
      <div className="header-tabela">
        <HeaderGerenciamento />
      </div>

      <div className="botao-voltar-saidas">
        <BotaoVoltarGerenciamento />
      </div>
      <div className="container-informacoes">
        <h1>Saídas</h1>
        <div className="container-botoes">
          <BotaoGerenciamento botao="Buscar" onClick={handleOpenBuscar} />
          <BotaoGerenciamento
            botao="+ Nova Saída"
            onClick={handleOpenAdicionar}
          />
        </div>
      </div>

      <div className="tabela-saidas">
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
            aria-label="tabela de saídas"
          >
          </Table>
          <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
            <TableHead className="tabela-Head">
              <TableRow>
                <TableCell className="tabela-Head">Data da Compra</TableCell>
                <TableCell className="tabela-Head">Produtos</TableCell>
                <TableCell className="tabela-Head">Qtd de Caixas Saídas</TableCell>
                <TableCell className="tabela-Head">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={`tabela-row-saidas`}>
              {rows
                .filter((row) => row.saidaEstoques?.length > 0)
                .map((row, rowIndex) => (
                  row.saidaEstoques.map((item, index) => (
                    <TableRow
                      key={`${rowIndex}-${index}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row"> {row.dtSaida} </TableCell>
                      <TableCell className="tabela-row-saidas">{item.produto.nome}</TableCell>
                      <TableCell className="tabela-row-saidas">{item.qtdCaixasSaida}</TableCell>
                      <TableCell className="tabela-row-saidas">
                        <Tooltip
                          title="Editar saída"
                          placement="bottom"
                          arrow
                          enterDelay={200}
                          leaveDelay={200}
                        >
                          <button onClick={() => handleEditar(row, item.id)} >
                            <EditIcon />
                          </button>

                        </Tooltip>
                        <Tooltip
                          title="Deletar saída"
                          placement="bottom"
                          arrow
                          enterDelay={200}
                          leaveDelay={200}
                        >
                          <button
                            onClick={() => abrirModalConfirmarDeletar(row, item.id)}>
                            <DeleteForeverIcon />
                          </button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openEditar} onClose={handleCloseEditar}>
        <DialogTitle>Editar Saída</DialogTitle>
        <DialogContent>
          {isLoadingProdutos ? (
            <div>Carregando produtos...</div>
          ) : (
            <>
              <TextField
                disabled="true"
                type="date"
                value={editarSaida.dtSaida}
                onChange={(e) => setDataBusca(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {editarSaida.saidaEstoques?.map((saida, index) => (
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
                    value={saida.produtoId}
                    onChange={(e) =>
                      handleChangeEditarSaida(index, "produtoId", e.target.value)
                    }
                    fullWidth
                    margin="dense"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">{`${saida.produto.nome} - ${saida.produto.marca
                      } (R$ ${saida.produto.preco?.toFixed(2)})`}</option>
                    {produtosDisponiveis.map((produto) => (
                      <option key={produto.id} value={produto.id}>
                        {`${produto.nome} - ${produto.marca
                          } (R$ ${produto.preco?.toFixed(2)})`}
                      </option>
                    ))}
                  </TextField>

                  <TextField
                    type="number"
                    label="Qtd de caixas que serão editadas"
                    value={saida.qtdCaixasSaida}
                    onChange={(e) =>
                      handleChangeEditarQtdCaixaSaida(index, "qtdCaixasSaida", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                    inputProps={{
                      min: 1,
                    }}
                  />
                </div>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>

          <Button className="botaoModal" onClick={handleCloseEditar}>
            Cancelar
          </Button>
          <Button
            className="botaoModal"
            onClick={() => handleConfirmarEdicaoSaida(editarSaida)}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openAdicionar} onClose={handleCloseAdicionar}>
        <DialogTitle>Adicionar Saída</DialogTitle>
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
                inputProps={{
                  max: new Date(
                    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
                  ).toISOString().split('T')[0], // pega o dia de hoje no formato "yyyy-mm-dd"
                }}
              />
              {novasSaidas.map((venda, index) => (
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
                      handleChangeNovaSaída(index, "produtoId", e.target.value)
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
                      handleChangeNovaSaída(index, "quantidade", e.target.value)
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
            onClick={() => handleConfirmarSaida(novasSaidas)}
            disabled={
              isLoadingProdutos ||
              novasSaidas.some((v) => !v.produtoId || !v.quantidade)
            }
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBuscar} onClose={handleCloseBuscar}>
        <DialogTitle>Buscar Saída</DialogTitle>
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
              {saidasDoDia.length > 0 && (
                <div>
                  {saidasDoDia.map((venda) => {

                    return (
                      <div key={venda.id} className="mb-4 border-b pb-2">
                        <h3>Saída #{venda.id}</h3>
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

      <ModalConfirmarDeletar
        open={abrirConfirmarDeletar}
        onClose={fecharModalConfirmarDeletar}
        onDeletar={handleDeletar}
        title="Confirmar Deletar Saída"
        texto="Atenção, tem certeza de que deseja excluir está saída?"
      />
    </div>
  );
};

export default Saidas;
