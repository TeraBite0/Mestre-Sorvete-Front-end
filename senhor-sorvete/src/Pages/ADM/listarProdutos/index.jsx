import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputAdornment,
} from "@mui/material";
import "./listarProdutos.css";
import TableContainer from "@mui/material/TableContainer";
import EditIcon from "@mui/icons-material/Edit";
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
            const resposta = await fetch('http://74.163.64.10:8080/produtos', {
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
    if (
      marcas.some(
        (marca) => marca.nome.toLowerCase() === novaMarca.trim().toLowerCase()
      )
    ) {
      toast.error("Esta marca já existe");
      return;
    }

    const novaMarcaFormatada = { nome: novaMarca.trim() };
    setMarcas([...marcas, novaMarcaFormatada]);
    setNovoProduto((prev) => ({ ...prev, marca: novaMarca.trim() }));
    setModalNovaMarcaAberto(false);
    setNovaMarca("");
    toast.success("Marca adicionada com sucesso!");
  };

    const obterTokenSasAzure = async () => {
        const token = sessionStorage.getItem('token');
        const resposta = await fetch('http://74.163.64.10:8080/azure', {
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
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": arquivo.type,
        },
        body: arquivo,
      });

      if (!resposta.ok) {
        throw new Error("Erro ao fazer upload da imagem");
      }

      return urlUpload.split("?")[0];
    } catch (erro) {
      toast.error("Tente novamente mais tarde");
      throw erro;
    }
  };

  const filtroPesquisa = async (termo) => {
    const token = sessionStorage.getItem("token");
    setCarregando(true);

    try {
      // Normalizar e remover acentos antes de enviar
      const termoNormalizado = termo
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

            const response = await fetch(`http://74.163.64.10:8080/produtos/filtrar-nome-marca?termo=${termoNormalizado}`, {
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
    setNovoProduto({ nome: "", marca: "", preco: "", imagemUrl: "" });
    setImagemPreview(null);
    setArquivoImagem(null);
    setProdutoSelecionado(null);
    setErros({});
    setModalAberto(true);
  };

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
            // Validações existentes
            if (arquivo.size > 5000000) {
                toast.error("Arquivo muito grande. Máximo 5MB.");
                return;
            }

      if (!arquivo.type.startsWith("image/")) {
        toast.error("Por favor, selecione apenas arquivos de imagem.");
        return;
      }

      // Definir o arquivo
      setArquivoImagem(arquivo);

      // Usar try-catch para lidar com erros de leitura
      try {
        const leitor = new FileReader();

                leitor.onload = async (e) => {
                    console.log('Imagem carregada:', e.target.result); // Log para debug
                    setImagemPreview(e.target.result);

                    // Enviar a imagem para o Azure e obter a URL
                    try {
                        const produtoId = novoProduto.id; // ou outro identificador do produto
                        const urlImagemAzure = await enviarImagemParaAzure(arquivo, produtoId);
                        console.log('URL da imagem no Azure:', urlImagemAzure);

                        // Atualizar o estado com a URL da imagem após o upload
                        setNovoProduto(prevProduto => ({
                            ...prevProduto,
                            imagemUrl: urlImagemAzure
                        }));
                    } catch (uploadError) {
                        console.error('Erro ao enviar imagem para o Azure:', uploadError);
                        toast.error("Erro ao enviar imagem para o Azure");
                    }
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
    if (!arquivoImagem && !novoProduto?.imagemUrl) {
      novosErros.imagem = "Imagem é obrigatória";
    }

        console.log('Erros de validação:', novosErros); // Log para depuração
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };


    const adicionarNovoProduto = async () => {
        // Verifica a validação do formulário
        // if (!validarFormulario()) return;

        try {
            setCarregando(true); // Define o estado de carregamento como verdadeiro

            let urlImagem = novoProduto.imagemUrl;

            // Caso uma nova imagem tenha sido carregada
            if (arquivoImagem) {
                const idParaImagem = produtoSelecionado?.id;

                if (!produtoSelecionado || !idParaImagem || typeof idParaImagem !== 'number') {
                    console.error('Produto não selecionado ou ID inválido para envio de imagem');
                    throw new Error('ID do produto inválido');
                }

                // Envia a imagem para o Azure e obtém a URL
                urlImagem = await enviarImagemParaAzure(arquivoImagem, idParaImagem);
            }

            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            // Monta os dados do produto para envio
            const dadosProduto = {
                nome: novoProduto.nome,
                nomeSubtipo: novoProduto.subtipo,
                nomeMarca: novoProduto.marca,
                preco: formatarPreco(novoProduto.preco),
            };

            // Define a URL e o método (POST para novo produto, PUT para edição)
            const url = produtoSelecionado
                ? `http://74.163.64.10:8080/produtos/${produtoSelecionado.id}`
                : 'http://74.163.64.10:8080/produtos';

      const metodo = produtoSelecionado ? "PUT" : "POST";

            // Faz a requisição ao backend
            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosProduto)
            });

            if (!resposta.ok) {
                const errorDetails = await resposta.json();
                console.error('Erro ao salvar produto:', errorDetails);
                fecharModal();
                toast.success("Imagem alterada!")
                return null;
            }

            // Exibe uma mensagem de sucesso
            toast.success(produtoSelecionado ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');

            // Atualiza o estado com os dados recebidos
            // const dadosAtualizados = await resposta.json();
            // if (produtoSelecionado) {
            //     setProdutos(produtos.map(produto =>
            //         produto.id === produtoSelecionado.id ? dadosAtualizados : produto
            //     ));
            // } else {
            //     setProdutos([...produtos, dadosAtualizados]);
            // }

            // Fecha o modal
            fecharModal();
        } catch (erro) {
            // Exibe uma mensagem de erro
            toast.error(erro.message);
        } finally {
            // Define o estado de carregamento como falso
            setCarregando(false);
        }
    };



  const handleEditar = (produto) => {
    if (!produto || !produto.id) {
      console.error("Produto inválido", produto);
      toast.error("Não foi possível editar o produto");
      return;
    }

        setProdutoSelecionado(produto);
        setNovoProduto({
            nome: produto?.nome || '',
            marca: produto?.marca || '',
            subtipo: produto?.subtipo || '',
            preco: produto?.preco || '',
            imagemUrl: produto?.imagemUrl || ''
        });
        setImagemPreview(produto?.imagemUrl || '');
        setModalAberto(true);
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
                                <TableCell className='tabela-head-cell'>Preço</TableCell>
                                <TableCell className='tabela-head-cell'>Editar</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {produtos
                                .filter(produto => produto && typeof produto === 'object' && produto.id)
                                .map(produto => (
                                    <TableRow key={produto.id} className='tabela-row-vendas'>
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
                                        <TableCell>
                                            R$ {renderProdutoCell(produto.preco, 0) !== 0 ? renderProdutoCell(produto.preco, 0).toFixed(2) : '0.00'}
                                        </TableCell>
                                        <TableCell className='tabela-cell'>
                                            <button onClick={() => handleEditar(produto)}>
                                                <EditIcon />
                                            </button>
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
          <Select
            autoFocus
            margin="dense"
            name="marca"
            label="Marca"
            fullWidth
            value={novoProduto.marca || ""}
            onChange={handleInputChange}
            error={!!erros.marca}
            displayEmpty
            renderValue={(selected) => selected || "Selecione uma marca"}
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
            <div
              style={{ color: "red", fontSize: "0.75rem", marginTop: "3px" }}
            >
              {erros.marca}
            </div>
          )}
          <Select
            autoFocus
            margin="dense"
            label="Subtipo"
            fullWidth
            value={novoProduto.subtipo || ""}
            onChange={(e) =>
              setNovoProduto((prev) => ({ ...prev, subtipo: e.target.value }))
            }
            error={!!erros.subtipo}
            displayEmpty
            renderValue={(selected) => selected || "Selecione um subtipo"}
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

                    {produtoSelecionado ? (
                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleImagemUpload}
                            style={{ marginTop: '10px' }}
                        />
                    ) : null}
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
    </>
  );
};

export default ListarProdutos;
