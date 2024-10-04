import { Paper, Table, TableBody, TableCell, TableRow } from '@mui/material';
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

    return(
        <>
            <div className='header-tabela'>
                <HeaderGerenciamento/>     
            </div>

            <div className='titulo-recomendar'>
                <BotaoVoltarGerenciamento
                    pagina="Recomendação do dia"
                />
            </div>

            <div className='tabela-recomendacao'>
                {erro ? (
                    <p style={{ color: 'red' }}>{erro}</p> 
                ) : (
                    <TableContainer component={Paper} className='table-container'>
                        <Table arial-label="produto-dia">
                            <TableBody>
                                {produtos.map(produto => (
                                    <TableRow key={produto.id} className='tabela-dia'>
                                        <TableCell className='tabela-objeto'>{produto.nome}</TableCell>
                                        <TableCell className='tabela-objeto'>{produto.marca}</TableCell>
                                        <TableCell className='tabela-objeto'>{produto.preco}</TableCell>
                                        <TableCell className='tabela-objeto'>
                                            <button onClick={() => handleEditClick(produto)}>
                                                <EditIcon/>
                                            </button>
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
