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
    const [produtos, setProdutos] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [novoProduto, setNovoProduto] = useState({ nome: '', marca: '', preco: '', imagemUrl: '' });
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [imagemPreview, setImagemPreview] = useState(null);
    const [arquivoImagem, setArquivoImagem] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erros, setErros] = useState({});

    useEffect(() => {
        buscarProdutos();
    }, []);

    const validarFormulario = () => {
        const novosErros = {};
        if (!novoProduto.nome.trim()) {
            novosErros.nome = 'Nome é obrigatório';
        }
        if (!novoProduto.marca.trim()) {
            novosErros.marca = 'Marca é obrigatória';
        }
        if (!novoProduto.preco || novoProduto.preco <= 0) {
            novosErros.preco = 'Preço deve ser maior que zero';
        }
        if (!arquivoImagem && !novoProduto.imagemUrl) {
            novosErros.imagem = 'Imagem é obrigatória';
        }
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const buscarProdutos = async () => {
        const token = sessionStorage.getItem('token');
        setCarregando(true);
        try {
            const resposta = await fetch('http://localhost:8080/produtos', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!resposta.ok) throw new Error('Falha ao carregar produtos');

            const dados = await resposta.json();
            const produtosFormatados = dados.map(produto => ({
                id: produto.id?.toString() || Math.random().toString(),
                nome: produto.nome || '',
                marca: produto.marca?.nome || '',
                subtipo: produto.subtipo?.nome || '',
                preco: typeof produto.preco === 'number' ? produto.preco : 0,
                imagemUrl: "https://terabite.blob.core.windows.net/terabite-container/" + produto.id || ''
            }));
            setProdutos(produtosFormatados);
        } catch (erro) {
            toast.error("Erro ao carregar os produtos: " + erro.message);
        } finally {
            setCarregando(false);
        }
    };

    const obterTokenSasAzure = async () => {
        const token = sessionStorage.getItem('token');
        const resposta = await fetch('http://localhost:8080/azure', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            return dados.sasToken;
        }
    };

    const enviarImagemParaAzure = async (arquivo, produtoId) => {
        try {
            const tokenSaS = await obterTokenSasAzure();
            const nomeArquivo = `${produtoId}`;
            const sasUrl = `https://terabite.blob.core.windows.net/terabite-container/${nomeArquivo}?${tokenSaS}`;
            const urlUpload = `${sasUrl}/`;

            const resposta = await fetch(sasUrl, {
                method: 'PUT',
                headers: {
                    'x-ms-blob-type': 'BlockBlob',
                    'Content-Type': arquivo.type
                },
                body: arquivo
            });

            if (!resposta.ok) {
                throw new Error('Erro ao fazer upload da imagem');
            }

            return urlUpload.split('?')[0];
        } catch (erro) {
            toast.error("Tente novamente mais tarde");
            throw erro;
        }
    };

    const filtroPesquisa = async (termo) => {
        const token = sessionStorage.getItem('token');
        setCarregando(true);

        try {
            // Normalizar e remover acentos antes de enviar
            const termoNormalizado = termo.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const response = await fetch(`http://localhost:8080/produtos/filtrar-nome-marca?termo=${termoNormalizado}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                toast.error("Erro ao pesquisar");
                return;
            }

            const dados = await response.json();
            const produtosFormatados = dados.map(produto => ({
                id: produto.id?.toString() || Math.random().toString(),
                nome: produto.nome || '',
                marca: produto.marca?.nome || '',
                subtipo: produto.subtipo?.nome || '',
                preco: typeof produto.preco === 'number' ? produto.preco : 0,
                imagemUrl: "https://terabite.blob.core.windows.net/terabite-container/" + produto.id || ''
            }));
            setProdutos(produtosFormatados);
        } catch (erro) {
            toast.error("Erro ao pesquisar produtos");
        } finally {
            setCarregando(false);
        }
    };


    const abrirModal = () => {
        setNovoProduto({ nome: '', marca: '', preco: '', imagemUrl: '' });
        setImagemPreview(null);
        setArquivoImagem(null);
        setProdutoSelecionado(null);
        setErros({});
        setModalAberto(true);
    };

    const fecharModal = () => {
        setNovoProduto({ nome: '', marca: '', preco: '', imagemUrl: '' });
        setImagemPreview(null);
        setArquivoImagem(null);
        setProdutoSelecionado(null);
        setErros({});
        setModalAberto(false);
    };

    const handleInputChange = (evento) => { // Gerenciar a mudança dos campos dos formulários
        const { name, value } = evento.target;
        setNovoProduto(anterior => ({ ...anterior, [name]: value }));
        if (erros[name]) {
            setErros(anterior => ({ ...anterior, [name]: '' }));
        }
    };

    const handleImagemUpload = (evento) => {
        const arquivo = evento.target.files[0];
        if (arquivo) {
            if (arquivo.size > 5000000) { // Limite de 5MB
                toast.error("Arquivo muito grande. Máximo 5MB.");
                return;
            }

            if (!arquivo.type.startsWith('image/')) {
                toast.error("Por favor, selecione apenas arquivos de imagem.");
                return;
            }

            setArquivoImagem(arquivo);

            const leitor = new FileReader();
            leitor.onloadend = () => {
                setImagemPreview(leitor.result);
            };
            leitor.readAsDataURL(arquivo);

            // Limpa erro de imagem se existir
            if (erros.imagem) {
                setErros(anterior => ({ ...anterior, imagem: '' }));
            }
        }
    };

    const adicionarNovoProduto = async () => {
        if (!validarFormulario()) return;

        try {
            setCarregando(true);
            let urlImagem = novoProduto.imagemUrl;

            if (arquivoImagem) {
                urlImagem = await enviarImagemParaAzure(arquivoImagem, produtoSelecionado.id);
            }

            const token = sessionStorage.getItem('token');
            const dadosProduto = {
                ...novoProduto,
                imagemUrl: urlImagem
            };

            const url = produtoSelecionado
                ? `http://localhost:8080/produtos/${produtoSelecionado.id}`
                : 'http://localhost:8080/produtos';

            const metodo = produtoSelecionado ? 'PUT' : 'POST';

            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosProduto)
            });

            if (!resposta.ok) {
                throw new Error('Erro ao salvar produto');
            }

            toast.success(produtoSelecionado ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');

            const dadosAtualizados = await resposta.json();
            if (produtoSelecionado) {
                setProdutos(produtos.map(produto =>
                    produto.id === produtoSelecionado.id ? dadosAtualizados : produto
                ));
            } else {
                setProdutos([...produtos, dadosAtualizados]);
            }

            fecharModal();
        } catch (erro) {
            toast.error(erro.message);
        } finally {
            setCarregando(false);
        }
    };

    const handleEditar = (produto) => {
        setProdutoSelecionado(produto);
        setNovoProduto(produto);
        setImagemPreview(produto.imagemUrl);
        setModalAberto(true);
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
                    onChange={(e) => {
                        setPesquisa(e.target.value);
                        filtroPesquisa(e.target.value);
                    }}
                />
                <BotaoGerenciamento botao="+ Novo Produto" onClick={abrirModal} />
            </div>

            <div className='tabela-produtos'>
                <TableContainer component={Paper} className='container-tabela'>
                    <Table sx={{ minWidth: 500 }} size="small" aria-label="tabela de produtos">
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
                                    <TableCell>
                                        <img src={produto.imagemUrl} alt={produto.nome} width="35" height="35" />
                                    </TableCell>
                                    <TableCell>{produto.nome}</TableCell>
                                    <TableCell>{produto.marca}</TableCell>
                                    <TableCell>R$ {produto.preco}</TableCell>
                                    <TableCell className='tabela-cell'>
                                        <button onClick={() => handleEditar(produto)}>
                                            <EditIcon />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Dialog open={modalAberto} onClose={fecharModal}>
                <DialogTitle className='tituloModal'>
                    {produtoSelecionado ? "Editar Produto" : "Adicionar Produto"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="nome"
                        label="Nome do Produto"
                        fullWidth
                        value={novoProduto.nome}
                        onChange={handleInputChange}
                        error={!!erros.nome}
                        helperText={erros.nome}
                    />
                    <TextField
                        margin="dense"
                        name="marca"
                        label="Marca"
                        fullWidth
                        value={novoProduto.marca}
                        onChange={handleInputChange}
                        error={!!erros.marca}
                        helperText={erros.marca}
                    />
                    <TextField
                        margin="dense"
                        name="preco"
                        label="Preço"
                        type="number"
                        fullWidth
                        value={novoProduto.preco}
                        onChange={handleInputChange}
                        error={!!erros.preco}
                        helperText={erros.preco}
                    />
                    <input
                        accept="image/*"
                        type="file"
                        onChange={handleImagemUpload}
                        style={{ marginTop: '10px' }}
                    />
                    {erros.imagem && (
                        <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px' }}>
                            {erros.imagem}
                        </div>
                    )}
                    {imagemPreview && (
                        <div style={{ marginTop: '10px' }}>
                            <img
                                src={imagemPreview}
                                alt="Pré-visualização"
                                style={{ width: '35px', height: '35px' }}
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        className='botaoModal'
                        onClick={fecharModal}
                        disabled={carregando}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className='botaoModal'
                        onClick={adicionarNovoProduto}
                        disabled={carregando}
                    >
                        {carregando ? 'Salvando...' : (produtoSelecionado ? "Salvar" : "Adicionar")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ListarProdutos;