import React, { useState, useEffect } from "react";
import './produtoEstoque.css';
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";
// import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ProdutoEstoque = () => {
    const [lotesDoProduto, setLotesDoProduto] = useState([]);
    const { id } = useParams();
    const hoje = new Date();

    useEffect(() => {
        if(id === undefined || id === null) return
        const fetchEstoque = async () => {
            const token = sessionStorage.getItem('token');
            try {
            const response = await axios.get(`http://localhost:8080/lotes/produtos/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`
                }

            });

            setLotesDoProduto(response.data);
            console.log(response.data)
            } catch (error) {
            toast.error('Erro ao buscar lotes do produto');
            console.log(error);
            }
        };
        fetchEstoque();
    }, []);
    
    const getCorVencimento = (dataVencimento) => {
        const vencimento = new Date(dataVencimento.split('/').reverse().join('-'));
        const diasAteVencimento = Math.floor((vencimento - hoje) / (1000 * 60 * 60 * 24));
        
        if (diasAteVencimento < 0) return '#A9A9A9'; // Vencidos
        if (diasAteVencimento <= 30) return '#F1C97B'; // Próximos do vencimento
        return '#6FDB64'; // Normais
    };

    function formatarNumero(numero) {
        return numero.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    return (
        <>
            <HeaderGerenciamento />
            <div className='estoqueContainer'>
                <div className='barraTopoWrapper'>
                    <BotaoVoltarGerenciamento pagina="/adm/estoque" texto="Voltar ao Estoque" />
                    <div className='wopperWrapper'>
                        <BotaoGerenciamento botao="Buscar" />
                    </div>
                </div>

                <div>
                    <span>{lotesDoProduto[0]?.loteProdutos[0]?.produto?.nome}</span>
                </div>

                <div >
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
                            width: '70px', // Ajusta a largura da última coluna (Editar)
                        }
                        }}
                        size="small"
                        
                    >
                        
                        <TableHead className='tabela-Head'>
                        <TableRow>
                            <TableCell className='tabela-head-cell' style={{textAlignLast: "center", width: "135px"}}>Status</TableCell>
                            <TableCell className='tabela-head-cell' style={{textAlignLast: "center", width: "130px"}}>Data da Compra</TableCell>
                            <TableCell className='tabela-head-cell' style={{textAlignLast: "center", width: "130px"}}>Data de Entrega</TableCell>
                            <TableCell className='tabela-head-cell' style={{textAlignLast: "center", width: "130px"}}align="center">Valor do Lote</TableCell>
                            <TableCell className='tabela-head-cell' style={{textAlignLast: "center"}}align="center">Unidades Compradas</TableCell>
                            <TableCell className='tabela-head-cell' style={{textAlignLast: "center", width: "10px"}}align="center">Observação</TableCell>
                            <TableCell className='tabela-head-cell' style={{textAlignLast: "center"}}align="center">Ações</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {(lotesDoProduto || []).map((produto) => (
                            <TableRow 
                                key={produto.codigo} 
                            >
                            <TableCell style={{textAlignLast: "center"}} class={`table-cell-grid-estoque`}>
                                {produto.status}
                            </TableCell>
                            <TableCell style={{textAlignLast: "center"}} class={`table-cell-grid-estoque`}>
                                {produto.dtPedido}
                            </TableCell>
                            <TableCell style={{textAlignLast: "center"}} class={`table-cell-grid-estoque`}>
                                {produto.dtEntrega}
                            </TableCell>
                            <TableCell style={{textAlignLast: "center"}} class={`table-cell-grid-estoque`}>
                                R${formatarNumero(produto.valorLote)}
                            </TableCell>
                            <TableCell style={{textAlignLast: "center"}} class={`table-cell-grid-estoque`}>
                                {produto.loteProdutos[0].qtdCaixasCompradas}
                            </TableCell>
                            <TableCell style={{textAlignLast: "center"}} class={`table-cell-grid-estoque`}>
                                {produto.observacao || "-"}
                            </TableCell>
                            <TableCell className="tabela-row-saidas">
                                <Tooltip
                                    title="Editar saída"
                                    placement="bottom"
                                    arrow
                                    enterDelay={200}
                                    leaveDelay={200}
                                >
                                    <button 
                                    // onClick={() => handleEditar(row, item.id)} 
                                        >
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
                                        // onClick={() => handleDeletar(row, item.id)}
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
        </>
    );
};

export default ProdutoEstoque;