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
import ModalEditarLote from "../../../Components/ModalEditarLote";
import ModalConfirmarDeletar from "../../../Components/ModalConfirmarDeletar"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ProdutoEstoque = () => {
    const [abrirEditarLote, setAbrirEditarLote] = useState(false);
    const [abrirConfirmarDeletar, setAbrirConfirmarDeletar] = useState(false);
    const [lotesDoProduto, setLotesDoProduto] = useState([]);
    const { id } = useParams();
    const hoje = new Date();
    const [loading, setLoading] = useState(false);
    const [idProduto, setIdProduto] = useState();
    const [produtos, setProdutos] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);  
    const [status, setStatus] = useState([
        { id: 1, nome: "Aguardando entrega" },
        { id: 2, nome: "Entregue" },
        { id: 3, nome: "Cancelado" },
        { id: 4, nome: "Entregue com pendência" },
        { id: 5, nome: "Concluído com pendência" }
      ]);

    useEffect(() => {
        if(id === undefined || id === null) return
        const fetchEstoque = async () => {
            const token = sessionStorage.getItem('token');
            try {
            const response = await axios.get(`http://10.0.0.25:8080/lotes/produtos/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`
                }
            });

            buscarProdutos();
            buscarFornecedores();

            setLotesDoProduto(response.data);
            console.log(response.data)
            } catch (error) {
            toast.error('Erro ao buscar lotes do produto');
            console.log(error);
            }
        };
        fetchEstoque();
    }, []);

    const buscarProdutos = async () => {
        const token = sessionStorage.getItem('token');
        try {
        const response = await axios.get(`http://10.0.0.25:8080/produtos`, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });

        setProdutos(response.data);
        } catch (error) {
        toast.error('Erro ao buscar produtos');
        console.log(error);
        }
    }

    const buscarFornecedores = async () => {
        const token = sessionStorage.getItem('token');
        try {
        const response = await axios.get(`http://10.0.0.25:8080/fornecedores`, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });

        setFornecedores(response.data);
        } catch (error) {
        toast.error('Erro ao buscar fornecedores');
        console.log(error);
        }
    }

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
          await axios.post('http://10.0.0.25:8080/lotes', jsonParaCriarLote, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
    
          toast.success("Lote adicionado com sucesso!");
          fecharModalEditarLote();
    
          // Atualiza a lista de produtos
          const response = await axios.get('http://10.0.0.25:8080/produtos', {
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

    const abrirModalEditarLote = () => setAbrirEditarLote(true);
    const fecharModalEditarLote = () => setAbrirEditarLote(false);

    const abrirModalConfirmarDeletar = (id) => {
        setIdProduto(id)
        setAbrirConfirmarDeletar(true);
    }
    const fecharModalConfirmarDeletar = () => setAbrirConfirmarDeletar(false);
    
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

    // const handleSubmitLote = async (formData) => {
    //     const token = sessionStorage.getItem("token");
    //     setLoading(true);
    
    //     const jsonParaCriarLote = {
    //       nomeFornecedor: formData.nomeFornecedor,
    //       dtEntrega: formData.dtEntrega,
    //       dtVencimento: formData.dtVencimento,
    //       dtPedido: formData.dtPedido,
    //       valorLote: Number(formData.valorLote),
    //       loteProdutos: [
    //         {
    //           produtoId: Number(formData.produtoId),
    //           qtdCaixasCompradas: Number(formData.qtdProdutoComprado),
    //         }
    //       ]
    //     };

    const camposAdicionarLote = [
        {
            name: "status",
            label: "Status do lote",
            type: "select",
            options: status.map((s) => ({
                value: s.id,
                label: s.nome
            }))
          },
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
          name: "qtdProdutoComprado",
          label: "Quantidade de caixas comprada",
          type: "number",
        },
        {
          name: "valorLote",
          label: "Valor do lote",
          type: "number",
        },
      ];

    const handleDeletar = async () => {
        const token = sessionStorage.getItem("token");
        try {
            await axios.delete(`http://10.0.0.25:8080/lotes/${idProduto}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });
            
            window.location.reload();
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            toast.error("Erro ao carregar lista de produtos.");
        }
    };

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
                    <h3>{lotesDoProduto[0]?.loteProdutos[0]?.produto?.nome} - {lotesDoProduto[0]?.loteProdutos[0]?.produto?.marca}  </h3>
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
                                    <button onClick={() => abrirModalEditarLote()} >
                                        <EditIcon />
                                    </button>

                                </Tooltip>
                                <Tooltip
                                    title="Deletar lote"
                                    placement="bottom"
                                    arrow
                                    enterDelay={200}
                                    leaveDelay={200}
                                >
                                    <button onClick={() => abrirModalConfirmarDeletar(produto.id)} >
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

            <ModalEditarLote
                open={abrirEditarLote}
                onClose={fecharModalEditarLote}
                title="Editar Lote"
                fields={camposAdicionarLote}
                onSubmit={handleSubmitLote}
                validation={validacaoAdicionarLote}
                transformBeforeSubmit={transformBeforeSubmit}
                loading={loading}
            />

            <ModalConfirmarDeletar
                open={abrirConfirmarDeletar}
                onClose={fecharModalConfirmarDeletar}
                onDeletar={handleDeletar}
                title="Confirmar Deletar Lote"
                texto="Atenção, tem certeza de que deseja excluir este lote?"
            />
        </>
    );
};

export default ProdutoEstoque;