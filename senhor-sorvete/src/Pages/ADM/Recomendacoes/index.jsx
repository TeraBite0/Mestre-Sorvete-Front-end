import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Autocomplete, TextField } from '@mui/material';
import './recomendacoes.css';
import TableContainer from '@mui/material/TableContainer';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import HeaderGerenciamento from '../../../Components/HeaderGerenciamento';
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import ModalGerenciamento from '../../../Components/ModalGerenciamento';
import { toast } from 'react-toastify';
import axios from "axios";

const Recomendacao = () => {
    const [produtos, setProdutos] = useState([]);
    const [todosProdutos, setTodosProdutos] = useState([]);
    const [erro, setErro] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduto, setSelectedProduto] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        
        // Busca dos produtos recomendados
        axios.get('http://localhost:8080/produtos/recomendacao-do-dia', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log("Dados recebidos:", response.data);
            // Garantir que temos um array e mapear apenas os campos necessários
            const produtosFormatados = Array.isArray(response.data) 
                ? response.data.map(produto => ({
                    id: produto.id,
                    nome: produto.nome || 'Nome não informado',
                    preco: produto.preco || 0,
                    marca: {
                        nome: produto.marca?.nome || 'Marca não informada'
                    }
                }))
                : [];
            
            console.log("Produtos formatados:", produtosFormatados);
            setProdutos(produtosFormatados);
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
            setErro('Erro ao carregar produtos.');
        });

        // Busca de todos os produtos
        axios.get('http://localhost:8080/produtos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const produtosFormatados = response.data.map(produto => ({
                id: produto.id,
                nome: produto.nome || 'Nome não informado',
                preco: produto.preco || 0,
                marca: {
                    nome: produto.marca?.nome || 'Marca não informada'
                }
            }));
            setTodosProdutos(produtosFormatados);
        })
        .catch(error => {
            console.error("Erro ao carregar todos os produtos:", error);
        });
    }, []);


    const handleEditClick = (produto) => {

    }


    const atualizarProduto = async () => {
        if (!selectedProduto) return;

        try {
            const token = sessionStorage.getItem('token');
            // Formatando o produto para o formato esperado pelo backend
            const produtoParaAtualizar = {
                id: selectedProduto.id,
                nome: selectedProduto.nome,
                preco: selectedProduto.preco,
                marca: selectedProduto.marca,
                isAtivo: true,  // valores default
                emEstoque: true // valores default
            };

            await axios.put(
                `http://localhost:8080/produtos/recomendacao-do-dia/${selectedProduto.id}`,
                produtoParaAtualizar,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            toast.success('Produto atualizado com sucesso!');
            setModalOpen(false);
            
            // Atualiza a lista local com os dados formatados
            setProdutos(prevProdutos => 
                prevProdutos.map(prod => 
                    prod.id === selectedProduto.id 
                        ? {
                            id: selectedProduto.id,
                            nome: selectedProduto.nome,
                            preco: selectedProduto.preco,
                            marca: {
                                nome: selectedProduto.marca?.nome || 'Marca não informada'
                            }
                          }
                        : prod
                )
            );
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            toast.error('Erro ao atualizar o produto.');
        }
    };

    return (
        <>
            <div className='tabela-produtos'>
                {erro ? (
                    <p style={{ color: 'red' }}>{erro}</p>
                ) : (
                    <TableContainer component={Paper} className='container-tabela'>
                        <Table aria-label="Tabela">
                            <TableHead className='tabela-Head'>
                                <TableRow>
                                    <TableCell className='tabela-head'>Nome</TableCell>
                                    <TableCell className='tabela-head'>Marca</TableCell>
                                    <TableCell className='tabela-head'>Preço</TableCell>
                                    <TableCell className='tabela-head'>Editar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {produtos.length > 0 ? (
                                    produtos.map(produto => (
                                        <TableRow key={produto.id} className='tabela-row'>
                                            <TableCell className='tabela-cell'>
                                                {produto.nome}
                                            </TableCell>
                                            <TableCell className='tabela-cell'>
                                                {produto.marca?.nome || 'N/A'}
                                            </TableCell>
                                            <TableCell className='tabela-cell'>
                                                {typeof produto.preco === 'number' 
                                                    ? produto.preco.toLocaleString('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                    })
                                                    : 'R$ 0,00'
                                                }
                                            </TableCell>
                                            <TableCell className='tabela-cell'>
                                                <button onClick={() => handleEditClick(produto)}>
                                                    <EditIcon />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                                            Nenhum produto recomendado encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            {/* Modal com Autocomplete */}
            <ModalGerenciamento
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Selecionar Novo Produto"
                fields={[
                    {
                        label: 'Selecione um novo produto',
                        component: (
                            <Autocomplete
                                options={todosProdutos}
                                getOptionLabel={(option) => option.nome || ''}
                                onChange={(event, newValue) => {
                                    setSelectedProduto(newValue);
                                }}
                                renderInput={(params) => 
                                    <TextField {...params} label="Produto" />
                                }
                                value={selectedProduto}
                                isOptionEqualToValue={(option, value) => 
                                    option?.id === value?.id
                                }
                            />
                        ),
                    }
                ]}
                onSave={atualizarProduto}
            />
        </>
    );
};

export default Recomendacao;
