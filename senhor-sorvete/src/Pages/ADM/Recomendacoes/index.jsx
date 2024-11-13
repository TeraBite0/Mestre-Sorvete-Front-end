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
    const [todosProdutos, setTodosProdutos] = useState([]); // Estado para armazenar todos os produtos disponíveis
    const [erro, setErro] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); 
    const [selectedProduto, setSelectedProduto] = useState(null); 

    useEffect(() => {
        // Busca dos produtos recomendados do dia
        axios.get('http://localhost:8080/produtos/recomendacao-do-dia')
            .then(response => {
                console.log("Produtos recomendados:", response.data);  // Verifique o que está sendo retornado
                const produtosData = Array.isArray(response.data) ? response.data : [];
                setProdutos(produtosData);
            })
            .catch(error => {
                setErro('Erro ao carregar produtos.');
                console.error("Erro na requisição:", error);
            });
    
        // Busca de todos os produtos disponíveis para exibir na seleção
        const token = sessionStorage.getItem('token');
        axios.get('http://localhost:8080/produtos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log("Todos os produtos carregados:", response.data);  // Verifique os produtos carregados
            setTodosProdutos(response.data);
        })
        .catch(error => {
            console.error("Erro ao carregar todos os produtos:", error);
        });
    }, []);
    

    const handleEditClick = (produto) => {
        setSelectedProduto(produto);
        setModalOpen(true); 
    };

    const atualizarProduto = async () => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.put(`http://localhost:8080/produtos/recomendacao-do-dia/${selectedProduto.id}`, selectedProduto, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Produto atualizado com sucesso!');
            setModalOpen(false);
            setProdutos(produtos.map(prod => prod.id === selectedProduto.id ? selectedProduto : prod));
        } catch (error) {
            toast.error('Erro ao atualizar o produto.');
            console.error("Erro ao atualizar:", error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <div className='header-tabela'>
                <HeaderGerenciamento />
            </div>

            <div className='secao-recomendacoes'>
                <BotaoVoltarGerenciamento />
            </div>

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
                                            <TableCell className='tabela-cell'>{produto.nome}</TableCell>
                                            <TableCell className='tabela-cell'>{produto.marca?.nome || 'N/A'}</TableCell>
                                            <TableCell className='tabela-cell'>{produto.preco}</TableCell>
                                            <TableCell className='tabela-cell'>
                                                <button onClick={() => handleEditClick(produto)}><EditIcon /></button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} style={{ textAlign: 'center' }}>Nenhum produto disponível.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            {selectedProduto && (
                <ModalGerenciamento
                    open={modalOpen}
                    onClose={handleCloseModal}
                    title="Selecionar Novo Produto"
                    fields={[
                        {
                            label: 'Selecione um novo produto',
                            component: (
                                <Autocomplete
                                    options={todosProdutos}
                                    getOptionLabel={(option) => option.nome}
                                    onChange={(event, newValue) => {
                                        console.log("Produto selecionado:", newValue);  // Depuração
                                        setSelectedProduto(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Produto" />}
                                    value={selectedProduto || null}
                                />
                            ),
                        }
                    ]}
                    onSave={atualizarProduto}
                />
            )}
        </>
    );
};

export default Recomendacao;
