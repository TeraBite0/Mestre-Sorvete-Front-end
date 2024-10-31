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
  { codigo: 23459, data: "27-09-2024", produtos: "Sorvete Limão seco", precos: "20.00" },
  { codigo: 12345, data: "28-09-2024", produtos: "Sorvete Castanha do Paraná", precos: "25.00" },
  { codigo: 67890, data: "29-09-2024", produtos: "Sorvete Guns and Ices", precos: "16.00" },
  { codigo: 78908, data: "02-10-2024", produtos: "Sorvete Cachorro Caramelo", precos: "15.00" },
  { codigo: 74656, data: "05-10-2024", produtos: "Sorvete Morango", precos: "20.00" },
  { codigo: 85674, data: "10-10-2024", produtos: "Sorvete Chocolate Intenso", precos: "18.00" },
  { codigo: 97345, data: "12-10-2024", produtos: "Sorvete Maracujá Tropical", precos: "22.00" },
  { codigo: 64532, data: "15-10-2024", produtos: "Sorvete Baunilha Gourmet", precos: "21.00" },
  // { codigo: 11234, data: "18-10-2024", produtos: "Sorvete Frutas Vermelhas", precos: "19.00" },
  // { codigo: 56789, data: "22-10-2024", produtos: "Sorvete Coco Cremoso", precos: "23.00" },
  // { codigo: 38475, data: "25-10-2024", produtos: "Sorvete Pistache Premium", precos: "26.00" },
  // { codigo: 67893, data: "26-10-2024", produtos: "Sorvete Abacaxi com Hortelã", precos: "24.00" },
  // { codigo: 34212, data: "27-10-2024", produtos: "Sorvete Banana com Doce de Leite", precos: "20.00" },
  // { codigo: 98034, data: "30-10-2024", produtos: "Sorvete Caramelo Salgado", precos: "25.00" }
];

const Vendas = () => {
  const [rows, setRows] = useState(initialRows);
  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [openBuscar, setOpenBuscar] = useState(false);
  const [novaVenda, setNovaVenda] = useState({ codigo: "", data: "", produtos: "", precos: "" });
  const [vendasTemporarias, setVendasTemporarias] = useState([]); // Lista de vendas temporárias
  const [totalVendas, setTotalVendas] = useState(0); // Total dos preços das vendas temporárias
  const [codigoBusca, setCodigoBusca] = useState("");
  const [resultadoBusca, setResultadoBusca] = useState(null);

  const handleOpenAdicionar = () => setOpenAdicionar(true);
  const handleCloseAdicionar = () => {
    setOpenAdicionar(false);
    setVendasTemporarias([]);
    setTotalVendas(0);
  };

  const handleOpenBuscar = () => setOpenBuscar(true);
  const handleCloseBuscar = () => {
    setOpenBuscar(false);
    setResultadoBusca(null);
  };

  // Adicionar venda temporária e atualizar o total - Mudar depois da apresentação
  const handleAdicionarVendaTemporaria = () => {
    const preco = parseFloat(novaVenda.precos.replace("R$", "").replace(",", "."));
    setVendasTemporarias((prev) => [...prev, novaVenda]);
    setTotalVendas((prevTotal) => prevTotal + preco);
    setNovaVenda({ codigo: "", data: "", produtos: "", precos: "" });
  };

  // Finalizar e adicionar todas as vendas temporárias ao array principal - Mudar depois da apresentação
  const handleSubmitAdicionarTodasVendas = () => {
    setRows((prevRows) => [...prevRows, ...vendasTemporarias]);
    setVendasTemporarias([]);
    setTotalVendas(0);
    handleCloseAdicionar();
  };

  // Buscar venda pelo código - Ver se vai buscar pelo código mesmo
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
                  <TableCell align="right">R$ {row.precos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openAdicionar} onClose={handleCloseAdicionar}> {/*Modal Adicionar*/}
        <DialogTitle className='tituloModal'>Adicionar Venda</DialogTitle>
        <DialogContent className="campos-modais">
          <TextField
            autoFocus
            margin="dense"
            label="Código"
            fullWidth value={novaVenda.codigo}
            onChange={(e) => setNovaVenda({ ...novaVenda, codigo: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Data"
            fullWidth value={novaVenda.data}
            onChange={(e) => setNovaVenda({ ...novaVenda, data: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Produtos"
            fullWidth value={novaVenda.produtos}
            onChange={(e) => setNovaVenda({ ...novaVenda, produtos: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Preço"
            fullWidth value={novaVenda.precos}
            onChange={(e) => setNovaVenda({ ...novaVenda, precos: e.target.value })}
          />

          <Button className='botaoModal' onClick={handleAdicionarVendaTemporaria}>+</Button>
          
          {/* Exibir vendas temporárias e o total */}
          <div style={{ marginTop: "1em" }}>
            {vendasTemporarias.map((venda, index) => (
              <p key={index}>{`${venda.produtos} - ${venda.precos}`}</p>
            ))}
            <p><strong>Total:</strong> R${totalVendas.toFixed(2)}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button className='botaoModal' onClick={handleCloseAdicionar}>Cancelar</Button>
          <Button className='botaoModal' onClick={handleSubmitAdicionarTodasVendas}>Finalizar Vendas</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBuscar} onClose={handleCloseBuscar}> {/*Modal Buscar*/}
        <DialogTitle>Buscar Venda</DialogTitle>
        <DialogContent className="campos-modais">
          <TextField
            autoFocus
            margin="dense"
            label="Código da Venda"
            fullWidth value={codigoBusca}
            onChange={(e) => setCodigoBusca(e.target.value)}
          />
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
