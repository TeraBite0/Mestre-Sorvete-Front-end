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

const ListarProdutos = () => {
    const [produtos, setProdutos] = useState([
        { id: 1, nome: "Sorvete Limão", marca: "Marca A", preco: "20.00", imagemUrl: "/Imagens/sorvete-baunilha.jpg" },
        { id: 2, nome: "Sorvete Napolitano", marca: "Marca B", preco: "25.00", imagemUrl: "/Imagens/picoles-napolitanos.png" },
        { id: 3, nome: "Sorvete Chocolate", marca: "Marca C", preco: "16.00", imagemUrl: "/Imagens/casquinhas-de-chocolate.jpeg" }
    ]);

    const [pesquisa, setPesquisa] = useState('');
    const [open, setOpen] = useState(false);
    const [novoProduto, setNovoProduto] = useState({ nome: '', marca: '', preco: '', imagemUrl: '' });
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [imagemPreview, setImagemPreview] = useState(null);

    // Filtro de produtos baseado na pesquisa
    const buscarProdutos = produtos.filter(produto => {
        const nomeInclusao = produto.nome.toLowerCase().includes(pesquisa.trim().toLowerCase());
        const marcaInclusao = produto.marca.toLowerCase().includes(pesquisa.trim().toLowerCase());
        console.log(`Nome: ${produto.nome}, Marca: ${produto.marca}, Pesquisa: ${pesquisa}, Nome Inclusão: ${nomeInclusao}, Marca Inclusão: ${marcaInclusao}`);
        return nomeInclusao || marcaInclusao;
    });
    

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
            const produtosAtualizados = produtos.map((produto) =>
                produto.id === produtoSelecionado.id ? { ...produto, ...novoProduto } : produto
            );
            setProdutos(produtosAtualizados);
        } else {
            const produtoAdicionado = { ...novoProduto, id: produtos.length + 1 };
            setProdutos(prevState => [...prevState, produtoAdicionado]);
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
                            {buscarProdutos.map(produto => (
                                <TableRow key={produto.nome} className='tabela-row'>
                                    <TableCell className='tabela-cell'>
                                        <img src={produto.imagemUrl} alt={produto.nome} width="35" height="35" />
                                    </TableCell>
                                    <TableCell className='tabela-cell'>{produto.nome}</TableCell>
                                    <TableCell className='tabela-cell'>{produto.marca}</TableCell>
                                    <TableCell className='tabela-cell'>R$ {produto.preco}</TableCell>
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
