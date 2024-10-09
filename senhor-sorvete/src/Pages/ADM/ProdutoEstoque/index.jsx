import React from 'react';
import './produtoEstoque.css';
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const criarDados = (codigo, dataCompra, dataVencimento, valorLote, unidadesCompradas) => {
    return { codigo, dataCompra, dataVencimento, valorLote, unidadesCompradas };
};

const estiloTabela = {
    tableLayout: 'fixed',
    width: '100%',
};

const estiloCabecalhoTabela = {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
    borderRight: '1px solid #ddd',
    padding: '12px 8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const estiloCelulaTabela = {
    borderRight: '1px solid #ddd',
    fontSize: '15px',
    padding: '12px 8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
};

const ProdutoEstoque = () => {
    const hoje = new Date();
    
    const getCorVencimento = (dataVencimento) => {
        const vencimento = new Date(dataVencimento.split('/').reverse().join('-'));
        const diasAteVencimento = Math.floor((vencimento - hoje) / (1000 * 60 * 60 * 24));
        
        if (diasAteVencimento < 0) return '#A9A9A9'; // Vencidos
        if (diasAteVencimento <= 30) return '#F1C97B'; // Próximos do vencimento
        return '#6FDB64'; // Normais
    };

    const produtos = [
        criarDados(1001, "10/10/2023", "10/12/2024", 150.00, 50),
        criarDados(1002, "15/10/2023", "15/11/2023", 200.50, 75),
        criarDados(1003, "20/10/2023", "20/10/2023", 89.99, 30),
        criarDados(1004, "25/10/2023", "25/07/2024", 300.00, 100),
        criarDados(1005, "01/11/2023", "01/11/2024", 175.50, 60),
        criarDados(1006, "05/11/2023", "05/12/2023", 120.75, 40),
        criarDados(1007, "10/11/2023", "10/11/2024", 250.00, 80),
        criarDados(1008, "15/11/2023", "15/03/2024", 95.25, 35),
        criarDados(1009, "20/11/2023", "20/11/2024", 180.00, 65),
        criarDados(1010, "25/11/2023", "25/05/2024", 135.50, 45),
    ];

    return (
        <>
            <HeaderGerenciamento />
            <div className='estoqueContainer'>
                <div className='barraTopoWrapper'>
                    <BotaoVoltarGerenciamento pagina="/adm/estoque" texto="Voltar ao Estoque" />
                    <span>Marca</span>
                    <div className='wopperWrapper'>
                        <BotaoGerenciamento botao="Buscar" />
                    </div>
                </div>
                <TableContainer component={Paper}>
                    <Table sx={estiloTabela} aria-label="tabela de estoque">
                        <TableHead>
                            <TableRow>
                                <TableCell style={estiloCabecalhoTabela}>Código</TableCell>
                                <TableCell style={estiloCabecalhoTabela}>Data da Compra</TableCell>
                                <TableCell style={estiloCabecalhoTabela}>Data de Vencimento</TableCell>
                                <TableCell style={estiloCabecalhoTabela}>Valor do Lote</TableCell>
                                <TableCell style={estiloCabecalhoTabela}>Unidades Compradas</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {produtos.map((produto) => (
                                <TableRow key={produto.codigo}>
                                    <TableCell style={estiloCelulaTabela}>{produto.codigo}</TableCell>
                                    <TableCell style={estiloCelulaTabela}>{produto.dataCompra}</TableCell>
                                    <TableCell style={{
                                        ...estiloCelulaTabela,
                                        backgroundColor: getCorVencimento(produto.dataVencimento)
                                    }}>
                                        {produto.dataVencimento}
                                    </TableCell>
                                    <TableCell style={estiloCelulaTabela}>R$ {produto.valorLote.toFixed(2)}</TableCell>
                                    <TableCell style={estiloCelulaTabela}>{produto.unidadesCompradas}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default ProdutoEstoque;