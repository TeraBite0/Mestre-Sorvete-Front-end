import React, { useState } from 'react';
import './estoque.css';
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import Pesquisa from "../../../Components/Pesquisa";
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";
import ModalGerenciamento from '../../../Components/ModalGerenciamento';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const criarDados = (codigo, nome, marca, preco, qtdEmEstoque) => {
    return { codigo, nome, marca, preco, qtdEmEstoque };
};

const obterCorQuantidade = (quantidade) => {
    if (quantidade === 0) return '#818d91';
    if (quantidade <= 10) return '#fc8886';
    if (quantidade <= 30) return '#fafa9d';
    return '#90EE90';
};

const estiloCabecalhoTabela = {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
    borderRight: '1px solid #ddd',
};

const estiloCelulaTabela = {
    borderRight: '1px solid #ddd',
};

const Estoque = () => {
    const [abrirRegistrarPerda, setAbrirRegistrarPerda] = useState(false);
    const [abrirAdicionarLote, setAbrirAdicionarLote] = useState(false);

    const produtos = [
        criarDados(1001, "Morango", "Maneiro", 12.99, 5),
        criarDados(1002, "Chocolate", "Massa", 13.99, 20),
        criarDados(1003, "Limão", "KeBaum", 5.99, 100),
        criarDados(1004, "Pistache", "Orggi", 15.99, 0),
        criarDados(1005, "Coco", "Kaskinha", 7.99, 50),
    ]; 

    const abrirModalRegistrarPerda = () => setAbrirRegistrarPerda(true);
    const fecharModalRegistrarPerda = () => setAbrirRegistrarPerda(false);
    const abrirModalAdicionarLote = () => setAbrirAdicionarLote(true);
    const fecharModalAdicionarLote = () => setAbrirAdicionarLote(false);

    const camposRegistrarPerda = [
        { label: "Nome" },
        { label: "Marca" },
        { label: "Quantidade", type: "number" },
    ];

    const camposAdicionarLote = [
        { label: "Produto" },
        { label: "Marca" },
        { label: "Quantidade comprada", type: "number" },
        { label: "Data da compra", type: "date" },
        { label: "Valor da nota", type: "number" },
        { label: "Previsão de entrega", type: "date" },
    ];

    return (
        <>
            <HeaderGerenciamento />
            <div className='estoqueContainer'>
                <BotaoVoltarGerenciamento pagina="Estoque" />
                <div className='controlesWrapper'>
                    <Pesquisa />
                    <div className='wopperWrapper'>
                        <BotaoGerenciamento botao="Registrar Perda" onClick={abrirModalRegistrarPerda} />
                        <BotaoGerenciamento botao="Adicionar Lote" onClick={abrirModalAdicionarLote} />
                    </div>
                </div>
                <span>Atualmente {produtos.length} produtos cadastrados</span>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="tabela de estoque">
                        <TableHead>
                            <TableRow>
                                <TableCell style={estiloCabecalhoTabela}>Código</TableCell>
                                <TableCell style={estiloCabecalhoTabela}>Nome</TableCell>
                                <TableCell style={estiloCabecalhoTabela}>Marca</TableCell>
                                <TableCell style={estiloCabecalhoTabela}>Preço</TableCell>
                                <TableCell style={estiloCabecalhoTabela}>Quantidade em Estoque</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {produtos.map((produto) => (
                                <TableRow key={produto.codigo}>
                                    <TableCell style={estiloCelulaTabela}>{produto.codigo}</TableCell>
                                    <TableCell style={estiloCelulaTabela}>{produto.nome}</TableCell>
                                    <TableCell style={estiloCelulaTabela}>{produto.marca}</TableCell>
                                    <TableCell style={estiloCelulaTabela} align="right">{produto.preco.toFixed(2)}</TableCell>
                                    <TableCell
                                        style={{
                                            ...estiloCelulaTabela,
                                            backgroundColor: obterCorQuantidade(produto.qtdEmEstoque),
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

            <ModalGerenciamento
                open={abrirRegistrarPerda}
                onClose={fecharModalRegistrarPerda}
                title="Registrar Perda"
                fields={camposRegistrarPerda}
                onSave={fecharModalRegistrarPerda}
            />

            <ModalGerenciamento
                open={abrirAdicionarLote}
                onClose={fecharModalAdicionarLote}
                title="Adicionar Lote"
                fields={camposAdicionarLote}
                onSave={fecharModalAdicionarLote}
            />
        </>
    );
};

export default Estoque;
