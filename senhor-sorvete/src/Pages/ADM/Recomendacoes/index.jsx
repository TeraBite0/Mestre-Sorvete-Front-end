import { Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import './recomendacoes.css';
import TableContainer from '@mui/material/TableContainer';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import HeaderGerenciamento from '../../../Components/HeaderGerenciamento';
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import { toast } from 'react-toastify';
import axios from "axios";

const Recomendacao = () => {
    const [produtos, setProdutos] = useState([]);
    const [todosProdutos, setTodosProdutos] = useState([]);
    const [erro, setErro] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduto, setSelectedProduto] = useState(null);
    const [produtoRecomendado, setProdutoRecomendado] = useState(null);  // Produto atual recomendado

    useEffect(() => {
        const fetchProdutos = async () => {
            const token = sessionStorage.getItem('token');
            try {
                // Busca dos produtos recomendados
                const recomendadosResponse = await axios.get('http://localhost:8080/produtos/recomendacao-do-dia', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const produtosFormatados = Array.isArray(recomendadosResponse.data) 
                    ? recomendadosResponse.data.map(produto => ({
                        id: produto.id,
                        nome: produto.nome || 'Nome não informado',
                        preco: produto.preco || 0,
                        marca: { nome: produto.marca?.nome || 'Marca não informada' }
                    }))
                    : [{
                        id: recomendadosResponse.data.id,
                        nome: recomendadosResponse.data.nome || 'Nome não informado',
                        preco: recomendadosResponse.data.preco || 0,
                        marca: { nome: recomendadosResponse.data.marca?.nome || 'Marca não informada' }
                    }];
                setProdutos(produtosFormatados);
                setProdutoRecomendado(produtosFormatados[0]);

                // Busca de todos os produtos
                const todosResponse = await axios.get('http://localhost:8080/produtos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const todosProdutosFormatados = todosResponse.data.map(produto => ({
                    id: produto.id,
                    nome: produto.nome || 'Nome não informado',
                    preco: produto.preco || 0,
                    marca: { nome: produto.marca?.nome || 'Marca não informada' }
                }));
                setTodosProdutos(todosProdutosFormatados);
            } catch (error) {
                console.error("Erro nas requisições:", error);
                setErro('Erro ao carregar produtos.');
            }
        };

        fetchProdutos();
    }, []);  // Efeito de carregamento de produtos

    const handleEditClick = (produto) => {
        setProdutoRecomendado(produto); // Define o produto atual recomendado
        setModalOpen(true); // Abre o modal
    };

    const atualizarProduto = async (produtoAtualizado) => {
        if (!produtoAtualizado) return;
        
        try {
            const token = sessionStorage.getItem('token');
    
            // Verifique se todos os campos obrigatórios estão presentes
            const produtoParaAtualizar = {
                id: produtoAtualizado.id,
                nome: produtoAtualizado.nome,
                preco: produtoAtualizado.preco,
                isAtivo: produtoAtualizado.isAtivo || true, // Pode ser necessário ajustar esses campos
                emEstoque: produtoAtualizado.emEstoque || true, // Definir valor adequado
                subtipo: produtoAtualizado.subtipo ? {
                    id: produtoAtualizado.subtipo.id,
                    tipoPai: {
                        id: produtoAtualizado.subtipo.tipoPai.id,
                        nome: produtoAtualizado.subtipo.tipoPai.nome
                    },
                    nome: produtoAtualizado.subtipo.nome
                } : null,  // Verificar se subtipo está presente
                marca: produtoAtualizado.marca ? {
                    id: produtoAtualizado.marca.id,
                    nome: produtoAtualizado.marca.nome
                } : null // Verificar se marca está presente
            };
    
            console.log("Produto a ser atualizado:", produtoParaAtualizar);
    
            // Envia a requisição PUT
            const response = await axios.put(
                'http://localhost:8080/produtos/recomendacao-do-dia',
                produtoParaAtualizar,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            // Verifica se a atualização foi bem-sucedida
            if (response.status === 200) {
                toast.success('Produto atualizado com sucesso!');
            } else {
                toast.error('Erro ao atualizar o produto.');
            }
        } catch (error) {
            if (error.response) {
                console.error("Erro ao atualizar:", error.response.data);
                toast.error(`Erro ao atualizar: ${error.response.data.message}`);
            } else {
                console.error("Erro ao atualizar:", error.message);
                toast.error(`Erro ao atualizar: ${error.message}`);
            }
        }
    }
    
    

    const ModalEditarProduto = ({ open, onClose, todosProdutos, produtoAtual, onSave }) => {
        const [selectedProduto, setSelectedProduto] = useState(produtoAtual || null);

        useEffect(() => {
            setSelectedProduto(produtoAtual);
        }, [produtoAtual]);

        const handleChangeProduto = (event) => {
            const produtoSelecionado = todosProdutos.find(produto => produto.id === parseInt(event.target.value));
            setSelectedProduto(produtoSelecionado);
        };

        const handleSave = async () => {
            if (!selectedProduto) {
                toast.error('Nenhum produto selecionado.');
                return;
            }
            await atualizarProduto(selectedProduto);
        };

        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Editar Recomendação do Dia</DialogTitle>
                <DialogContent>
                    {todosProdutos.length === 0 ? (
                        <div>Carregando produtos...</div>
                    ) : (
                        <TextField
                            select
                            value={selectedProduto?.id || ''}
                            onChange={handleChangeProduto}
                            fullWidth
                            margin="dense"
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="">Selecione um produto</option>
                            {todosProdutos.map((produto) => (
                                <option key={produto.id} value={produto.id}>
                                    {`${produto.nome} - ${produto.marca.nome} (R$ ${produto.preco?.toFixed(2)})`}
                                </option>
                            ))}
                        </TextField>
                    )}
                    <Button 
                        onClick={handleSave} 
                        color="primary" 
                        variant="contained" 
                        fullWidth 
                        disabled={!selectedProduto}
                        style={{ marginTop: '10px' }}
                    >
                        Atualizar Recomendação
                    </Button>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <>
            <HeaderGerenciamento />
            <BotaoVoltarGerenciamento />

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
                                {produtos.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                                            Carregando produtos recomendados...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    produtos.map(produto => (
                                        <TableRow key={produto.id} className='tabela-row'>
                                            <TableCell className='tabela-cell'>{produto.nome}</TableCell>
                                            <TableCell className='tabela-cell'>{produto.marca?.nome || 'N/A'}</TableCell>
                                            <TableCell className='tabela-cell'>
                                                {typeof produto.preco === 'number' 
                                                    ? produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
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
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            <ModalEditarProduto
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                todosProdutos={todosProdutos}
                produtoAtual={produtoRecomendado}
                onSave={atualizarProduto} // Passando a função `atualizarProduto` como prop
            />
        </>
    );
};

export default Recomendacao;
