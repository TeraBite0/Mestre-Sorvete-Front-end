import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import './recomendacoes.css';
import TableContainer from '@mui/material/TableContainer';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import HeaderGerenciamento from '../../../Components/HeaderGerenciamento';
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import ModalGerenciamento from '../../../Components/ModalGerenciamento';

const Recomendacao = () => {
    const [produtos, setProdutos] = useState([]);
    const [erro, setErro] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); 
    const [selectedProduto, setSelectedProduto] = useState(null); 

    useEffect(() => {
        const mockProdutos = [
            { id: 1, nome: 'Uvinha', marca: 'Bulldogs', preco: 'R$' + 10.0},
        ];
        setProdutos(mockProdutos);  
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
                        <Table arial-label="Tabela">
                            <TableHead className='tabela-Head'>
                                <TableRow>
                                    <TableCell className='tabela-head-cell'>Nome</TableCell>
                                    <TableCell className='tabela-head-cell'>Marca</TableCell>
                                    <TableCell className='tabela-head-cell'>Preço</TableCell>
                                    <TableCell className='tabela-head-cell'>Editar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {produtos.map(produto => (
                                    <TableRow key={produto.id} className='tabela-row'>
                                        <TableCell className='tabela-cell'>{produto.nome}</TableCell>
                                        <TableCell className='tabela-cell'>{produto.marca}</TableCell>
                                        <TableCell className='tabela-cell'>{produto.preco}</TableCell>
                                        <TableCell className='tabela-cell'>
                                            <button onClick={() => handleEditClick(produto)}><EditIcon /></button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            {selectedProduto && (
                <ModalGerenciamento
                    open={modalOpen}
                    onClose={handleCloseModal}
                    title={`Editar ${selectedProduto.nome}`}
                    fields={[
                        { label: 'Nome do Produto', type: 'text', defaultValue: selectedProduto.nome },
                        { label: 'Marca', type: 'text', defaultValue: selectedProduto.marca },
                        { label: 'Preço', type: 'number', defaultValue: selectedProduto.preco }
                    ]}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

export default Recomendacao;
