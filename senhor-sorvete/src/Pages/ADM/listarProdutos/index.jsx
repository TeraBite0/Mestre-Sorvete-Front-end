import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import './listarProdutos.css';
import TableContainer from '@mui/material/TableContainer';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import HeaderGerenciamento from '../../../Components/HeaderGerenciamento';
import Pesquisa from '../../../Components/Pesquisa';
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import BotaoGerenciamento from '../../../Components/BotaoGerenciamento';
import { toast } from "react-toastify";

const ListarProdutos = () => {
    const [rows, setRows] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [open, setOpen] = useState(false);
    const [novoProduto, setNovoProduto] = useState({ nome: '', marca: '', preco: '', imagemUrl: '' });
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [imagemPreview, setImagemPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProdutos = async () => {
            const token = sessionStorage.getItem('token');
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/produtos', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();
                const produtosFormatados = data.map(produto => ({
                    id: produto.id?.toString() || Math.random().toString(),
                    nome: produto.nome || '',
                    marca: produto.marca?.nome || '', // Acessando o nome da marca
                    subtipo: produto.subtipo?.nome || '', // Acessando o nome do subtipo
                    preco: typeof produto.preco === 'number' ? produto.preco : 0,
                    imagemUrl: produto.imagemUrl || ''
                }));
                setRows(produtosFormatados);
            } catch {
                toast.error("Erro ao carregar os produtos");
            } finally {
                setLoading(false);
            }
        };

        fetchProdutos();
    }, []);


    const buscarProdutos = rows.filter(produto =>
        produto.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        produto.marca.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const handleOpen = () => {
        setNovoProduto({ nome: '', marca: '', preco: '', imagemUrl: '' });
        setImagemPreview(null);
        setProdutoSelecionado(null);
        setOpen(true);
    };

    const handleClose = () => {
        setNovoProduto({ nome: '', marca: '', preco: '', imagemUrl: '' });
        setImagemPreview(null);
        setProdutoSelecionado(null);
        setOpen(false);
    };

    const handleInputChange = (evento) => {
        const { name, value } = evento.target;
        setNovoProduto(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageUpload = (evento) => {
        const file = evento.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagemPreview(reader.result);
                setNovoProduto(prevState => ({ ...prevState, imagemUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (produtoSelecionado) {
            const produtosAtualizados = rows.map(produto =>
                produto.id === produtoSelecionado.id ? { ...produto, ...novoProduto } : produto
            );
            setRows(produtosAtualizados);
        } else {
            const produtoAdicionado = { ...novoProduto, id: rows.length + 1 };
            setRows(prevState => [...prevState, produtoAdicionado]);
        }
        handleClose();
    };


    const handleEdit = (produto) => {
        setProdutoSelecionado(produto);
        setNovoProduto(produto);
        setImagemPreview(produto.imagemUrl);
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
                <Pesquisa
                    placeholder="Produto, Marca..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                />
                <BotaoGerenciamento botao="+ Novo Produto" onClick={handleOpen} />
            </div>

            <div className='tabela-produtos'>
                <TableContainer component={Paper} className='container-tabela'>
                <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
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
                            {buscarProdutos.map(produto => (
                                <TableRow key={produto.id} className='tabela-row'>
                                    <TableCell>
                                        <img src={produto.imagemUrl} alt={produto.nome} width="35" height="35" />
                                    </TableCell>
                                    <TableCell >{produto.nome}</TableCell>
                                    <TableCell >{produto.marca}</TableCell>
                                    <TableCell >R$ {produto.preco}</TableCell>
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
                    <input
                        accept="image/*"
                        type="file"
                        onChange={handleImageUpload}
                        style={{ marginTop: '10px' }}
                    />
                    {imagemPreview && (
                        <img
                            src={imagemPreview}
                            alt="Preview"
                            style={{ width: '35px', height: '35px', marginTop: '10px' }}
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
