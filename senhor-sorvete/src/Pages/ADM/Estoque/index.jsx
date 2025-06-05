import React, { useState, useEffect } from "react";
import "./estoque.css";
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from "../../../Components/BotaoVoltarGerenciamento";
import Pesquisa from "../../../Components/Pesquisa";
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";
import ModalGerenciamento from "../../../Components/ModalGerenciamento";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const obterCorQtdCaixaEstoque = (qtdCaixasEstoque) => {
  if (qtdCaixasEstoque === 0) return "#818d91";
  if (qtdCaixasEstoque <= 10) return "#fc8886";
  if (qtdCaixasEstoque <= 30) return "#fafa9d";
  return "#90EE90";
};

// const obterCorQtdPorCaixa = (qtdPorCaixas) => {
//   if (qtdPorCaixas === 0) return "#818d91";
//   if (qtdPorCaixas <= 10) return "#fc8886";
//   if (qtdPorCaixas <= 30) return "#fafa9d";
//   return "#90EE90";
// };

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
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstoque = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get('http://50.19.70.8:80/api/produtos', {
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

  // const baixarRelatorioExcel = async () => {
  //   const token = sessionStorage.getItem('token');
  //     try {
  //        await axios.get('http://50.19.70.8:80/api/relatorio', {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //     } catch (error) {
  //       toast.error('Erro ao baixar relatório Excel');
  //       console.log(error);
  //     }
  // }

  const baixarRelatorioExcel = async () => {
    const token = sessionStorage.getItem('token');

    try {
      const response = await axios.get('http://50.19.70.8:80/api/relatorio', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob' // IMPORTANTE!
      });

      // Cria uma URL do arquivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Define o nome do arquivo
      link.setAttribute('download', 'relatorio.xlsx');

      // Adiciona e clica no link
      document.body.appendChild(link);
      link.click();

      // Limpa o link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      toast.error('Erro ao baixar relatório Excel');
      console.log(error);
    }
  };


  const abrirModalAdicionarLote = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axios.get('http://50.19.70.8:80/api/fornecedores', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFornecedores(response.data);
      setAbrirAdicionarLote(true);
    } catch (error) {
      toast.error('Erro ao buscar estoque');
      console.log(error);
    }
  }

  const fecharModalAdicionarLote = () => setAbrirAdicionarLote(false);

  const camposAdicionarLote = [
    {
      name: "produto",
      label: "Produto",
      type: "select",
      options: produtos.map((p) => ({
        value: p.codigo || p.id,
        label: `${p.nome || p.produto} - ${p.marca}`,
      })),
    },
    {
      name: "qtdCaixasCompradas",
      label: "Quantidade de caixas comprada",
      type: "number",
    },
  ];

  const camposEmComum = [
    {
      name: "nomeFornecedor",
      label: "Nome do Fornecedor",
      type: "select",
      options: [
        ...fornecedores.map((f) => ({
          value: f.nome,
          label: f.nome,
        })),
        { value: 'add-new', label: '+ Adicionar Novo Fornecedor' }
      ]
    },
    {
      name: "dtEntrega",
      label: "Previsão de entrega",
      type: "date",
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
      qtdCaixasCompradas: {
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
      loteProdutos: formData.loteProdutos.map((produto) => ({
        produtoId: Number(produto.produtoId),
        qtdCaixasCompradas: Number(produto.qtdCaixasCompradas),
      })),
    };

    try {
      await axios.post('http://50.19.70.8:80/api/lotes', jsonParaCriarLote, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success("Lote adicionado com sucesso!");
      fecharModalAdicionarLote();

      // Atualiza a lista de produtos
      const response = await axios.get('http://50.19.70.8:80/api/produtos', {
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

  const transformBeforeSubmit = (data, index) => {
    const loteProdutos = [];

    for (let i = 0; i < index; i++) {
      const produtoKey = i === 0 ? 'produto' : 'produto' + i;
      const qtdKey = i === 0 ? 'qtdCaixasCompradas' : 'qtdCaixasCompradas' + i;

      loteProdutos.push({
        produtoId: Number(data[produtoKey]),
        qtdCaixasCompradas: Number(data[qtdKey])
      });
    }

    return {
      ...data,
      loteProdutos: loteProdutos,
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

  const handleSelecionarProduto = (id) => {
    navigate(`/adm/produto-estoque/${id}`);
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
              botao="Baixar relatório Excel"
              onClick={baixarRelatorioExcel}
            />
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
                  <TableCell className='tabela-head-cell' style={{ estiloQuantidade }}>Unidades por Caixas</TableCell>
                  <TableCell className='tabela-head-cell' style={{ estiloQuantidade }} align="center">Quantidade de Caixas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtosFiltrados.map((produto) => (
                  <TableRow
                    key={produto.id || produto.codigo}
                    onClick={() => handleSelecionarProduto(produto.id)}
                    style={{ cursor: 'pointer' }}
                    className={`tabela-row-saidas tabela-row-estoque ${!produto.isAtivo ? 'desativado' : ''}`}
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
                    <TableCell class={`table-cell-grid-estoque`}>
                      {produto.qtdPorCaixas}
                    </TableCell>
                    <TableCell style={{
                      ...estiloQuantidade,
                      backgroundColor: obterCorQtdCaixaEstoque(produto.qtdCaixasEstoque),
                    }}
                      align="center">
                      {produto.qtdCaixasEstoque}
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
        dadosEmComun={camposEmComum}
        onSubmit={handleSubmitLote}
        validation={validacaoAdicionarLote}
        transformBeforeSubmit={transformBeforeSubmit}
        loading={loading}
      />
    </>
  );
};

export default Estoque;