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

function createData(codigo, data, produtos, precos) {
  return { codigo, data, produtos, precos };
}

const rows = [
  createData(23459, "27-09-2024", "Sorvete Limão seco", "R$" + 20.0),
  createData(12345, "28-09-2024", "Sorvete Castanha do Paraná", "R$" + 25.0),
  createData(67890, "29-09-2024", "Sorvete Guns and Ices", "R$" + 16.0),
  createData(78908, "02-10-2024", "Sorvete Cachorro Caramelo", "R$" + 15.0),
  createData(74656, "05-10-2024", "Sorvete Morango", "R$" + 20.0),
];

const Vendas = () => {
  return (
    <div className="container-vendas">
      <HeaderGerenciamento />
      <BotaoVoltarGerenciamento />
      <h1>Vendas</h1>
      <TableContainer component={Paper} className="tabela-cont">
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead className="tabela-Head">
            <TableRow>
              <TableCell className="tabela-Head">Código</TableCell>
              <TableCell className="tabela-Head" align="right">
                Data
              </TableCell>
              <TableCell className="tabela-Head" align="right">
                Produtos
              </TableCell>
              <TableCell className="tabela-Head" align="right">
                Preços
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.codigo}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.codigo}
                </TableCell>
                <TableCell align="right">{row.data}</TableCell>
                <TableCell align="right">{row.produtos}</TableCell>
                <TableCell align="right">{row.precos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Vendas;
