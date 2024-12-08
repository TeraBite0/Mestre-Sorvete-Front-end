import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Select, InputAdornment } from '@mui/material';
import './listarProdutos.css';
import TableContainer from '@mui/material/TableContainer';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import HeaderGerenciamento from '../../../Components/HeaderGerenciamento';
import Pesquisa from '../../../Components/Pesquisa';
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import BotaoGerenciamento from '../../../Components/BotaoGerenciamento';
import { toast } from "react-toastify";
import axios from 'axios';

const ListarProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        marca: '',
        subtipo: '',
        preco: '',
        imagemUrl: ''
    });
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [imagemPreview, setImagemPreview] = useState(null);
    const [arquivoImagem, setArquivoImagem] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erros, setErros] = useState({});
    const [marcas, setMarcas] = useState([]);
    const [subtipos, setSubtipos] = useState([]);
    const [modalNovaMarcaAberto, setModalNovaMarcaAberto] = useState(false);
    const [modalNovoSubtipoAberto, setModalNovoSubtipoAberto] = useState(false);
    const [novaMarca, setNovaMarca] = useState('');
    const [novoSubtipo, setNovoSubtipo] = useState('');

    useEffect(() => {
        buscarProdutos();
    }, []);

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

            // Extrair marcas únicas
            const marcasUnicas = [...new Set(
                dados
                    .map(produto => produto.marca?.nome)
                    .filter(marca => marca)
            )];

            // Extrair subtipos únicos
            const subtiposUnicos = [...new Set(
                dados
                    .map(produto => produto.subtipo?.nome)
                    .filter(subtipo => subtipo)
            )];

            const marcasFormatadas = marcasUnicas.map(nome => ({ nome }));
            const subtiposFormatados = subtiposUnicos.map(nome => ({ nome }));

            const produtosFormatados = dados.map(produto => ({
                id: produto.id?.toString() || Math.random().toString(),
                nome: produto.nome || '',
                marca: produto.marca?.nome || '',
                subtipo: produto.subtipo?.nome || '',
                preco: typeof produto.preco === 'number' ? produto.preco : 0,
                imagemUrl: "https://terabite.blob.core.windows.net/terabite-container/" + produto.id || ''
            }));

            setProdutos(produtosFormatados);
            setMarcas(marcasFormatadas);
            setSubtipos(subtiposFormatados);
        } catch (erro) {
            toast.error("Erro ao carregar os produtos: " + erro.message);
        } finally {
            setCarregando(false);
        }
    };

    const adicionarNovaMarca = () => {
        if (!novaMarca.trim()) {
            toast.error("O nome da marca não pode ser vazio");
            return;
        }

        // Verifica se a marca já existe
        if (marcas.some(marca => marca.nome.toLowerCase() === novaMarca.trim().toLowerCase())) {
            toast.error("Esta marca já existe");
            return;
        }

        const novaMarcaFormatada = { nome: novaMarca.trim() };
        setMarcas([...marcas, novaMarcaFormatada]);
        setNovoProduto(prev => ({ ...prev, marca: novaMarca.trim() }));
        setModalNovaMarcaAberto(false);
        setNovaMarca('');
        toast.success('Marca adicionada com sucesso!');
    };

    const obterTokenSAS = async () => {
        try {
            const token = sessionStorage.getItem('token');

            if (!token) {
                throw new Error('Token não encontrado');
            }

            const resposta = await fetch('http://localhost:8080/azure', {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!resposta.ok) {
                const errorBody = await resposta.text();
                throw new Error(`Falha ao obter token SAS: ${resposta.status} ${errorBody}`);
            }

            // Parse o token SAS como JSON se ele for retornado como JSON
            const tokenSAS = await resposta.json();
            return tokenSAS.sasToken; // Acesse o token SAS correto
        } catch (erro) {
            console.error('Erro ao obter token SAS:', erro);
            throw erro;
        }
    };

    const enviarImagemParaAzure = async (arquivo, identificador) => {
        try {
            console.group('Upload de Imagem');

            // Obtain SAS token
            const tokenSAS = await obterTokenSAS();

            // Robust token validation
            if (!tokenSAS || typeof tokenSAS !== 'string') {
                throw new Error('Token SAS inválido');
            }

            // Ensure token starts with '?'
            const sasToken = tokenSAS.startsWith('?') ? tokenSAS : `?${tokenSAS}`;

            // Generate unique filename
            const nomeArquivo = `produto-${identificador}-${Date.now()}-${encodeURIComponent(arquivo.name)}`;

            // Construct full upload URL - Note the separation between filename and SAS token
            const urlUpload = `https://terabite.blob.core.windows.net/terabite-container/${nomeArquivo}${sasToken}`;

            console.log('URL de Upload:', urlUpload);
            console.log('Tipo de Arquivo:', arquivo.type);

            // Perform upload
            const uploadResposta = await fetch(urlUpload, {
                method: 'PUT',
                headers: {
                    'x-ms-blob-type': 'BlockBlob',
                    'Content-Type': arquivo.type || 'application/octet-stream'
                },
                body: arquivo
            });

            console.log('Status do Upload:', uploadResposta.status);

            // Check upload response
            if (!uploadResposta.ok) {
                const errorText = await uploadResposta.text();
                throw new Error(`Upload falhou: ${uploadResposta.status} - ${errorText}`);
            }

            // Construct and return image URL
            const urlImagem = `https://terabite.blob.core.windows.net/terabite-container/${encodeURIComponent(nomeArquivo)}`;

            console.log('URL da Imagem:', urlImagem);
            console.groupEnd();

            return urlImagem;
        } catch (erro) {
            console.error('Erro no Upload:', erro);
            console.groupEnd();
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

    const handleInputChange = (evento) => {
        const { name, value } = evento.target;

        // Verifica se o campo é 'preco'
        if (name === 'preco') {
            // Remove todos os caracteres não numéricos
            const numeroLimpo = value.replace(/[^\d]/g, '');

            // Divide por 100 para considerar casas decimais
            const valorFormatado = (Number(numeroLimpo) / 100).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

            setNovoProduto(anterior => ({
                ...anterior,
                [name]: valorFormatado
            }));
        } else {
            setNovoProduto(anterior => ({
                ...anterior,
                [name]: value
            }));
        }

        // Limpa erro se existir
        if (erros[name]) {
            setErros(anterior => ({
                ...anterior,
                [name]: ''
            }));
        }
    };


    const handleImagemUpload = (evento) => {
        const arquivo = evento.target.files[0];
        if (arquivo) {
            // Validações existentes
            if (arquivo.size > 5000000) {
                toast.error("Arquivo muito grande. Máximo 5MB.");
                return;
            }

            if (!arquivo.type.startsWith('image/')) {
                toast.error("Por favor, selecione apenas arquivos de imagem.");
                return;
            }

            // Definir o arquivo 
            setArquivoImagem(arquivo);

            // Usar try-catch para lidar com erros de leitura
            try {
                const leitor = new FileReader();

                leitor.onload = (e) => {
                    console.log('Imagem carregada:', e.target.result); // Log para debug
                    setImagemPreview(e.target.result);
                };

                leitor.onerror = (error) => {
                    console.error('Erro ao ler arquivo:', error);
                    toast.error('Erro ao carregar imagem');
                };

                leitor.readAsDataURL(arquivo);
            } catch (error) {
                console.error('Erro inesperado:', error);
                toast.error('Erro ao processar imagem');
            }

            // Limpar erros de imagem
            if (erros.imagem) {
                setErros(anterior => ({ ...anterior, imagem: '' }));
            }
        }
    };

    // Função para formatar o preço de forma segura
    const formatarPreco = (preco) => {
        // Remove espaços em branco
        let precoLimpo = preco.toString().trim();

        // Substitui vírgula por ponto
        precoLimpo = precoLimpo.replace(',', '.');

        // Converte para número de ponto flutuante
        const precoFormatado = parseFloat(precoLimpo);

        // Verifica se é um número válido
        if (isNaN(precoFormatado)) {
            throw new Error('Preço inválido');
        }

        // Arredonda para 2 casas decimais
        return Number(precoFormatado.toFixed(2));
    };

    const validarFormulario = () => {
        const novosErros = {};

        if (!novoProduto.nome?.trim()) {
            novosErros.nome = 'Nome é obrigatório';
        }
        if (!novoProduto.marca?.trim()) {
            novosErros.marca = 'Marca é obrigatória';
        }
        if (!novoProduto.subtipo?.trim()) {
            novosErros.subtipo = 'Subtipo é obrigatório';
        }

        try {
            formatarPreco(novoProduto.preco);
        } catch (erro) {
            novosErros.preco = 'Formato de preço inválido';
        }

        if (!arquivoImagem && !novoProduto.imagemUrl) {
            novosErros.imagem = 'Imagem é obrigatória';
        }

        console.log('Erros de validação:', novosErros); // Adicione este log para identificar os erros
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };


    const adicionarNovoProduto = async () => {
        console.log('Iniciando processo de adicionar/atualizar produto...');
        if (!validarFormulario()) {
            console.log('Validação do formulário falhou');
            return;
        }

        try {
            setCarregando(true);

            let urlImagem = novoProduto.imagemUrl;

            if (arquivoImagem) {
                try {
                    console.log('Enviando imagem para Azure...');
                    urlImagem = await enviarImagemParaAzure(arquivoImagem, produtoSelecionado?.id || Math.random().toString());
                    console.log('Imagem enviada com sucesso:', urlImagem);
                } catch (erro) {
                    console.error('Erro ao enviar imagem para Azure:', erro);
                    toast.error("Falha no upload da imagem. Usando imagem anterior.");
                    if (!novoProduto.imagemUrl) {
                        toast.error("Não há imagem anterior disponível.");
                        return;
                    }
                }
            }

            const token = sessionStorage.getItem('token');
            console.log('Token obtido:', token);

            const dadosProduto = {
                nome: novoProduto.nome,
                nomeSubtipo: novoProduto.subtipo,
                nomeMarca: novoProduto.marca,
                preco: formatarPreco(novoProduto.preco),
                imagemUrl: urlImagem
            };

            console.log('Dados do produto formatados:', dadosProduto);

            const url = produtoSelecionado
                ? `http://localhost:8080/produtos/${produtoSelecionado.id}`
                : 'http://localhost:8080/produtos';

            const metodo = produtoSelecionado ? 'PUT' : 'POST';

            console.log('Enviando requisição para a API:', { url, metodo });

            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosProduto)
            });

            if (!resposta.ok) {
                const errorBody = await resposta.text();
                console.error('Erro na resposta da API:', errorBody);
                throw new Error(`Erro ao salvar produto: ${errorBody}`);
            }

            const dadosAtualizados = await resposta.json();
            console.log('Resposta da API recebida:', dadosAtualizados);

            if (produtoSelecionado) {
                // Lógica de atualização existente
                setProdutos(produtos.map(produto =>
                    produto.id === produtoSelecionado.id ? {
                        id: dadosAtualizados.id?.toString() || produto.id,
                        nome: dadosAtualizados.nome || produto.nome,
                        marca: dadosAtualizados.marca?.nome || produto.marca,
                        subtipo: dadosAtualizados.subtipo?.nome || produto.subtipo,
                        preco: dadosAtualizados.preco || produto.preco,
                        imagemUrl: dadosAtualizados.id
                            ? `https://terabite.blob.core.windows.net/terabite-container/${dadosAtualizados.id}`
                            : produto.imagemUrl
                    } : produto
                ));
            } else {
                const novoProdutoFormatado = {
                    id: dadosAtualizados.id?.toString() || Math.random().toString(),
                    nome: dadosAtualizados.nome || '',
                    marca: dadosAtualizados.marca?.nome || '',
                    subtipo: dadosAtualizados.subtipo?.nome || '',
                    preco: dadosAtualizados.preco || 0,
                    imagemUrl: urlImagem  // Use a URL completa gerada no upload
                };
                // Adiciona o novo produto no início da lista
                setProdutos([novoProdutoFormatado, ...produtos]);
            }

            toast.success(produtoSelecionado ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
            fecharModal();
        } catch (erro) {
            console.error('Erro ao salvar o produto:', erro);
            toast.error(erro.message || 'Erro ao salvar o produto.');
        } finally {
            setCarregando(false);
        }
    };


    const handleEditar = (produto) => {
        setProdutoSelecionado(produto);
        setNovoProduto({ 
            ...produto, 
            marca: produto.marca 
        });
        // Use a URL completa da imagem
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
                <TableContainer
                    component={Paper}
                    className='container-tabela'
                    sx={{
                        maxHeight: '60vh',  // altura máxima
                        overflow: 'auto'
                    }}
                >
                    <Table
                        sx={{
                            width: '100%',
                            '& .MuiTableCell-root': {
                                padding: '8px', // Reduz o padding das células
                            },
                            '& .MuiTableCell-root:last-child': {
                                width: '60px', // Ajusta a largura da última coluna (Editar)
                            }
                        }}
                        size="small"
                        aria-label="tabela de produtos"
                    >
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
                            {produtos.filter(produto => produto && typeof produto === 'object').map(produto => (
                                <TableRow key={produto.id} className='tabela-row-vendas'>
                                    <TableCell className='tabela-row-vendas'>
                                        <img
                                            src={produto.imagemUrl}
                                            alt={produto.nome}
                                            width="35"
                                            height="35"
                                        />
                                    </TableCell>
                                    <TableCell className='tabela-row-vendas'>{produto.nome}</TableCell>
                                    <TableCell className='tabela-row-vendas'>{produto.marca}</TableCell>
                                    <TableCell className='tabela-row-vendas'>R$ {produto.preco}</TableCell>
                                    <TableCell className='tabela-row-vendas'>
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
                    <Select
                        autoFocus
                        margin="dense"
                        name='marca'
                        label="Marca"
                        fullWidth
                        value={novoProduto.marca || ''}
                        onChange={handleInputChange}
                        error={!!erros.marca}
                        displayEmpty
                        renderValue={(selected) => selected || 'Selecione uma marca'}
                    >
                        {marcas.map((marca, index) => (
                            <MenuItem key={index} value={marca.nome}>
                                {marca.nome}
                            </MenuItem>
                        ))}
                        <MenuItem onClick={() => setModalNovaMarcaAberto(true)}>
                            + Adicionar Nova Marca
                        </MenuItem>
                    </Select>
                    {erros.marca && (
                        <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px' }}>
                            {erros.marca}
                        </div>
                    )}
                    <Select
                        autoFocus
                        margin="dense"
                        label="Subtipo"
                        fullWidth
                        value={novoProduto.subtipo || ''}
                        onChange={(e) => setNovoProduto(prev => ({ ...prev, subtipo: e.target.value }))}
                        error={!!erros.subtipo}
                        displayEmpty
                        renderValue={(selected) => selected || 'Selecione um subtipo'}
                    >
                        {subtipos.map((subtipo, index) => (
                            <MenuItem key={index} value={subtipo.nome}>
                                {subtipo.nome}
                            </MenuItem>
                        ))}
                        <MenuItem onClick={() => setModalNovoSubtipoAberto(true)}>
                            + Adicionar Novo Subtipo
                        </MenuItem>
                    </Select>
                    {erros.subtipo && (
                        <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px' }}>
                            {erros.subtipo}
                        </div>
                    )}

                    <TextField
                        margin="dense"
                        name="preco"
                        label="Preço"
                        type="text"
                        fullWidth
                        value={novoProduto.preco}
                        onChange={handleInputChange}
                        error={!!erros.preco}
                        helperText={erros.preco}
                        inputProps={{
                            min: "0",

                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">R$</InputAdornment>
                            ),
                        }}
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

            <Dialog open={modalNovaMarcaAberto} onClose={() => setModalNovaMarcaAberto(false)}>
                <DialogTitle>Adicionar Nova Marca</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nome da Marca"
                        fullWidth
                        value={novaMarca}
                        onChange={(e) => setNovaMarca(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button className='botaoModal' onClick={() => setModalNovaMarcaAberto(false)}>Cancelar</Button>
                    <Button className='botaoModal' onClick={adicionarNovaMarca}>Adicionar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ListarProdutos;