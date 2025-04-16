import React, { useState, useEffect } from "react";
import "./estoque.css";
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from "../../../Components/BotaoVoltarGerenciamento";
import Pesquisa from "../../../Components/Pesquisa";
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";
import ModalGerenciamento from "../../../Components/ModalGerenciamento";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { Pointer } from "lucide-react";

const obterCorQtdCaixaEstoque = (qtdCaixasEstoque) => {
  if (qtdCaixasEstoque === 0) return "#818d91";
  if (qtdCaixasEstoque <= 10) return "#fc8886";
  if (qtdCaixasEstoque <= 30) return "#fafa9d";
  return "#90EE90";
};

const obterCorQtdPorCaixa = (qtdPorCaixas) => {
  if (qtdPorCaixas === 0) return "#818d91";
  if (qtdPorCaixas <= 10) return "#fc8886";
  if (qtdPorCaixas <= 30) return "#fafa9d";
  return "#90EE90";
};

// const estiloCabecalhoTabela = {
//   fontWeight: "bold",
//   paddingLeft: "10px"
// };

// const estiloCelulaTabela = {
//   borderRight: "1px solid #ddd",
//   whiteSpace: "nowrap",
// };

const estiloQuantidade = {
  width: "12px",
  maxWidth: "90px",
  minWidth: "90px",
};

