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
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadIcon from '@mui/icons-material/Upload';
import "./listarProdutos.css";
import TableContainer from "@mui/material/TableContainer";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
//import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { useEffect, useState } from "react";
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import Pesquisa from "../../../Components/Pesquisa";
import BotaoVoltarGerenciamento from "../../../Components/BotaoVoltarGerenciamento";
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";
import { toast } from "react-toastify";
import axios from "axios";

const ListarProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        marca: '',
        subtipo: '',
        preco: '',
        temLactose: false,
        temGluten: false,
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

            if (!resposta.ok) throw new Error("Falha ao carregar produtos");

            const dados = await resposta.json();

            // Extrair marcas únicas
            const marcasUnicas = [
                ...new Set(
                    dados.map((produto) => produto.marca?.nome).filter((marca) => marca)
                ),
            ];

            // Extrair subtipos únicos
            const subtiposUnicos = [
                ...new Set(
                    dados
                        .map((produto) => produto.subtipo?.nome)
                        .filter((subtipo) => subtipo)
                ),
            ];

            const marcasFormatadas = marcasUnicas.map((nome) => ({ nome }));
            const subtiposFormatados = subtiposUnicos.map((nome) => ({ nome }));

            const produtosFormatados = dados.map(produto => ({
                id: produto.id || '',
                nome: produto.nome || '',
                marca: produto.marca?.nome || '',
                subtipo: produto.subtipo?.nome || '',
                tipo: produto.subtipo.tipo?.nome || '',
                preco: typeof produto.preco === 'number' ? produto.preco : 0,
                imagemUrl: "https://terabite.blob.core.windows.net/terabite-container/" + produto.id || '',
                isAtivo: produto.isAtivo !== undefined ? produto.isAtivo : true // Garantir que isAtivo seja definido
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


    // metodo de adicionar nova marca
    const adicionarNovaMarca = async () => {
        if (!novaMarca.trim()) {
            toast.error("O nome da marca não pode ser vazio");
            return;
        }
    
        console.log("Objeto enviado para API:", novaMarca.trim());
    
        const novaMarcaObj = JSON.parse(JSON.stringify({ nome: novaMarca.trim() }));;
        console.log("JSON final enviado:", JSON.stringify(novaMarcaObj));
    
        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.error("Erro de autenticação");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8080/marcas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novaMarcaObj)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro do servidor:", errorData);
                throw new Error(`Erro ao adicionar marca: ${errorData.message || 'Erro desconhecido'}`);
            }
    
            const data = await response.json();
            setMarcas(prev => [...prev, data]);
    
            setModalNovaMarcaAberto(false);
            setNovaMarca("");
    
            toast.success("Marca adicionada com sucesso!");
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro ao adicionar marca. Tente novamente.");
        }
    };
    
    
    



    const adicionarNovoSubtipo = async () => {
        if (!novoSubtipo.trim()) {
            toast.error("O nome do subtipo não pode ser vazio");
            return;
        }

        // Verifica se o subtipo já existe localmente
        if (subtipos.some(
            (subtipo) => subtipo.nome.toLowerCase() === novoSubtipo.trim().toLowerCase()
        )) {
            toast.error("Este subtipo já existe");
            return;
        }

        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.error("Erro de autenticação");
            return;
        }

        const novoProdutoParaSubtipo = {
            nome: "Produto Temporário", // Nome temporário para criar o subtipo
            nomeSubtipo: novoSubtipo.trim(),
            nomeMarca: "Marca Temporária", // Marca temporária para criar o subtipo
            preco: 0,
            temLactose: false,
            temGluten: false
        };

        try {
            const response = await fetch('http://localhost:8080/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novoProdutoParaSubtipo)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Erro da API:', errorData);
                throw new Error('Erro ao adicionar subtipo');
            }

            const data = await response.json();

            // Verifica se o subtipo foi criado corretamente
            if (!data || !data.subtipo) {
                throw new Error('Resposta inválida do servidor');
            }

            // Cria o novo objeto subtipo com o nome correto
            const novoSubtipoObj = {
                nome: novoSubtipo.trim(),
                // Adicione outros campos se necessário
            };

            // Atualiza a lista de subtipos
            setSubtipos(prevSubtipos => [...prevSubtipos, novoSubtipoObj]);

            // Atualiza o formulário atual com o novo subtipo
            setNovoProduto(prevProduto => ({
                ...prevProduto,
                subtipo: novoSubtipoObj.nome
            }));

            // Fecha o modal e limpa o campo
            setModalNovoSubtipoAberto(false);
            setNovoSubtipo("");

            toast.success("Subtipo adicionado com sucesso!");
        } catch (error) {
            console.error("Erro detalhado:", error);
            toast.error(`Erro ao adicionar subtipo: ${error.message}`);
        }
    };
    // const obterTokenSasAzure = async () => {
    //     const token = sessionStorage.getItem('token');
    //     const resposta = await fetch('http://localhost:8080/azure', {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     });

    //     if (resposta.ok) {
    //         const dados = await resposta.json();
    //         return dados.sasToken;
    //     }
    // };

    // const enviarImagemParaAzure = async (arquivo, produtoId) => {
    //     try {
    //         const tokenSaS = await obterTokenSasAzure();
    //         const nomeArquivo = `${produtoId}`;
    //         const sasUrl = `https://terabite.blob.core.windows.net/terabite-container/${nomeArquivo}?${tokenSaS}`;
    //         const urlUpload = `${sasUrl}/`;

    //         const resposta = await fetch(sasUrl, {
    //             method: "PUT",
    //             headers: {
    //                 "x-ms-blob-type": "BlockBlob",
    //                 "Content-Type": arquivo.type,
    //             },
    //             body: arquivo,
    //         });

    //         if (!resposta.ok) {
    //             throw new Error("Erro ao fazer upload da imagem");
    //         }

    //         return urlUpload.split("?")[0];
    //     } catch (erro) {
    //         toast.error("Tente novamente mais tarde");
    //         throw erro;
    //     }
    // };


    const filtroPesquisa = async (termo) => {
        const token = sessionStorage.getItem("token");
        setCarregando(true);

        try {
            // Normalizar e remover acentos antes de enviar
            const termoNormalizado = termo
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

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
                id: produto.id || '',
                nome: produto.nome || '',
                marca: produto.marca?.nome || '',
                subtipo: produto.subtipo?.nome || '',
                preco: typeof produto.preco === 'number' ? produto.preco : 0,
                imagemUrl: "https://terabite.blob.core.windows.net/terabite-container/" + produto.id || '',
                isAtivo: produto.isAtivo !== undefined ? produto.isAtivo : true  // Define true como padrão

            }));

            setProdutos(produtosFormatados);
        } catch (erro) {
            toast.error("Erro ao pesquisar produtos");
        } finally {
            setCarregando(false);
        }
    };


    // metodo para abrir um modal
    const abrirModal = () => {
        setNovoProduto({ nome: "", marca: "", preco: "", imagemUrl: "" });
        setImagemPreview(null);
        setArquivoImagem(null);
        setProdutoSelecionado(null);
        setErros({});
        setModalAberto(true);
    };


    // metodo para fechar modal
    const fecharModal = () => {
        setNovoProduto({ nome: "", marca: "", preco: "", imagemUrl: "" });
        setImagemPreview(null);
        setArquivoImagem(null);
        setProdutoSelecionado(null);
        setErros({});
        setModalAberto(false);
    };

    const handleInputChange = (evento) => {
        const { name, value } = evento.target;

        // Verifica se o campo é 'preco'
        if (name === "preco") {
            // Remove todos os caracteres não numéricos
            const numeroLimpo = value.replace(/[^\d]/g, "");

            // Divide por 100 para considerar casas decimais
            const valorFormatado = (Number(numeroLimpo) / 100).toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            );

            setNovoProduto((anterior) => ({
                ...anterior,
                [name]: valorFormatado,
            }));
        } else {
            setNovoProduto((anterior) => ({
                ...anterior,
                [name]: value,
            }));
        }

        // Limpa erro se existir
        if (erros[name]) {
            setErros((anterior) => ({
                ...anterior,
                [name]: "",
            }));
        }
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
                    setImagemPreview(e.target.result);
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


    // função para validação dos campos
    const validarFormulario = () => {
        const novosErros = {};

        // Verificando os valores de entrada
        console.log("Novo produto:", novoProduto);
        console.log("Arquivo imagem:", arquivoImagem);
        console.log("Preço do produto:", novoProduto?.preco);

        if (!novoProduto) {
            novosErros.nome = "Produto não encontrado";
        } else {
            if (!novoProduto?.nome?.trim()) {
                novosErros.nome = "Nome é obrigatório";
            }
            if (!novoProduto?.marca?.trim()) {
                novosErros.marca = "Marca é obrigatória";
            }
            if (!novoProduto?.subtipo?.trim()) {
                novosErros.subtipo = "Subtipo é obrigatório";
            }

            // Validar o formato do preço
            try {
                formatarPreco(novoProduto?.preco || "");
            } catch (erro) {
                novosErros.preco = "Formato de preço inválido";
            }
        }

        // Validar imagem obrigatória
        // if (!arquivoImagem && !novoProduto?.imagemUrl) {
        //     novosErros.imagem = "Imagem é obrigatória";
        // }

        console.log('Erros de validação:', novosErros); // Log para depuração
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    // Método para adicionar novo produto (somente POST)
    const adicionarNovoProduto = async () => {
        try {
            setCarregando(true);

            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            let urlImagem = novoProduto.imagemUrl;

            // Se houver uma nova imagem, faz o upload
            if (arquivoImagem) {
                try {
                    const produtoId = novoProduto.id;
                    // urlImagem = await enviarImagemParaAzure(arquivoImagem, produtoId);
                    // Descomentar quando a função de upload estiver pronta
                } catch (erroUpload) {
                    console.error('Erro no upload da imagem:', erroUpload);
                    throw new Error('Falha ao enviar imagem');
                }
            }

            // Monta os dados do produto para envio
            const dadosProduto = {
                nome: novoProduto.nome,
                nomeSubtipo: novoProduto.subtipo,
                nomeMarca: novoProduto.marca,
                imagemUrl: urlImagem,
                preco: formatarPreco(novoProduto.preco),
                temLactose: typeof novoProduto.temLactose === "boolean" ? novoProduto.temLactose : false,
                temGluten: typeof novoProduto.temGluten === "boolean" ? novoProduto.temGluten : false
            };

            const resposta = await fetch('http://localhost:8080/produtos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosProduto)
            });

            if (!resposta.ok) {
                const errorDetails = await resposta.json();
                console.error('Erro ao criar produto:', errorDetails);
                throw new Error('Erro ao criar produto');
            }

            const dadosNovoProduto = await resposta.json();

            // Formata o novo produto antes de adicionar ao estado
            const produtoFormatado = {
                id: dadosNovoProduto.id || '',
                nome: dadosNovoProduto.nome || '',
                marca: dadosNovoProduto.marca?.nome || '',
                subtipo: dadosNovoProduto.subtipo?.nome || '',
                preco: typeof dadosNovoProduto.preco === 'number' ? dadosNovoProduto.preco : 0,
                imagemUrl: "https://terabite.blob.core.windows.net/terabite-container/" + dadosNovoProduto.id || '',
                isAtivo: dadosNovoProduto.isAtivo !== undefined ? dadosNovoProduto.isAtivo : true,
                temLactose: dadosNovoProduto.temLactose || false,
                temGluten: dadosNovoProduto.temGluten || false
            };

            setProdutos(produtos => [...produtos, produtoFormatado]);

            toast.success('Produto criado com sucesso!');
            fecharModal();
            limparImagemPreview();

        } catch (erro) {
            toast.error(erro.message);
            console.error('Erro:', erro);
        } finally {
            setCarregando(false);
        }
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
                isAtivo: produto.isAtivo,
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
                            imagemUrl: dadosAtualizadosResponse.imagemUrl || p.imagemUrl,
                            isAtivo: dadosAtualizadosResponse.isAtivo !== undefined ?
                                dadosAtualizadosResponse.isAtivo :
                                p.isAtivo,
                            temLactose: dadosAtualizadosResponse.temLactose ?? p.temLactose,
                            temGluten: dadosAtualizadosResponse.temGluten ?? p.temGluten
                        }
                        : p
                )
            );

            toast.success("Produto atualizado com sucesso!");
            fecharModal();
            limparImagemPreview();

        } catch (erro) {
            toast.error(erro.message);
            console.error("Erro ao atualizar produto:", erro);
        } finally {
            setCarregando(false);
        }
    };
    // Função auxiliar para limpar a imagem
    const limparImagemPreview = () => {
        setImagemPreview(null);
        setArquivoImagem(null);
    };

    // Método para preparar a edição
    const handleEditar = (produto) => {
        setProdutoSelecionado(produto);
        setNovoProduto({
            id: produto.id,
            nome: produto.nome || '',
            marca: typeof produto.marca === 'object' ? produto.marca.nome : produto.marca || '',
            subtipo: typeof produto.subtipo === 'object' ? produto.subtipo.nome : produto.subtipo || '',
            preco: produto.preco ? produto.preco.toFixed(2) : '0.00',
            imagemUrl: produto.imagemUrl || '',
            temLactose: produto.temLactose ?? false,
            temGluten: produto.temGluten ?? false,
            isAtivo: produto.isAtivo
        });
        setModalAberto(true);
    };


    // metodo de desativar produto
    const handlerDesativar = async (produto) => {
        const token = sessionStorage.getItem('token');

        const desativarProduto = {
            nome: produto.nome || "",
            preco: produto.preco || 0,
            isAtivo: false,
            nomeSubtipo: produto.nomeSubtipo || produto.subtipo || "DefaultSubtipo",
            nomeMarca: produto.nomeMarca || produto.marca || "DefaultMarca",
            temLactose: typeof produto.temLactose === "boolean" ? produto.temLactose : false,
            temGluten: typeof produto.temGluten === "boolean" ? produto.temGluten : false
        };

        console.log("Objeto enviado:", JSON.stringify(desativarProduto));

        try {
            const response = await fetch(`http://localhost:8080/produtos/${produto.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(desativarProduto)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Resposta do erro:", errorText);
                throw new Error("Erro ao desativar produto");
            }

            const dados = await response.json();
            console.log("Produto desativado com sucesso: ", dados);

            // Atualiza apenas o produto desativado
            setProdutos(prev =>
                prev.map(p => p.id === produto.id ? { ...p, isAtivo: false } : p)
            );

            toast.success("Produto Desativado!");
        } catch (erro) {
            console.error("Erro ao desativar produto: ", erro);
        }
    };


    // metodo de ativar produto
    const handlerAtivar = async (produto) => {
        const token = sessionStorage.getItem('token');

        const ativarProduto = {
            nome: produto.nome || "",
            preco: produto.preco || 0,
            isAtivo: true,
            nomeSubtipo: produto.nomeSubtipo || produto.subtipo || "Senhor Sorvete",
            nomeMarca: produto.nomeMarca || produto.marca || "Senhor Sorvete",
            temLactose: typeof produto.temLactose === "boolean" ? produto.temLactose : false,
            temGluten: typeof produto.temGluten === "boolean" ? produto.temGluten : false
        };

        try {
            const response = await fetch(`http://localhost:8080/produtos/${produto.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(ativarProduto)
            });

            if (!response.ok) {
                throw new Error("Erro ao ativar produto");
            }

            const dados = await response.json();
            setProdutos(prev =>
                prev.map(p => p.id === produto.id ? { ...p, isAtivo: true } : p)
            );

            toast.success("Produto ativado com sucesso!");
        } catch (erro) {
            console.error("Erro ao ativar produto: ", erro);
            toast.error("Erro ao ativar produto");
        }
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
                                    <TableRow key={produto.id} className={`tabela-row-vendas ${!produto.isAtivo ? 'desativado' : ''}`}>
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
                                            {produto.isAtivo ? (
                                                <Tooltip
                                                    title="Desativar produto"
                                                    placement="bottom"
                                                    arrow
                                                    enterDelay={200}
                                                    leaveDelay={200}
                                                >
                                                    <button
                                                        className="desativar"
                                                        onClick={() => handlerDesativar(produto)}
                                                    >
                                                        <DoNotDisturbOnIcon />
                                                    </button>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip
                                                    title="Ativar produto"
                                                    placement="bottom"
                                                    arrow
                                                    enterDelay={200}
                                                    leaveDelay={200}
                                                >
                                                    <button
                                                        className="ativar"
                                                        onClick={() => handlerAtivar(produto)}
                                                    >
                                                        <CheckCircleIcon />
                                                    </button>
                                                </Tooltip>
                                            )}
                                            <Tooltip
                                                title="Editar produto"
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
                                                title="Visualizar produto"
                                                placement="bottom"
                                                arrow
                                                enterDelay={200}
                                                leaveDelay={200}
                                            >
                                                <button >
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
                    <Autocomplete
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
                            handleInputChange({
                                target: {
                                    name: 'marca',
                                    value: newValue?.nome || ''
                                }
                            });
                        }}
                        getOptionLabel={(option) => option.nome || ''}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                name="marca"
                                label="Marca"
                                error={!!erros.marca}
                                placeholder="Selecione uma marca"
                            />
                        )}
                    />

                    <Autocomplete
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

                    <label style={{ alignItems: 'center', gap: '0px' }}>
                        <Checkbox
                            checked={novoProduto.temLactose}
                            onChange={handlePossuiLactose}
                            inputProps={{ "Poppins": 'Produto tem lactose?' }}
                        />
                        Possui Lactose?
                    </label>

                    <label style={{ alignItems: 'center', gap: '0px' }}>
                        <Checkbox
                            checked={novoProduto.temGluten}
                            onChange={handlePossuiGluten}
                            inputProps={{ "Poppins": 'Produto tem Gluten?' }}
                        />
                        Possui Glúten?
                    </label>

                    <ImagemPreviewComponent
                        produtoSelecionado={produtoSelecionado}
                        handleImagemUpload={handleImagemUpload}
                        erros={erros}
                        imagemPreview={imagemPreview}
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
                        onClick={() => {
                            if (validarFormulario()) {
                                if (produtoSelecionado) {
                                    atualizarProduto(produtoSelecionado, novoProduto);
                                } else {
                                    adicionarNovoProduto();
                                }
                            }
                        }}
                        disabled={carregando}
                    >
                        {carregando ? 'Salvando...' : (produtoSelecionado ? "Salvar" : "Adicionar")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={modalNovaMarcaAberto}
                onClose={() => setModalNovaMarcaAberto(false)}
            >
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
                    <Button
                        className="botaoModal"
                        onClick={() => setModalNovaMarcaAberto(false)}
                    >
                        Cancelar
                    </Button>
                    <Button className="botaoModal" onClick={adicionarNovaMarca}>
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={modalNovoSubtipoAberto}
                onClose={() => setModalNovoSubtipoAberto(false)}
            >
                <DialogTitle>Adicionar Novo Subtipo</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Subtipo"
                        fullWidth
                        value={novoSubtipo}
                        onChange={(e) => setNovoSubtipo(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        className="botaoModal"
                        onClick={() => setModalNovoSubtipoAberto(false)}
                    >
                        Cancelar
                    </Button>
                    <Button className="botaoModal" onClick={adicionarNovoSubtipo}>
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ListarProdutos;