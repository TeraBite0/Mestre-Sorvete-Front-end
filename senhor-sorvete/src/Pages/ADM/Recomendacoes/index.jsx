import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    InputAdornment,
    Autocomplete,
    Checkbox,

} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import "./recomendacoes.css";
import TableContainer from "@mui/material/TableContainer";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from "react";
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from "../../../Components/BotaoVoltarGerenciamento";
import { toast } from "react-toastify";

const Recomendacoes = () => {
    const [produtos, setProdutos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        marca: '',
        subtipo: '', // Inicializar o subtipo, sabendo que ele possui um objeto TIPO
        preco: '',
        tipo: '',
        qtdPorCaixas: '',
        temLactose: false,
        temGluten: false,
    });
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [arquivoImagem, setArquivoImagem] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erros, setErros] = useState({});
    const [marcas, setMarcas] = useState([]);
    const [subtipos, setSubtipos] = useState([]);
    const [modalVisualizarProdutoAberto, setModalVisualizarProdutoAberto] = useState(false);
    const [ setModalNovaMarcaAberto] = useState(false);
    const [ setModalNovoSubtipoAberto] = useState(false);
    const [tipos, setTipos] = useState([]);

    useEffect(() => {
        buscarProdutos();
    }, []);

    const buscarProdutos = async () => {
        const token = sessionStorage.getItem('token');
        setCarregando(true);
        try {
            // Buscar todos os Produtos
            const resposta = await fetch('http://localhost:8080/produtos/recomendacao', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!resposta.ok) throw new Error("Falha ao carregar produtos");

            const dados = await resposta.json();

            const produtosFormatados = dados.map(produto => ({
                id: produto.produto.id || '',
                nome: produto.produto.nome || '',
                marca: produto.produto.marca || '',
                subtipo: produto.produto.subtipo || '',
                tipo: produto.produto.tipo || '',
                preco: typeof produto.produto.preco === 'number' ? produto.produto.preco : 0,
                qtdCaixasEstoque: produto.produto.qtdCaixasEstoque,
                qtdPorCaixas: produto.produto.qtdPorCaixas,
                imagemUrl: "https://terabite.blob.core.windows.net/terabite-container/" + produto.produto.id || '',
                temGluten: produto.produto.temGluten !== null ? produto.produto.temGluten : true,
                temLactose: produto.produto.temLactose !== null ? produto.produto.temLactose : true,
                isAtivo: produto.produto.isAtivo !== null ? produto.produto.isAtivo : true // Garantir que isAtivo seja definido
            }));

            setProdutos(produtosFormatados);
        } catch (erro) {
            toast.error("Erro ao carregar os produtos: " + erro.message);
        } finally {
            setCarregando(false);
        }

    };

    // metodo para fechar modal
    const fecharModal = () => {
        setNovoProduto({ nome: "", marca: "", preco: "", imagemUrl: "" }); 
        setArquivoImagem(null);
        setProdutoSelecionado(null);
        setErros({});
        setModalAberto(false);
        setModalVisualizarProdutoAberto(false);
    };

    const handleImagemUpload = async (evento) => {
        const arquivo = evento.target.files[0];
        if (arquivo) {
            // Validações
            if (arquivo.size > 5000000) {
                toast.error("Arquivo muito grande. Máximo 5MB.");
                return;
            }

            if (!arquivo.type.startsWith("image/")) {
                toast.error("Por favor, selecione apenas arquivos de imagem.");
                return;
            }

            setArquivoImagem(arquivo);

            try {
                const leitor = new FileReader();

                leitor.onload = (e) => {
                    console.log('Imagem carregada:', e.target.result);
                };

                leitor.onerror = (error) => {
                    console.error("Erro ao ler arquivo:", error);
                    toast.error("Erro ao carregar imagem");
                };

                leitor.readAsDataURL(arquivo);
            } catch (error) {
                console.error("Erro inesperado:", error);
                toast.error("Erro ao processar imagem");
            }

            // Limpar erros de imagem
            if (erros.imagem) {
                setErros((anterior) => ({ ...anterior, imagem: "" }));
            }
        }
    };

    const ImagemPreviewComponent = ({
        handleImagemUpload,
        erros,
        imagemPreview
    }) => (
        <>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    id="upload-imagem"
                    accept="image/*"
                    type="file"
                    onChange={handleImagemUpload}
                    style={{ display: 'none' }}
                />
                <label htmlFor="upload-imagem">
                    <Button className="botaoModal"
                        variant="contained"
                        component="span"
                        size="medium"
                        startIcon={<UploadIcon />}
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0'
                            }
                        }}
                    >
                        {imagemPreview ? 'Alterar Imagem' : 'Upload de Imagem'}
                    </Button>
                </label>

                {imagemPreview && (
                    <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                            src={imagemPreview}
                            alt="Pré-visualização"
                            style={{
                                width: '35px',
                                height: '35px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                            }}
                        />
                        <span style={{ fontSize: '14px', color: '#666' }}>
                            Imagem selecionada
                        </span>
                    </div>
                )}
            </div>
            {erros.imagem && (
                <div style={{
                    color: '#d32f2f',
                    fontSize: '0.75rem',
                    marginTop: '3px',
                    fontFamily: '"Roboto","Helvetica","Arial",sans-serif'
                }}>
                    {erros.imagem}
                </div>
            )}
        </>
    );

    // Função para formatar o preço de forma segura
    const formatarPreco = (preco) => {
        // Remove espaços em branco
        let precoLimpo = preco.toString().trim();

        // Substitui vírgula por ponto
        precoLimpo = precoLimpo.replace(",", ".");

        // Converte para número de ponto flutuante
        const precoFormatado = parseFloat(precoLimpo);

        // Verifica se é um número válido
        if (isNaN(precoFormatado)) {
            throw new Error("Preço inválido");
        }

        // Arredonda para 2 casas decimais
        return Number(precoFormatado.toFixed(2));
    };

    // Método para atualizar produto (PUT) com imagem
    const atualizarProduto = async (produto, dadosAtualizados) => {
        try {
            setCarregando(true);

            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            let urlImagem = dadosAtualizados.imagemUrl;

            // Se houver uma nova imagem, faz o upload
            if (arquivoImagem) {
                try {
                    // urlImagem = await enviarImagemParaAzure(arquivoImagem, produto.id);
                    // Descomentar quando a função de upload estiver pronta
                } catch (erroUpload) {
                    console.error('Erro no upload da imagem:', erroUpload);
                    throw new Error('Falha ao enviar imagem');
                }
            }

            const dadosParaAtualizar = {
                id: produto.id, // Importante incluir o ID
                nome: dadosAtualizados.nome,
                preco: formatarPreco(dadosAtualizados.preco),
                qtdPorCaixas: dadosAtualizados.qtdPorCaixas,
                nomeSubtipo: dadosAtualizados.subtipo,
                nomeMarca: dadosAtualizados.marca,
                temLactose: dadosAtualizados.temLactose,
                temGluten: dadosAtualizados.temGluten,
                imagemUrl: urlImagem
            };

            const resposta = await fetch(`http://localhost:8080/produtos/${produto.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dadosParaAtualizar)
            });

            if (!resposta.ok) {
                const errorText = await resposta.text();
                console.error("Resposta do erro:", errorText);
                throw new Error("Erro ao atualizar produto");
            }

            const dadosAtualizadosResponse = await resposta.json();

            // Atualizar o estado local com o produto atualizado
            setProdutos(produtosAntigos =>
                produtosAntigos.map(p =>
                    p.id === produto.id
                        ? {
                            ...p,
                            nome: dadosAtualizadosResponse.nome || p.nome,
                            marca: dadosAtualizadosResponse.marca?.nome || dadosAtualizadosResponse.marca || p.marca,
                            subtipo: dadosAtualizadosResponse.subtipo?.nome || dadosAtualizadosResponse.subtipo || p.subtipo,
                            preco: typeof dadosAtualizadosResponse.preco === 'number' ?
                                dadosAtualizadosResponse.preco :
                                parseFloat(dadosAtualizadosResponse.preco) || p.preco,
                            qtdPorCaixas: typeof dadosAtualizadosResponse.qtdPorCaixas === 'number' ?
                                dadosAtualizadosResponse.qtdPorCaixas :
                                parseInt(dadosAtualizadosResponse.qtdPorCaixas) || p.qtdPorCaixas,
                            imagemUrl: dadosAtualizadosResponse.imagemUrl || p.imagemUrl,
                            temLactose: dadosAtualizadosResponse.temLactose ?? p.temLactose,
                            temGluten: dadosAtualizadosResponse.temGluten ?? p.temGluten
                        }
                        : p
                )
            );

            toast.success("Produto atualizado com sucesso!");
            fecharModal();
            limparImagemPreview();
            buscarProdutos();

        } catch (erro) {
            toast.error(erro.message);
            console.error("Erro ao atualizar produto:", erro);
        } finally {
            setCarregando(false);
        }
    };
    
    // Função auxiliar para limpar a imagem
    const limparImagemPreview = () => {
        setArquivoImagem(null);
    };

    // Método para preparar a edição
    const handleEditar = async (produto) => {
        setProdutoSelecionado(produto);
        setNovoProduto({
            id: produto.id,
            nome: produto.nome || '',
            marca: typeof produto.marca === 'object' ? produto.marca.nome : produto.marca || '',
            subtipo: typeof produto.subtipo === 'object' ? produto.subtipo : produto.subtipo || '',
            tipo: typeof produto.tipo === 'object' ? produto.tipo : produto.tipo || '',
            preco: produto.preco ? produto.preco.toFixed(2) : '0.00',
            qtdPorCaixas: produto.qtdPorCaixas ? produto.qtdPorCaixas : '0',
            imagemUrl: produto.imagemUrl || '',
            temLactose: produto.temLactose,
            temGluten: produto.temGluten,
            isAtivo: produto.isAtivo
        });
        const token = sessionStorage.getItem('token');
        setCarregando(true);
        try {
            const urls = [
                { key: "marcas", url: "http://localhost:8080/marcas" },
                { key: "subtipos", url: "http://localhost:8080/subtipos" },
                { key: "tipos", url: "http://localhost:8080/tipos" }
            ];

            const respostas = await Promise.all(
                urls.map(({ url }) =>
                    fetch(url, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );

            respostas.forEach((res, index) => {
                if (!res.ok) {
                    throw new Error(`Erro ao carregar ${urls[index].key}: ${res.statusText}`);
                }
            });

            const [dadosMarcas, dadosSubtipos, dadosTipos] = await Promise.all(respostas.map(res => res.json()));
            setMarcas(dadosMarcas);
            setSubtipos(dadosSubtipos);
            setTipos(dadosTipos)

        } catch (erro) {
            toast.error("Erro ao carregar os produtos: " + erro.message);
        } finally {
            setCarregando(false);
        }
        setModalAberto(true);
    };

    // Método para preparar a visualização
    const handleVisualizacao = (produto) => {
        setProdutoSelecionado(produto);
        setNovoProduto({
            id: produto.id,
            nome: produto.nome || '',
            marca: produto.marca || '',
            subtipo: typeof produto.subtipo === 'object' ? produto.subtipo : produto.subtipo || '',
            tipo: typeof produto.tipo === 'object' ? produto.tipo : produto.tipo || '',
            preco: produto.preco ? produto.preco.toFixed(2) : '0.00',
            qtdCaixasEstoque: produto.qtdCaixasEstoque ? produto.qtdCaixasEstoque : '0',
            qtdPorCaixas: produto.qtdPorCaixas ? produto.qtdPorCaixas : '0',
            imagemUrl: produto.imagemUrl || '',
            temLactose: produto.temLactose,
            temGluten: produto.temGluten,
            isAtivo: produto.isAtivo
        });
        setModalVisualizarProdutoAberto(true);
    };

    // metodo para saber se o produto tem lactose
    const handlePossuiLactose = (event) => {

        setNovoProduto((prev) => ({
            ...prev,
            temLactose: event.target.checked,
        }));

    };

    // metodo para saber se o produto tem gluten
    const handlePossuiGluten = async (event) => {

        setNovoProduto((prev) => ({
            ...prev,
            temGluten: event.target.checked,
        }));
    };


    // Função renderProdutoCell definida antes de usá-la
    const renderProdutoCell = (value, defaultValue = '-') => {
        return value || defaultValue;
    };


    return (
        <>
            <div className="header-tabela">
                <HeaderGerenciamento />
            </div>

            <div className="secao-produto">
                <BotaoVoltarGerenciamento />
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
                                padding: '8px',
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
                                <TableCell className='tabela-head-cell'>Tipo</TableCell>
                                <TableCell className='tabela-head-cell'>Preço</TableCell>
                                <TableCell className='tabela-head-cell'>Ações</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {produtos
                                .filter(produto => produto && typeof produto === 'object' && produto.id)
                                .map(produto => (
                                    <TableRow key={produto.id} className={`tabela-row-vendas`}>
                                        <TableCell>
                                            <img
                                                src={renderProdutoCell(produto.imagemUrl, 'url-placeholder.png')}
                                                alt={produto.nome || 'Imagem do Produto'}
                                                width="40"
                                                height="40"
                                            />
                                        </TableCell>
                                        <TableCell>{renderProdutoCell(produto.nome, 'Produto sem nome')}</TableCell>
                                        <TableCell>{renderProdutoCell(produto.marca, 'Marca desconhecida')}</TableCell>
                                        <TableCell>{renderProdutoCell(produto.tipo, 'Tipo desconhecida')}</TableCell>
                                        <TableCell>
                                            R${" "}
                                            {(() => {
                                                const preco = parseFloat(produto.preco);
                                                return !isNaN(preco) ? preco.toFixed(2) : '0.00';
                                            })()}
                                        </TableCell>
                                        <TableCell className='tabela-cell'>
                                            <Tooltip
                                                title="Editar recomendação"
                                                placement="bottom"
                                                arrow
                                                enterDelay={200}
                                                leaveDelay={200}
                                            >
                                                <button onClick={() => handleEditar(produto)}>
                                                    <EditIcon />
                                                </button>
                                            </Tooltip>
                                            <Tooltip
                                                title="Visualizar recomendação"
                                                placement="bottom"
                                                arrow
                                                enterDelay={200}
                                                leaveDelay={200}
                                            >
                                                <button onClick={() => handleVisualizacao(produto)}>
                                                    <VisibilityIcon />
                                                </button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>

                    </Table>
                </TableContainer>
            </div>

            <Dialog open={modalAberto} onClose={fecharModal}>
                <DialogTitle className="tituloModal">
                    {produtoSelecionado ? "Editar Recomendação" : "Adicionar Produto"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="nome"
                        label="Nome do Produto"
                        fullWidth
                        value={novoProduto.nome}
                        error={!!erros.nome}
                        helperText={erros.nome}
                    />
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
                        disabled={carregando}
                    >
                        {carregando ? 'Salvando...' : (produtoSelecionado ? "Salvar" : "Adicionar")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={modalVisualizarProdutoAberto} onClose={fecharModal}>
                <DialogTitle className="tituloModal">
                    {produtoSelecionado ? "Visualizar Recomendação" : "Adicionar Produto"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        disabled={true}
                        autoFocus
                        margin="dense"
                        name="nome"
                        label="Nome do Produto"
                        fullWidth
                        value={novoProduto.nome}
                        error={!!erros.nome}
                        helperText={erros.nome}
                    />
                    <Autocomplete
                        disabled={true}
                        autoFocus
                        fullWidth
                        options={[...marcas, { nome: '+ Adicionar Nova Marca', isAddNew: true }]}
                        value={novoProduto.marca ? { nome: novoProduto.marca } : null}
                        noOptionsText="Nenhuma opção encontrada"
                        onChange={(event, newValue) => {
                            if (newValue?.isAddNew) {
                                setModalNovaMarcaAberto(true);
                                return;
                            }
                        }}
                        getOptionLabel={(option) => option.nome || ''}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                disabled="true"
                                margin="dense"
                                name="marca"
                                label="Marca"
                                error={!!erros.marca}
                                placeholder="Selecione uma marca"
                            />
                        )}
                    />

                    <Autocomplete
                        disabled={true}
                        autoFocus
                        fullWidth
                        options={[...tipos, { nome: '+ Adicionar Novo Tipo', isAddNew: true }]}
                        value={novoProduto.tipo ? { nome: novoProduto.tipo } : null}
                        noOptionsText="Nenhuma opção encontrada"
                        onChange={(event, newValue) => {
                            if (newValue?.isAddNew) {
                                setModalNovoSubtipoAberto(true);
                                return;
                            }
                            setNovoProduto((prev) => ({
                                ...prev,
                                subtipo: newValue?.nome || ''
                            }));
                        }}
                        getOptionLabel={(option) => option.nome || ''}
                        renderInput={(params) => (
                            <TextField
                                disabled="true"
                                {...params}
                                margin="dense"
                                name="tipo"
                                label="Tipo"
                                error={!!erros.subtipo}
                                placeholder="Selecione um subtipo"
                            />
                        )}
                    />

                    <Autocomplete
                        disabled={true} // NÃO PODE SER DO TIPO STRING
                        autoFocus
                        fullWidth
                        options={[...subtipos, { nome: '+ Adicionar Novo Subtipo', isAddNew: true }]}
                        value={novoProduto.subtipo ? { nome: novoProduto.subtipo } : null}
                        noOptionsText="Nenhuma opção encontrada"
                        onChange={(event, newValue) => {
                            if (newValue?.isAddNew) {
                                setModalNovoSubtipoAberto(true);
                                return;
                            }
                            setNovoProduto((prev) => ({
                                ...prev,
                                subtipo: newValue?.nome || ''
                            }));
                        }}
                        getOptionLabel={(option) => option.nome || ''}
                        renderInput={(params) => (
                            <TextField
                                disabled="true"
                                {...params}
                                margin="dense"
                                name="subtipo"
                                label="Subtipo"
                                error={!!erros.subtipo}
                                placeholder="Selecione um subtipo"
                            />
                        )}
                    />
                    {erros.subtipo && (
                        <div
                            style={{ color: "red", fontSize: "0.75rem", marginTop: "3px" }}
                        >
                            {erros.subtipo}
                        </div>
                    )}

                    <TextField
                        disabled={true}
                        margin="dense"
                        name="preco"
                        label="Preço"
                        type="text"
                        fullWidth
                        value={novoProduto.preco}
                        error={!!erros.preco}
                        helperText={erros.preco}
                        inputProps={{
                            min: "0",
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment disabled="true" position="start">R$</InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        disabled={true}
                        margin="dense"
                        name="qtdCaixasEstoque"
                        label="Quantidade de Caixa"
                        type="number"
                        fullWidth
                        value={novoProduto.qtdCaixasEstoque}
                    />

                    <TextField
                        disabled={true}
                        margin="dense"
                        name="qtdPorCaixas"
                        label="Quantidade por Caixa"
                        type="number"
                        fullWidth
                        value={novoProduto.qtdPorCaixas}
                    />

                    <label style={{ alignItems: 'center', gap: '0px' }}>
                        <Checkbox
                            disabled={true}
                            checked={novoProduto.isAtivo}
                            inputProps={{ "Poppins": 'Produto está Ativo?' }}
                        />
                        Produto Ativo?
                    </label>

                    <label style={{ alignItems: 'center', gap: '0px' }}>
                        <Checkbox
                            disabled={true}
                            checked={novoProduto.temLactose}
                            onChange={handlePossuiLactose}
                            inputProps={{ "Poppins": 'Produto tem lactose?' }}
                        />
                        Possui Lactose?
                    </label>

                    <label style={{ alignItems: 'center', gap: '0px' }}>
                        <Checkbox
                            disabled={true}
                            checked={novoProduto.temGluten}
                            onChange={handlePossuiGluten}
                            inputProps={{ "Poppins": 'Produto tem Gluten?' }}
                        />
                        Possui Glúten?
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button
                        className='botaoModal'
                        onClick={fecharModal}
                        disabled={carregando}
                    >
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Recomendacoes;