const Estoque = () => {
  const [abrirAdicionarLote, setAbrirAdicionarLote] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstoque = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/produtos', {
          headers: {
            Authorization: `Bearer ${token}`
          }

        });
        setProdutos(response.data);
      } catch (error) {
        toast.error('Erro ao buscar estoque');
        console.log(error);
      }
    };
    fetchEstoque();
  }, []);

  const abrirModalAdicionarLote = () => setAbrirAdicionarLote(true);
  const fecharModalAdicionarLote = () => setAbrirAdicionarLote(false);

  const camposAdicionarLote = [
    {
      name: "produtoId",
      label: "Produto",
      type: "select",
      options: produtos.map((p) => ({
        value: p.codigo || p.id,
        label: `${p.nome || p.produto} - ${p.marca}`,
      })),
    },
    {
      name: "nomeFornecedor",
      label: "Nome do Fornecedor",
      type: "text"
    },
    {
      name: "dtPedido",
      label: "Data da compra",
      type: "date",
    },
    {
      name: "dtVencimento",
      label: "Data de vencimento",
      type: "date",
    },
    {
      name: "dtEntrega",
      label: "Previsão de entrega",
      type: "date",
    },
    {
      name: "qtdProdutoComprado",
      label: "Quantidade comprada",
      type: "number",
    },
    {
      name: "valorLote",
      label: "Valor do lote",
      type: "number",
    },
  ];

  const validacaoAdicionarLote = {
    nomeFornecedor: { required: true },
    dtEntrega: { required: true },
    dtVencimento: { required: true },
    dtPedido: { required: true },
    valorLote: {
      required: true,
      pattern: /^\d*\.?\d+$/,
      message: "Valor deve ser maior que zero",
    },
    loteProdutos: {
      produtoId: { required: true },
      qtdProdutoComprado: {
        required: true,
        pattern: /^[1-9]\d*$/,
        message: "Quantidade deve ser um número positivo",
      },
    }
  };

  const handleSubmitLote = async (formData) => {
    const token = sessionStorage.getItem("token");
    setLoading(true);

    const jsonParaCriarLote = {
      nomeFornecedor: formData.nomeFornecedor,
      dtEntrega: formData.dtEntrega,
      dtVencimento: formData.dtVencimento,
      dtPedido: formData.dtPedido,
      valorLote: Number(formData.valorLote),
      loteProdutos: [
        {
          produtoId: Number(formData.produtoId),
          qtdCaixasCompradas: Number(formData.qtdProdutoComprado),
        }
      ]
    };

    try {
      await axios.post('http://localhost:8080/lotes', jsonParaCriarLote, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success("Lote adicionado com sucesso!");
      fecharModalAdicionarLote();

      // Atualiza a lista de produtos
      const response = await axios.get('http://localhost:8080/produtos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProdutos(response.data);

    } catch (error) {
      console.error('Erro ao adicionar lote:', error);
      toast.error(error.response?.data?.message || 'Erro ao adicionar lote');
    } finally {
      setLoading(false);
    }
  };

  const transformBeforeSubmit = (data) => {
    return {
      ...data,
      loteProdutos: [
        {
          produtoId: Number(data.produtoId),
          qtdCaixasCompradas: Number(data.qtdProdutoComprado),
        }
      ],
      valorLote: Number(data.valorLote),
    };
  };

  const produtosFiltrados = produtos.filter((produto) => {
    const nomeProduto = produto.nome || produto.produto || "";
    const marcaProduto = produto.marca || "";
    const termoPesquisa = pesquisa.trim().toLowerCase();

    const nomeInclusao = nomeProduto.toLowerCase().includes(termoPesquisa);
    const marcaInclusao = marcaProduto.toLowerCase().includes(termoPesquisa);

    return nomeInclusao || marcaInclusao;
  });
  
  const handleSelecionarProduto = (produto) => {
    navigate("/adm/produto-estoque");
  };

  return (
    <>
      <HeaderGerenciamento />
      <div className="estoqueContainer">
        <BotaoVoltarGerenciamento pagina="/home/gerenciamento" />
        <div className="controlesWrapper">
          <div className="pesquisa-container">
            <Pesquisa
              placeholder="Nome"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
          <div className="botoes-container">
            <BotaoGerenciamento
              botao="Adicionar Lote"
              onClick={abrirModalAdicionarLote}
            />
          </div>
        </div>

        <div className="texto-produtos">
        <span>Atualmente {produtos.length} produtos cadastrados</span>
        </div>
       
        <div className='tabela-produtos'>
          <TableContainer
            component={Paper}
            className='container-tabela'
            sx={{
              maxHeight: '60vh',  // altura máxima
              overflow: 'auto'
            }}
          >
            <Table
              sx={{
                width: '100%',
                '& .MuiTableCell-root': {
                  padding: '5px',
                },
                '& .MuiTableCell-root:last-child': {
                  width: '60px', // Ajusta a largura da última coluna (Editar)
                }
              }}
              size="small"
              aria-label="tabela de produtos"
            >
              
              <TableHead className='tabela-Head'>
                <TableRow>
                  <TableCell className='tabela-head-cell' style={{ paddingLeft: '10px' }}>Código</TableCell>
                  <TableCell className='tabela-head-cell' style={{ paddingLeft: '10px' }}>Nome</TableCell>
                  <TableCell className='tabela-head-cell' style={{ paddingLeft: '10px' }}>Marca</TableCell>
                  <TableCell className='tabela-head-cell' style={{estiloQuantidade }}align="center">Qtd Caixas</TableCell>
                  <TableCell className='tabela-head-cell' style={{estiloQuantidade }}align="center">Qtd por Caixas</TableCell>
                  <TableCell className='tabela-head-cell' style={{estiloQuantidade }}align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtosFiltrados.map((produto) => (
                  <TableRow 
                      key={produto.id || produto.codigo} 
                      onClick={() => handleSelecionarProduto(produto)} 
                      style={{ cursor: 'pointer' }} 
                      className={`tabela-row-vendas tabela-row-estoque ${!produto.isAtivo ? 'desativado' : ''}`}
                  >
                    <TableCell class={`table-cell-grid-estoque`}>
                      {produto.id || produto.codigo}
                    </TableCell>
                    <TableCell class={`table-cell-grid-estoque`}>
                      {produto.nome || produto.produto}
                    </TableCell>
                    <TableCell class={`table-cell-grid-estoque`}>
                      {produto.marca}
                    </TableCell>
                    <TableCell style={{
                      ...estiloQuantidade,
                      backgroundColor: obterCorQtdCaixaEstoque(produto.qtdCaixasEstoque),
                    }}
                      align="center">
                      {produto.qtdCaixasEstoque}
                    </TableCell>
                    <TableCell style={{
                      ...estiloQuantidade,
                      backgroundColor: obterCorQtdPorCaixa(produto.qtdPorCaixas),
                    }}
                      align="center">
                      {produto.qtdPorCaixas}
                    </TableCell>

                    <TableCell style={{
                      ...estiloQuantidade,
                      backgroundColor: "#fff",
                    }}
                      align="center">
                        <Tooltip
                              title="Editar Lote"
                              placement="bottom"
                              arrow
                              enterDelay={200}
                              leaveDelay={200}
                          >
                              <button 
                              onClick={(e) => {
                                e.stopPropagation(); 
                                abrirModalAdicionarLote();
                              }} 
                                >
                                  <EditIcon />
                              </button>

                          </Tooltip>
                          <Tooltip
                              title="Deletar Lote"
                              placement="bottom"
                              arrow
                              enterDelay={200}
                              leaveDelay={200}
                          >
                              <button 
                                // onClick={(e) => 
                                // e.stopPropagation(); 
                                // handleDeletar(row, item.id)}
                                >
                                  <DeleteForeverIcon/>
                              </button>
                          </Tooltip>
                        </TableCell> 
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <ModalGerenciamento
        open={abrirAdicionarLote}
        onClose={fecharModalAdicionarLote}
        title="Adicionar Lote"
        fields={camposAdicionarLote}
        onSubmit={handleSubmitLote}
        validation={validacaoAdicionarLote}
        transformBeforeSubmit={transformBeforeSubmit}
        loading={loading}
      />
    </>
  );
};

export default Estoque;