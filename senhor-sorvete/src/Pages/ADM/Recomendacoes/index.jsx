import { Paper, Table, TableBody, TableCell,TableHead, TableRow } from '@mui/material';
import './recomendacoes.css';
import TableContainer from '@mui/material/TableContainer';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import HeaderGerenciamento from '../../../Components/HeaderGerenciamento';
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import ReusableModal from '../../../Components/ModalGerenciamento';

const Recomendacao = () => {
    const [produtos, setProdutos] = useState([]);
    const [erro, setErro] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); 
    const [selectedProduto, setSelectedProduto] = useState(null); 

    // const carregarProdutos = () => {
    //     axios.get('http://localhost:8080/produtos')
    //     .then(resposta => {
    //         setProdutos(resposta.data); // Atualizar a lista de produtos
    //         setErro(null); // Resetar o erro, caso tenha ocorrido antes
    //     })
    //     .catch(error => {
    //         console.error("Erro ao buscar produtos:", error);
    //         setErro("Erro ao carregar produtos. Tente novamente mais tarde."); // Define a mensagem de erro
    //     });
    // };

    // useEffect(() => {
    //     carregarProdutos();
    // }, []);

    useEffect(() => {
        // Dados fictícios para teste
        const mockProdutos = [
            { id: 1, nome: 'Produto 1', marca: 'Marca A', preco: 'R$' + 10.0},
        ];
        setProdutos(mockProdutos);  // Definindo os produtos fictícios no estado
    }, []);

    const handleEditClick = (produto) => {
        setSelectedProduto(produto);
        setModalOpen(true); 
    };

    const handleSave = () => {
       
        setModalOpen(false);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };


            useEffect(() => {
        // Dados fictícios para teste
        const mockProdutos = [
            { id: 1, nome: 'Produto 1', marca: 'Marca A', preco: 10.0, quantidadeEstoque: 10, imagemUrl: 'https://via.placeholder.com/50' },
            { id: 2, nome: 'Produto 2', marca: 'Marca B', preco: 15.0, quantidadeEstoque: 20, imagemUrl: 'https://via.placeholder.com/50' },
            { id: 3, nome: 'Produtooooooo 2', marca: 'Marca C', preco: 15.0, quantidadeEstoque: 20, imagemUrl: 'https://via.placeholder.com/50' }
        ];
        setProdutos(mockProdutos);  // Definindo os produtos fictícios no estado
    }, []);

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
                    <p style={{ color: 'red' }}>{erro}</p> // Exibe uma mensagem de erro se houver
                ) : (
                    <TableContainer component={Paper} className='container-tabela'>
                        <Table arial-label="Tabela">
                        <TableHead className='tabela-Head'>
                            <TableRow>
                                <TableCell className='tabela-head-cell'>Imagem</TableCell>
                                <TableCell className='tabela-head-cell'>Nome</TableCell>
                                <TableCell className='tabela-head-cell'>Marca</TableCell>
                                <TableCell className='tabela-head-cell'>Preço</TableCell>
                                <TableCell className='tabela-head-cell'>Quant.Estoque</TableCell>
                                <TableCell className='tabela-head-cell'>Editar</TableCell>
                            </TableRow>
                        </TableHead>
                            <TableBody>
                                {produtos.map(produto => (
                                    <TableRow key={produto.id} className='tabela-row'>
                                        <TableCell className='tabela-cell'>
                                            <img src={produto.imagemUrl} alt={produto.nome} width="50" height="50" />
                                        </TableCell>
                                        <TableCell className='tabela-cell'>{produto.nome}</TableCell>
                                        <TableCell className='tabela-cell'>{produto.marca}</TableCell>
                                        <TableCell className='tabela-cell'>{produto.preco}</TableCell>
                                        <TableCell className='tabela-cell'>{produto.quantidadeEstoque}</TableCell>
                                        <TableCell className='tabela-cell'>
                                            <button><EditIcon /></button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            {/* Modal para edição do produto */}
            {selectedProduto && (
                <ReusableModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    title={`Editar ${selectedProduto.nome}`}
                    fields={[
                        { label: 'Nome do Produto', type: 'text' },
                        { label: 'Marca', type: 'text' },
                        { label: 'Preço', type: 'number' }
                    ]}
                    onSave={handleSave}
                />
            )}
        </>
    );
}


export default Recomendacao;
