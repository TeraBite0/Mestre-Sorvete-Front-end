import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import './listarProdutos.css';
import TableContainer from '@mui/material/TableContainer';
import { Fragment, useEffect, useState } from 'react';
import axios from "axios";
import HeaderGerenciamento from '../../../Components/HeaderGerenciamento';
import Pesquisa from '../../../Components/Pesquisa';
import BotaoGerenciamento from '../../../Components/BotaoGerenciamento';

const ListarProdutos = () => {
    
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/produtos')
        .then(resposta => setProdutos(resposta.data))
        .catch(error => console.error(error));
    }, []);

    return(
        
        <Fragment>
        
        <div className='header-tabela'>
            <HeaderGerenciamento/>     
    
        </div>
         
         <div className='barraPesquisa'>
            <Pesquisa
                placeholder="Produto, Marca..."
            />

            <BotaoGerenciamento
                botao="+ Novo Produto"
            />
         </div>

        <div className='tabela'>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 200}} arial-label="Tabela">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Marca</TableCell>
                            <TableCell>Preço</TableCell>
                            <TableCell>Quant.Estoque</TableCell>
                            <TableCell>Imagem</TableCell>
                            <TableCell>Editar</TableCell>
                            <TableCell>Excluir</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {produtos.map(produto => (
                            <TableRow key={produto.id}>
                                <TableCell>{produto.nome}</TableCell>
                                <TableCell>{produto.marca}</TableCell>
                                <TableCell>{produto.preco}</TableCell>
                                <TableCell>{produto.quantidadeEstoque}</TableCell>
                                <TableCell>
                                    <img src={produto.imagemUrl} alt={produto.nome} width="50" height="50"/>
                                </TableCell>
                                <TableCell>
                                    <button>Editar</button>
                                </TableCell>
                                <TableCell>
                                    <button>Excluir</button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        </Fragment>
    );

}
export default ListarProdutos;