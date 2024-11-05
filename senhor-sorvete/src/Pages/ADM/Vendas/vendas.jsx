import { useEffect, useState } from "react";
import axios from "axios";
import "./vendas.css";
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from "../../../Components/BotaoVoltarGerenciamento";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "react-toastify";
import rootShouldForwardProp from "@mui/material/styles/rootShouldForwardProp";

const Vendas = () => {

  const [rows, setRows] = useState([]);
  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [novasVendas, setNovasVendas] = useState([{ produto: "", quantidade: 0, precoTotal: 0 }]);
  const [dataVenda, setDataVenda] = useState([]);
  const [resultadoBusca, setResultadoBusca] = useState(null);
  const [openBuscar, setOpenBuscar] = useState(false);
  const [total, setTotal] = useState(0);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);



  useEffect(() => {
    const token = sessionStorage.getItem('token');
    console.log("Token:", token);

    axios.get('http://localhost:8080/vendas', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log("Response Data:", response.data);
        setRows(response.data);
        console.log("Estrutura dos dados:", JSON.stringify(response.data, null, 2));

      })
      .catch(error => {
        console.error("Error loading vendas:", error);
        toast.error('Erro ao carregar vendas.');
      });

      axios.get('http://localhost:8080/produtos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => setProdutosDisponiveis(response.data)
    )
    .catch(error => {
      toast.error('Erro ao carregar produtos', error);
    })

  }, []);

  const handleOpenAdicionar = () => setOpenAdicionar(true);
  const handleCloseAdicionar = () => {
    setOpenAdicionar(false);
    setNovasVendas([{ produto: "", quantidade: 0, precoTotal: 0 }]);
    setTotal(0);
  };

  const handleOpenBuscar = () => setOpenBuscar(true);
  const handleCloseBuscar = () => {
    setOpenBuscar(false);
    setDataVenda("");
    setResultadoBusca(null);
  };

  const handleAdicionarCampo = () => {
    setNovasVendas([...novasVendas, { produto: "", quantidade: 0, precoTotal: 0 }]);
  };

  const handleChangeNovaVenda = (index, field, value) => {
    const updatedVendas = novasVendas.map((venda, i) => {
      if (i === index) {
        if (field === 'produto') {
          const produtoSelecionado = produtosDisponiveis.find(p => p.nome === value);
          return { 
            ...venda, 
            [field]: value,
            precoTotal: produtoSelecionado ? produtoSelecionado.preco * (venda.quantidade || 0) : 0
          };
        }
        if (field === 'quantidade') {
          const produtoSelecionado = produtosDisponiveis.find(p => p.nome === venda.produto);
          return {
            ...venda,
            quantidade: value,
            precoTotal: produtoSelecionado ? produtoSelecionado.preco * value : 0
          };
        }
        return { ...venda, [field]: value };
      }
      return venda;
    });
    setNovasVendas(updatedVendas);
    calcularValorTotal(updatedVendas);
  };

  const calcularValorTotal = (vendas) => {
    const totalCalculado = vendas.reduce((acc, venda) => {
      return acc + (venda.precoTotal || 0);
    }, 0);
    setTotal(totalCalculado);
  };

  // const calcularValorTotal = (vendas) => {
  //   const totalCalculado = vendas.reduce((acc, venda) => {
  //     const produtoSelecionado = produtosDisponiveis.find(prod => prod.nome === venda.produto);
  //     const preco = produtoSelecionado ? produtoSelecionado.preco : 0;
  //     const quantidade = parseInt(venda.quantidade, 10) || 0;
  //     const precoTotal = preco * quantidade;
  //     venda.precoTotal = precoTotal;
  //     return acc + precoTotal;
  //   }, 0);
  //   setTotal(totalCalculado);
  // };

  const handleSubmitAdicionar = async () => {
    const token = sessionStorage.getItem('token');
  
    // Preparar o array de produtos para envio, filtrando e formatando os dados
    const produtosParaEnviar = novasVendas
      .filter(venda => venda.produto && venda.quantidade > 0)
      .map(venda => ({
        produtoNome: venda.produto,
        quantidade: venda.quantidade,
      }));
  
    if (produtosParaEnviar.length === 0) {
      toast.error("Por favor, adicione pelo menos um produto com quantidade válida.");
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:8080/vendas',
        { produtos: produtosParaEnviar },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data) {
        setRows(prevRows => [...prevRows, response.data]);
        handleCloseAdicionar();
        toast.success('Venda registrada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
  
      // Verificar e exibir os erros detalhados de validação, se houver
      if (error.response && error.response.status === 400 && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map(err => err.defaultMessage).join(", ");
        toast.error(`Erro de validação: ${errorMessages}`);
      } else {
        toast.error('Erro ao registrar venda. Por favor, tente novamente.');
      }
    }
  };
  

  const handleSubmitBuscar = async () => {
    // Implementar a lógica de busca de vendas aqui
  };

  const vendasComProdutos = rows.filter(row => row.produtos && row.produtos.length > 0);

  return (
    <div className="container-vendas">
      <HeaderGerenciamento />
      <BotaoVoltarGerenciamento />

      <div className="container-informacoes">
        <h1>Vendas</h1>
        <div className="container-botoes">
          <BotaoGerenciamento botao="Buscar" onClick={handleOpenBuscar} />
          <BotaoGerenciamento botao="+ Nova Venda" onClick={handleOpenAdicionar} />
        </div>
      </div>

      <div className="tabela-vendas">
        <TableContainer component={Paper} className="tabela-cont">
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead className="tabela-Head">
              <TableRow>
                <TableCell className="tabela-Head">Código</TableCell>
                <TableCell className="tabela-Head" align="right">Data</TableCell>
                <TableCell className="tabela-Head" align="right">Produtos</TableCell>
                <TableCell className="tabela-Head" align="right">Preços</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendasComProdutos.map((row) => {

                const precoTotal = row.produtos.reduce((total, item) => {
                return total + (item.produto.preco * item.qtdVendida);
              }, 0);

              return (
              <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell align="right">
                  {new Date(row.dataCompra).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell align="right">
                  {row.produtos.map(item => (
                    <div key={item.produto.id}>
                      {item.produto.nome}
                    </div>
                  ))
                  }
                </TableCell>
                <TableCell align="right" style={{ fontWeight: 'bold' }}>
                R$ {precoTotal.toFixed(2)}
                </TableCell>
              </TableRow>
              );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Modal Adicionar Venda */}
      <Dialog open={openAdicionar} onClose={handleCloseAdicionar}>
        <DialogTitle className='tituloModal'>Adicionar Vendas</DialogTitle>
        <DialogContent className="container-modais">
          {novasVendas.map((venda, index) => (
            <div key={index}>
              <Autocomplete
                options={produtosDisponiveis.map((produto) => produto.nome)}
                renderInput={(params) =>
                  <TextField
                    className="campo-modal"
                    autoFocus
                    margin="dense"
                    {...params}
                    label="Produto"
                    fullWidth
                  />}
                value={venda.produto}
                onChange={(event, newValue) => handleChangeNovaVenda(index, 'produto', newValue)}
              />
              <TextField
                className="campo-modal"
                autoFocus
                margin="dense"
                type="number"
                label="Quantidade"
                fullWidth
                value={venda.quantidade}
                onChange={(e) => handleChangeNovaVenda(index, 'quantidade', e.target.value)}
              />
              <h4>Preço Total: R${venda.precoTotal.toFixed(2)}</h4>
              <br />
            </div>
          ))}
          <Button variant="outlined" onClick={handleAdicionarCampo}>Adicionar Produto</Button>
          <h3>Total: R${total.toFixed(2)}</h3>
        </DialogContent>
        <DialogActions>
          <Button className="botaoModal" onClick={handleCloseAdicionar}>Cancelar</Button>
          <Button className="botaoModal" onClick={handleSubmitAdicionar} variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Buscar Venda */}
      <Dialog open={openBuscar} onClose={handleCloseBuscar}>
        <DialogTitle>Buscar Venda</DialogTitle>
        <DialogContent>
          <TextField
            label="Data da venda"
            fullWidth
            value={dataVenda}
            onChange={(e) => setDataVenda(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBuscar}>Cancelar</Button>
          <Button onClick={handleSubmitBuscar} variant="contained">Buscar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Vendas;
