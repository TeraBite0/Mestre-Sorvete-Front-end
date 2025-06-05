import React, { useState, useEffect, useCallback } from "react";
import './produtoEstoque.css';
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
import ModalConfirmarDeletar from "../../../Components/ModalConfirmarDeletar";
import ModalEditarLote from "../../../Components/ModalEditarLote";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ProdutoEstoque = () => {
  const [abrirConfirmarDeletar, setAbrirConfirmarDeletar] = useState(false);
  const [abrirModalEditarLoteStatus, setAbrirModalEditarLoteStatus] = useState(false);
  const [lotesDoProduto, setLotesDoProduto] = useState([]);
  const [idLote, setIdLote] = useState();
  const { id } = useParams();
  const [nomeProduto, setNomeProduto] = useState("");

  const handleNomeProdutoLote = useCallback((lote) => {
    if (lote && lote[0] && lote[0].loteProdutos) {
      lote[0].loteProdutos.forEach((l) => {
        if (l.produto.id === Number(id)) {
          setNomeProduto(`${l.produto.nome} - ${l.produto.marca}`);
        }
      });
    }
  }, [id, setNomeProduto]);

  useEffect(() => {
    if (id === undefined || id === null) return;
    const fetchEstoque = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get(`http://50.19.70.8:80/api/lotes/produtos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });


        const data = response.data;
        setLotesDoProduto(data);

        if (data.length > 0) {
          handleNomeProdutoLote(data);
        } else {
          setNomeProduto("Não há histórico de lote com esse produto.");
        }
      } catch (error) {
        toast.error('Erro ao buscar lotes do produto');
        console.log(error);
      }
    };
    fetchEstoque();
  }, [id, handleNomeProdutoLote]);

  const abrirEditarStatus = (idLote) => {
    setIdLote(idLote);
    setAbrirModalEditarLoteStatus(true);
  };

  const fecharEditarStatus = () => setAbrirModalEditarLoteStatus(false);

  const fecharModalConfirmarDeletar = () => setAbrirConfirmarDeletar(false);

  function formatarNumero(numero) {
    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  const estiloQuantidade = {
    width: "12px",
    maxWidth: "90px",
    minWidth: "90px",
  };

  const obterCorStatusLote = (status) => {
    if (status === "Aguardando entrega") return "#fafa9d";
    if (status === "Entregue") return "#90EE90";
    if (status === "Cancelado") return "#fc8886";
    if (status === "Entregue com pendência") return "#fafa9d";
    if (status === "Concluído com pendência") return "#818d91";
    return "#fff";
  };

  const handleDeletar = async () => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`http://50.19.70.8:80/api/lotes/${idLote}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Erro ao deletar lote:", error);
      toast.error("Erro ao deletar lote.");
    }
  };

  return (
    <>
      <HeaderGerenciamento />
      <div className='estoqueContainer'>
        <div className='barraTopoWrapper'>
          <BotaoVoltarGerenciamento pagina="/adm/estoque" texto="Voltar ao Estoque" />
        </div>

        <h3>{nomeProduto}</h3>

        <div>
          <TableContainer
            component={Paper}
            className='container-tabela'
            sx={{
              maxHeight: '60vh',
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
                  width: '70px',
                }
              }}
              size="small"
            >
              <TableHead className='tabela-Head'>
                <TableRow>
                  <TableCell className='tabela-head-cell' style={{ textAlign: "center", width: "135px" }}>Id do Lote</TableCell>
                  <TableCell className='tabela-head-cell' style={{ textAlign: "center", width: "130px" }}>Data da Compra</TableCell>
                  <TableCell className='tabela-head-cell' style={{ textAlign: "center", width: "130px" }}>Data de Entrega</TableCell>
                  <TableCell className='tabela-head-cell' style={{ textAlign: "center", ...estiloQuantidade }}>Status</TableCell>
                  <TableCell className='tabela-head-cell' style={{ textAlign: "center", width: "10px" }} align="center">Observação</TableCell>
                  <TableCell className='tabela-head-cell' style={{ textAlign: "center" }} align="center">Unidades Compradas</TableCell>
                  <TableCell className='tabela-head-cell' style={{ textAlign: "center", width: "130px" }} align="center">Valor do Lote</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(lotesDoProduto || []).map((produto) => (
                  <TableRow
                    key={produto.id || produto.codigo}
                    onClick={() => abrirEditarStatus(produto.id)}
                    style={{ cursor: 'pointer' }}
                    className="tabela-row-saidas tabela-row-estoque"
                  >
                    <TableCell style={{ textAlign: "center" }} className="table-cell-grid-estoque">
                      {produto.id}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }} className="table-cell-grid-estoque">
                      {produto.dtPedido}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }} className="table-cell-grid-estoque">
                      {produto.dtEntrega}
                    </TableCell>
                    <TableCell
                      style={{
                        ...estiloQuantidade,
                        textAlign: "center",
                        backgroundColor: obterCorStatusLote(produto.status),
                      }}
                      align="center"
                    >
                      {produto.status}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }} className="table-cell-grid-estoque">
                      {produto.observacao || "-"}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }} className="table-cell-grid-estoque">
                      {produto.loteProdutos.reduce((total, l) => {
                        if (l.produto.id === Number(id)) {
                          return total + l.qtdCaixasCompradas;
                        }
                        return total;
                      }, 0)}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }} className="table-cell-grid-estoque">
                      R${formatarNumero(produto.valorLote)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <ModalConfirmarDeletar
        open={abrirConfirmarDeletar}
        onClose={fecharModalConfirmarDeletar}
        onDeletar={handleDeletar}
        title="Confirmar Deletar Lote"
        texto="Atenção, tem certeza de que deseja excluir este lote?"
      />

      <ModalEditarLote
        open={abrirModalEditarLoteStatus}
        onClose={fecharEditarStatus}
        idLote={idLote}
        title="Editar Status do Lote"
      />
    </>
  );
};

export default ProdutoEstoque;