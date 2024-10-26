import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import './listarProdutos.css';
import TableContainer from '@mui/material/TableContainer';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import axios from "axios";
import HeaderGerenciamento from '../../../Components/HeaderGerenciamento';
import Pesquisa from '../../../Components/Pesquisa';
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import BotaoGerenciamento from '../../../Components/BotaoGerenciamento';
import { ToastContainer, toast } from 'react-toastify'; // Importa o ToastContainer e a função toast
import 'react-toastify/dist/ReactToastify.css'; // Importa os estilos

const ListarProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [erro, setErro] = useState(null);
    const [open, setOpen] = useState(false); // Estado para controlar abertura do modal
    const [novoProduto, setNovoProduto] = useState({ nome: '', marca: '', preco: '', imagemUrl: '' }); // Estado para os dados do novo produto
    const [produtoSelecionado, setProdutoSelecionado] = useState(null); // Estado para produto em edição
    const [imagemPreview, setImagemPreview] = useState(null); // Estado para mostrar o preview da imagem


    useEffect(() => {
        axios.get('http://localhost:8080/produtos')
        .then(response => {
            setProdutos(response.data);
        })
        .catch(error => {
            toast.error('Erro ao carregar produtos.');
        });
    }, []);

    const handleOpen = () => {
        setNovoProduto({ nome: '', marca: '', preco: '', imagemUrl: '' });
        setImagemPreview(null); // Vai resetar preview
        setProdutoSelecionado(null);
        setOpen(true);
    };

    // Fechar modal
    const handleClose = () => {
        setNovoProduto({ nome: '', marca: '', preco: '', imagemUrl: '' });
        setImagemPreview(null); // Vai resetar preview
        setProdutoSelecionado(null);
        setOpen(false);
    };

    // Atualiza os valores inserido no formulário
    const handleInputChange = (evento) => {
        const { name, value } = evento.target;
        setNovoProduto(prevState => ({ ...prevState, [name]: value }));
    };

    // Lidar com upload de imagem e mostrar preview
    const handleImageUpload = (evento) => {
        const file = evento.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagemPreview(reader.result); // Mostra o preview
                setNovoProduto(prevState => ({ ...prevState, imagemUrl: reader.result })); // Armazena a imagem no estado
            };
            reader.readAsDataURL(file);
        }
    };

    // adicionar ou editar
    const handleSubmit = () => {
        if (produtoSelecionado) {
            // Editar produto
            const produtosAtualizados = produtos.map((produto) =>
                produto.id === produtoSelecionado.id ? { ...produto, ...novoProduto } : produto
            );
            setProdutos(produtosAtualizados);
        } else {
            // Adicionar produto
            const produtoAdicionado = { ...novoProduto, id: produtos.length + 1 };
            setProdutos(prevState => [...prevState, produtoAdicionado]);
        }

        handleClose();
    };

    //  edição de produto
    const handleEdit = (produto) => {
        setProdutoSelecionado(produto);
        setNovoProduto(produto);
        setImagemPreview(produto.imagemUrl); // Exibir imagem atual no preview
        setOpen(true);
    };

    return (
        <>
            <div className='header-tabela'>
                <HeaderGerenciamento />
            </div>

            <div className='secao-produto'>
                <BotaoVoltarGerenciamento />
            </div>

            <div className='barraPesquisa'>
                <Pesquisa placeholder="Produto, Marca..." />
                <BotaoGerenciamento botao="+ Novo Produto" onClick={handleOpen} />
            </div>

            <div className='tabela-produtos'>
                {erro ? (
                    <p style={{ color: 'red' }}>{erro}</p> // Exibe uma mensagem de erro se houver
                ) : (
                    <TableContainer component={Paper} className='container-tabela'>
                        <Table aria-label="Tabela">
                            <TableHead className='tabela-Head'>
                                <TableRow>
                                    <TableCell className='tabela-head-cell'>Imagem</TableCell>
                                    <TableCell className='tabela-head-cell'>Nome</TableCell>
                                    <TableCell className='tabela-head-cell'>Marca</TableCell>
                                    <TableCell className='tabela-head-cell'>Preço</TableCell>
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
                                        <TableCell className='tabela-cell'>
                                            <button onClick={() => handleEdit(produto)}>
                                                <EditIcon />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle className='tituloModal'>{produtoSelecionado ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="nome"
                        label="Nome do Produto"
                        fullWidth
                        value={novoProduto.nome}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="marca"
                        label="Marca"
                        fullWidth
                        value={novoProduto.marca}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="preco"
                        label="Preço"
                        type="number"
                        fullWidth
                        value={novoProduto.preco}
                        onChange={handleInputChange}
                    />

                    {/* Upload da imagem */}
                    <input
                        accept="image/*"
                        type="file"
                        onChange={handleImageUpload}
                        style={{ marginTop: '10px' }}
                    />

                    {/* Preview da imagem */}
                    {imagemPreview && (
                        <img
                            src={imagemPreview}
                            alt="Preview"
                            style={{ width: '50px', height: '50px', marginTop: '10px' }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button className='botaoModal' onClick={handleClose}>Cancelar</Button>
                    <Button className='botaoModal' onClick={handleSubmit}>{produtoSelecionado ? "Salvar" : "Adicionar"}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ListarProdutos;
