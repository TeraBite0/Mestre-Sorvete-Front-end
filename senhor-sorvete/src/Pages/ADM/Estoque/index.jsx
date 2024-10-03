import * as React from 'react';
import './estoque.css';
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento"
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import CampoTexto from "../../../Components/CampoTexto"
import Pesquisa from "../../../Components/Pesquisa"
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function criarDados(
    codigo,
    nome,
    marca,
    preco,
    qtdEmEstoque,
) {
    return { codigo, nome, marca, preco, qtdEmEstoque };
}

const getQuantidadeColor = (quantidade) => {
    if (quantidade === 0) return '#818d91'
    if (quantidade <= 10) return '#fc8886'; // Vermelho claro
    if (quantidade <= 30) return '#fafa9d'; // Amarelo claro
    return '#90EE90'; // Verde claro
};

const Estoque = () => {
    let produtos = [
        criarDados(1001, "Morango", "Maneiro", 12.99, 5),
        criarDados(1002, "Chocolate", "Massa", 13.99, 20),
        criarDados(1003, "Limão", "KeBaum", 5.99, 100),
        criarDados(1004, "Pistache", "Orggi", 15.99, 0),
        criarDados(1005, "Coco", "Kaskinha", 7.99, 50),
    ];

    const tableHeaderStyle = {
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        borderRight: '1px solid #ddd',
    };

    const tableCellStyle = {
        borderRight: '1px solid #ddd',
    };

    return (
        <>
            <HeaderGerenciamento />
            <div className='estoqueContainer'>
                <BotaoVoltarGerenciamento pagina="Estoque" />
                <div className='controlesWrapper'>
                    <Pesquisa />
                    <div className='wopperWrapper'>
                        <BotaoGerenciamento botao="Registrar Perda" />
                        <BotaoGerenciamento botao="Adicionar Lote" />
                    </div>
                </div>
                <span>Atualmente {produtos.length} produtos cadastrados</span>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="tabela de estoque">
                        <TableHead>
                            <TableRow>
                                <TableCell style={tableHeaderStyle}>Código</TableCell>
                                <TableCell style={tableHeaderStyle}>Nome</TableCell>
                                <TableCell style={tableHeaderStyle}>Marca</TableCell>
                                <TableCell style={tableHeaderStyle}>Preço</TableCell>
                                <TableCell style={tableHeaderStyle}>Quantidade em Estoque</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {produtos.map((produto) => (
                                <TableRow
                                    key={produto.codigo}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell style={tableCellStyle} component="th" scope="row">
                                        {produto.codigo}
                                    </TableCell>
                                    <TableCell style={tableCellStyle} align="left">{produto.nome}</TableCell>
                                    <TableCell style={tableCellStyle} align="left">{produto.marca}</TableCell>
                                    <TableCell style={tableCellStyle} align="right">{produto.preco.toFixed(2)}</TableCell>
                                    <TableCell
                                        style={{
                                            ...tableCellStyle,
                                            backgroundColor: getQuantidadeColor(produto.qtdEmEstoque),
                                        }}
                                        align="center"
                                    >
                                        {produto.qtdEmEstoque}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default Estoque;