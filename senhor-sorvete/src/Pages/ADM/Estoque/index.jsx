import React, { useState, useEffect } from "react";
import "./estoque.css";
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from "../../../Components/BotaoVoltarGerenciamento";
import Pesquisa from "../../../Components/Pesquisa";
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";
import ModalGerenciamento from "../../../Components/ModalGerenciamento";
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

const obterCorQtdPorCaixa = (qtdPorCaixas) => {
  if (qtdPorCaixas === 0) return "#818d91";
  if (qtdPorCaixas<= 10) return "#fc8886";
  if (qtdPorCaixas <= 30) return "#fafa9d";
  return "#90EE90";
};

const estiloCabecalhoTabela = {
  fontWeight: "bold",
  backgroundColor: "#f5f5f5",
  textAlign: "center",
  borderRight: "1px solid #ddd",
};

const estiloCelulaTabela = {
  borderRight: "1px solid #ddd",
  whiteSpace: "nowrap",
};

const estiloQuantidade = {
  ...estiloCelulaTabela,
  width: "12px",
  maxWidth: "90px",
  minWidth: "90px",
};

const Estoque = () => {
  const [abrirRegistrarPerda, setAbrirRegistrarPerda] = useState(false);
  const [abrirAdicionarLote, setAbrirAdicionarLote] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEstoque = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/produtos', {
        const response = await axios.get('http://localhost:8080/produtos', {
          headers: {
            Authorization: `Bearer ${token}`
          }
          
        })
        setProdutos(response.data);
      } catch (error) {
        toast.error('Erro ao buscar estoque');
        console.log(error);
      }
    };
    fetchEstoque();
  }, []);

  const abrirModalRegistrarPerda = () => setAbrirRegistrarPerda(true);
  const fecharModalRegistrarPerda = () => setAbrirRegistrarPerda(false);
  const abrirModalAdicionarLote = () => setAbrirAdicionarLote(true);
  const fecharModalAdicionarLote = () => setAbrirAdicionarLote(false);

  const renderProdutoCell = (value, defaultValue = '-') => {
    return value || defaultValue;
  };

  const calcularQuantidadeProduto = (produto) => {
    return produto.qtdCaixasEstoque * produto.qtdPorCaixas;
  }

  const camposRegistrarPerda = [
    {
      name: "produtoId",
      label: "Produto",
      type: "select",
      options: produtos.map((p) => ({
        value: p.codigo,
        label: `${p.produto} - ${p.marca}`,
      })),
    },
    {
      name: "qtdPerda",
      label: "Quantidade de Perda",
      type: "number",
    },
  ];

  const camposAdicionarLote = [
    {
      name: "produtoId",
      label: "Produto",
      type: "select",
      options: produtos.map((p) => ({
        value: p.codigo,
        label: `${p.produto} - ${p.marca}`,
      })),
    },
    {
      name: "dtCompra",
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
    produtoId: { required: true },
    dtCompra: { required: true },
    dtVencimento: { required: true },
    dtEntrega: { required: true },
    qtdProdutoComprado: {
      required: true,
      pattern: /^[1-9]\d*$/,
      message: "Quantidade deve ser um número positivo",
    },
    valorLote: {
      required: true,
      pattern: /^\d*\.?\d+$/,
      message: "Valor deve ser maior que zero",
    },
  };

  const handleSubmitLote = async (formData) => {
    const token = sessionStorage.getItem("token");
    setLoading(true);

    try {
      await axios.post('http://localhost:8080/produtos', formData, {
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

  const handleRegistrarPerda = async (formData) => {
    const token = sessionStorage.getItem('token');
    setLoading(true);

    const payload = {
      produtoId: Number(formData.produtoId),
      qtdPerda: Number(formData.qtdPerda),
    };

    try {
      await axios.post('http://localhost:8080/perdas', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success('Perda registrada com sucesso!');
      fecharModalRegistrarPerda();

      // Atualiza a lista de produtos
      const response = await axios.get('http://localhost:8080/estoque', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao registrar perda:', error);
      toast.error(error.response?.data?.message || 'Erro ao registrar perda');
    } finally {
      setLoading(false);
    }
  };


  const transformBeforeSubmit = (data) => {
    return {
      ...data,
      produtoId: Number(data.produtoId),
      qtdProdutoComprado: Number(data.qtdProdutoComprado),
      valorLote: Number(data.valorLote),
    };
  };

  const buscarProdutos = produtos.filter((produto) => {
    const nomeInclusao = produto.nome
      .toLowerCase()
      .includes(pesquisa.trim().toLowerCase());
    const marcaInclusao = produto.marca
      .toLowerCase()
      .includes(pesquisa.trim().toLowerCase());
    console.log(
      `Nome: ${produto.produto}, Marca: ${produto.marca}, Pesquisa: ${pesquisa}, Nome Inclusão: ${nomeInclusao}, Marca Inclusão: ${marcaInclusao}`
    );
    return nomeInclusao || marcaInclusao;
  });

   if (!pesquisa.trim()) return true;

   const termoBusca = pesquisa.trim().toLowerCase();
   return(
    (produto.nome && produto.nome.toLowerCase().includes(termoBusca)) || 
    (produto.marca && produto.marca.toLowerCase().includes(termoBusca))
   );
  });
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
              botao="Registrar Perda"
              onClick={abrirModalRegistrarPerda}
            />
            <BotaoGerenciamento
              botao="Adicionar Lote"
              onClick={abrirModalAdicionarLote}
            />
          </div>
        </div>
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
                                padding: '0px',
                            },
                            '& .MuiTableCell-root:last-child': {
                                width: '60px', // Ajusta a largura da última coluna (Editar)
                            }
                        }}
                        size="small"
                        aria-label="tabela de produtos"
                    >

                    <TableHead className='tabela-Head'>
                      <TableRow >
                        <TableCell className='tabela-head-cell' style={{paddingLeft: '10px'}}>Código</TableCell>
                        <TableCell className='tabela-head-cell' style={{paddingLeft: '10px'}}>Nome</TableCell>
                        <TableCell className='tabela-head-cell' style={{paddingLeft: '10px'}}>Marca</TableCell>
                        <TableCell className='tabela-head-cell' style={{paddingLeft: '10px'}}>Qtd Por Caixa</TableCell>
                        <TableCell className='tabela-head-cell' style={{paddingLeft: '10px'}}>Qtd De Caixa</TableCell>
                        <TableCell className='tabela-head-cell' style={{paddingLeft: '10px'}}>Total de produtos</TableCell>
                        {/* <TableCell
                          style={{ ...estiloCabecalhoTabela, ...estiloQuantidade }}
                        >
                          Quantidade
                        </TableCell> */}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {/* {produtos
                            .filter(produto => produto && typeof produto === 'object' && produto.id)
                            .map(produto => (
                                <TableRow key={produto.id} className={`tabela-row-vendas ${!produto.isAtivo ? 'desativado' : ''}`}>
                                    <TableCell>{renderProdutoCell(produto.nome, 'Produto sem nome')}</TableCell>
                                    <TableCell>{renderProdutoCell(produto.marca, 'Marca desconhecida')}</TableCell>
                                    <TableCell>{renderProdutoCell(produto.tipo, 'Tipo desconhecida')}</TableCell>
                                </TableRow>
                            ))
                            } */}
                      {produtos.map((produto) => (
                        <TableRow key={produto.codigo} className={`tabela-row-vendas ${!produto.isAtivo ? 'desativado' : ''}`}>
                          <TableCell style={{padding: '10px'}}>{produto.id}</TableCell>
                          <TableCell style={{padding: '10px'}}>{produto.nome}</TableCell>
                          <TableCell style={{padding: '10px'}}>{produto.marca}</TableCell>
                          <TableCell style={{padding: '10px'}}>{produto.qtdPorCaixas}</TableCell>
                          <TableCell style={{padding: '10px'}}>{produto.qtdCaixasEstoque}</TableCell>
                          <TableCell style={{padding: '10px'}}>{calcularQuantidadeProduto(produto)}</TableCell>
                          {/* <TableCell
                            // style={{
                            //   ...estiloQuantidade,
                            //   backgroundColor: obterCorQuantidade(produto.qtdEstoque),
                            // }}
                            align="center"
                          >
                            {produto.qtdEstoque}
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
            </Table>
          </TableContainer>
        </div>
        <TableContainer component={Paper}
        sx={{
          maxHeight: '55vh',  // altura máxima
          overflow: 'auto'
      }}>
          <Table size="small" aria-label="tabela de estoque">
            <TableHead>
              <TableRow>
                <TableCell style={estiloCabecalhoTabela}>Código</TableCell>
                <TableCell style={estiloCabecalhoTabela}>Nome</TableCell>
                <TableCell style={estiloCabecalhoTabela}>Marca</TableCell>
                <TableCell style={{ ...estiloCabecalhoTabela, ...estiloQuantidade }}>Qtd Caixas</TableCell>
                <TableCell style={{ ...estiloCabecalhoTabela, ...estiloQuantidade }}>Qtd por Caixas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buscarProdutos.map((produto) => (
                <TableRow key={produto.codigo}>
                  <TableCell style={estiloCelulaTabela}>
                    {produto.id}
                  </TableCell>
                  <TableCell style={estiloCelulaTabela}>
                    {produto.nome}
                  </TableCell>
                  <TableCell style={estiloCelulaTabela}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      

      <ModalGerenciamento
        open={abrirRegistrarPerda}
        onClose={fecharModalRegistrarPerda}
        title="Registrar Perda"
        fields={camposRegistrarPerda}
        onSubmit={handleRegistrarPerda}
        loading={loading}
      />

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
