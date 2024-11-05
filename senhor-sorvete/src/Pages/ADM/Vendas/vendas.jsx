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

// Vendas Component
const Vendas = () => {
  const [rows, setRows] = useState([]);
  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [novasVendas, setNovasVendas] = useState([{ produto: "", quantidade: 0, precoTotal: 0 }]);
  const [total, setTotal] = useState(0);
  const [openBuscar, setOpenBuscar] = useState(false);
  const [codigoBusca, setCodigoBusca] = useState("");
  const [resultadoBusca, setResultadoBusca] = useState(null);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    axios.get('http://localhost:8080/vendas', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setRows(response.data);
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
      .then(response => setProdutosDisponiveis(response.data))
      .catch(error => {
        toast.error('Erro ao carregar produtos');
      });
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
    setCodigoBusca("");
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
      }
      return venda;
    });
    setNovasVendas(updatedVendas);
    calcularValorTotal(updatedVendas);
  };

  const calcularValorTotal = (vendas) => {
    const totalCalculado = vendas.reduce((acc, venda) => acc + (venda.precoTotal || 0), 0);
    setTotal(totalCalculado);
  };

  const handleSubmitAdicionar = async () => {
    const token = sessionStorage.getItem('token');
    const produtosParaEnviar = novasVendas.filter(venda => venda.produto && venda.quantidade > 0)
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
      if (error.response && error.response.status === 400 && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map(err => err.defaultMessage).join(", ");
        toast.error(`Erro de validação: ${errorMessages}`);
      } else {
        toast.error('Erro ao registrar venda. Por favor, tente novamente.');
      }
    }
  };

  const handleSubmitBuscar = () => {
    const vendaEncontrada = rows.find((row) => row.codigo.toString() === codigoBusca);
    setResultadoBusca(vendaEncontrada || "Venda não encontrada.");
  };

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
              {rows.map((row) => (
                <TableRow key={row.codigo} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">{row.codigo}</TableCell>
                  <TableCell align="right">{row.data}</TableCell>
                  <TableCell align="right">{row.produtos.join(', ')}</TableCell>
                  <TableCell align="right">R$ {row.precos}</TableCell>
                </TableRow>
              ))}
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
              <h4>Preço Total: R$ {venda.precoTotal.toFixed(2)}</h4>
              <br />
            </div>
          ))}
          <Button variant="outlined" onClick={handleAdicionarCampo}>Adicionar Produto</Button>
          <h3>Total: R$ {total.toFixed(2)}</h3>
        </DialogContent>
        <DialogActions>
          <Button className="botaoModal" onClick={handleCloseAdicionar}>Cancelar</Button>
          <Button className="botaoModal" onClick={handleSubmitAdicionar}>Adicionar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Buscar Venda */}
      <Dialog open={openBuscar} onClose={handleCloseBuscar}>
        <DialogTitle className='tituloModal'>Buscar Venda</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Código da Venda"
            type="number"
            fullWidth
            variant="standard"
            value={codigoBusca}
            onChange={(e) => setCodigoBusca(e.target.value)}
          />
          {resultadoBusca && (
            <div>
              <h4>Resultado da Busca:</h4>
              {typeof resultadoBusca === 'string' ? (
                <p>{resultadoBusca}</p>
              ) : (
                <div>
                  <p>Código: {resultadoBusca.codigo}</p>
                  <p>Data: {resultadoBusca.data}</p>
                  <p>Produtos: {resultadoBusca.produtos.join(', ')}</p>
                  <p>Preço Total: R$ {resultadoBusca.precos}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button className="botaoModal" onClick={handleCloseBuscar}>Cancelar</Button>
          <Button className="botaoModal" onClick={handleSubmitBuscar}>Buscar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Vendas;
