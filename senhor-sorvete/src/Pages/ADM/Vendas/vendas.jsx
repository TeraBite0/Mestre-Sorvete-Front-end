import { useState } from "react";
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

// Dados iniciais mockados
const initialRows = [
  { codigo: 23459, data: "27-09-2024", produtos: "Sorvete Limão seco", precos: "R$20.0" },
  { codigo: 12345, data: "28-09-2024", produtos: "Sorvete Castanha do Paraná", precos: "R$25.0" },
  { codigo: 67890, data: "29-09-2024", produtos: "Sorvete Guns and Ices", precos: "R$16.0" },
  { codigo: 78908, data: "02-10-2024", produtos: "Sorvete Cachorro Caramelo", precos: "R$15.0" },
  { codigo: 74656, data: "05-10-2024", produtos: "Sorvete Morango", precos: "R$20.0" },
];

const Vendas = () => {
  const [rows, setRows] = useState(initialRows);
  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [openBuscar, setOpenBuscar] = useState(false);
  const [novaVenda, setNovaVenda] = useState({ codigo: "", data: "", produtos: "", precos: "" });
  const [codigoBusca, setCodigoBusca] = useState("");
  const [resultadoBusca, setResultadoBusca] = useState(null);

  const handleOpenAdicionar = () => setOpenAdicionar(true);
  const handleCloseAdicionar = () => setOpenAdicionar(false);

  const handleOpenBuscar = () => setOpenBuscar(true);
  const handleCloseBuscar = () => {
    setOpenBuscar(false);
    setResultadoBusca(null);
  };

  // Função mockada para adicionar nova venda
  const handleSubmitAdicionar = () => {
    setRows((prevRows) => [...prevRows, novaVenda]);
    setNovaVenda({ Produtos: "", Quantidade: "" });
    handleCloseAdicionar();
  };

  // Função mockada para buscar venda
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
                  <TableCell align="right">{row.produtos}</TableCell>
                  <TableCell align="right">{row.precos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Modal Adicionar Venda */}
      <Dialog open={openAdicionar} onClose={handleCloseAdicionar}>
        <DialogTitle className='tituloModal'> Adicionar Venda</DialogTitle>
        <DialogContent className="campos-modais">
          {/* <TextField label="Código" fullWidth value={novaVenda.codigo} onChange={(e) => setNovaVenda({ ...novaVenda, codigo: e.target.value })} />
          <TextField label="Data" fullWidth value={novaVenda.data} onChange={(e) => setNovaVenda({ ...novaVenda, data: e.target.value })} /> */}
          <TextField label="Produtos" fullWidth value={novaVenda.Produtos} onChange={(e) => setNovaVenda({ ...novaVenda, Produtos: e.target.value })} />
          <TextField label="Quantidade" fullWidth value={novaVenda.Quantidade} onChange={(e) => setNovaVenda({ ...novaVenda, Quantidade: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button className='botaoModal' onClick={handleCloseAdicionar}>Cancelar</Button>
          <Button className='botaoModal' onClick={handleSubmitAdicionar}>Finalizar Venda</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Buscar Venda */}
      <Dialog open={openBuscar} onClose={handleCloseBuscar}>
        <DialogTitle>Buscar Venda</DialogTitle>
        <DialogContent className="campos-modais">
          <TextField label="Código da Venda" fullWidth value={codigoBusca} onChange={(e) => setCodigoBusca(e.target.value)} />
          {resultadoBusca && (
            <div style={{ marginTop: "1em" }}>
              {typeof resultadoBusca === "string" ? (
                <p>{resultadoBusca}</p>
              ) : (
                <div>
                  <p><strong>Código:</strong> {resultadoBusca.codigo}</p>
                  <p><strong>Data:</strong> {resultadoBusca.data}</p>
                  <p><strong>Produtos:</strong> {resultadoBusca.produtos}</p>
                  <p><strong>Preços:</strong> {resultadoBusca.precos}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button className='botaoModal' onClick={handleCloseBuscar}>Fechar</Button>
          <Button className='botaoModal' onClick={handleSubmitBuscar}>Buscar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Vendas;
