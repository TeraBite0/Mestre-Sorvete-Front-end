import React, { useState } from 'react';
import './estoque.css';
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from '../../../Components/BotaoVoltarGerenciamento';
import Pesquisa from "../../../Components/Pesquisa";
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Box, Typography, TextField } from '@mui/material';

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

const estiloModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 'auto',
    maxHeight: '80vh', 
    overflowY: 'auto', 
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
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

            <Modal
                open={abrirRegistrarPerda}
                onClose={fecharModalRegistrarPerda}
                aria-labelledby="modal-registrar-perda"
            >
                <Box sx={estiloModal}>
                    <Typography id="modal-registrar-perda" variant="h6" component="h2" mb={2}>
                        Registrar Perda
                    </Typography>
                    <TextField fullWidth label="Nome" variant="outlined" margin="normal" />
                    <TextField fullWidth label="Marca" variant="outlined" margin="normal" />
                    <TextField fullWidth label="Quantidade" type="number" variant="outlined" margin="normal" />
                    <Box className="modal-button-container">
                        <BotaoGerenciamento botao="Salvar" onClick={fecharModalRegistrarPerda} />
                        <BotaoGerenciamento botao="Cancelar" onClick={fecharModalRegistrarPerda} />
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={abrirAdicionarLote}
                onClose={fecharModalAdicionarLote}
                aria-labelledby="modal-adicionar-lote"
            >
                <Box sx={estiloModal}>
                    <Typography id="modal-adicionar-lote" variant="h6" component="h2" mb={2}>
                        Adicionar Lote
                    </Typography>
                    <TextField fullWidth label="Produto" variant="outlined" margin="normal" />
                    <TextField fullWidth label="Marca" variant="outlined" margin="normal" />
                    <TextField fullWidth label="Quantidade comprada" type="number" variant="outlined" margin="normal" />
                    <TextField
                        fullWidth
                        label="Data da compra"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField fullWidth label="Valor da nota" type="number" variant="outlined" margin="normal" />
                    <TextField
                        fullWidth
                        label="Previsão de entrega"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        margin="normal"
                    />
                    <Box className="modal-button-container">
                        <BotaoGerenciamento botao="Salvar" onClick={fecharModalAdicionarLote} className="modal-button" />
                        <BotaoGerenciamento botao="Cancelar" onClick={fecharModalAdicionarLote} className="modal-button" />
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default Estoque;
