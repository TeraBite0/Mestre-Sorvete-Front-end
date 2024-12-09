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

const obterCorQuantidade = (quantidade) => {
  if (quantidade === 0) return "#818d91";
  if (quantidade <= 10) return "#fc8886";
  if (quantidade <= 30) return "#fafa9d";
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
  width: "8px",
  maxWidth: "80px",
  minWidth: "80px",
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
                const response = await axios.get('http://74.163.64.10:8080/estoque', {
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
            await axios.post('http://74.163.64.10:8080/estoque', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

      toast.success("Lote adicionado com sucesso!");
      fecharModalAdicionarLote();

            // Atualiza a lista de produtos
            const response = await axios.get('http://74.163.64.10:8080/estoque', {
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
            await axios.post('http://74.163.64.10:8080/perdas', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            toast.success('Perda registrada com sucesso!');
            fecharModalRegistrarPerda();
    
            // Atualiza a lista de produtos
            const response = await axios.get('http://74.163.64.10:8080/estoque', {
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
    const nomeInclusao = produto.produto
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

  return (
    <>
      <HeaderGerenciamento />
      <div className="estoqueContainer">
        <BotaoVoltarGerenciamento pagina="/home/gerenciamento" />
        <div className="controlesWrapper">
          <Pesquisa
            placeholder="Nome"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
          <div className="wopperWrapper">
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
        <TableContainer component={Paper}>
          <Table size="small" aria-label="tabela de estoque">
            <TableHead>
              <TableRow>
                <TableCell style={estiloCabecalhoTabela}>Código</TableCell>
                <TableCell style={estiloCabecalhoTabela}>Nome</TableCell>
                <TableCell style={estiloCabecalhoTabela}>Marca</TableCell>
                <TableCell
                  style={{ ...estiloCabecalhoTabela, ...estiloQuantidade }}
                >
                  Quantidade
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buscarProdutos.map((produto) => (
                <TableRow key={produto.codigo}>
                  <TableCell style={estiloCelulaTabela}>
                    {produto.codigo}
                  </TableCell>
                  <TableCell style={estiloCelulaTabela}>
                    {produto.produto}
                  </TableCell>
                  <TableCell style={estiloCelulaTabela}>
                    {produto.marca}
                  </TableCell>
                  <TableCell
                    style={{
                      ...estiloQuantidade,
                      backgroundColor: obterCorQuantidade(produto.qtdEstoque),
                    }}
                    align="center"
                  >
                    {produto.qtdEstoque}
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
