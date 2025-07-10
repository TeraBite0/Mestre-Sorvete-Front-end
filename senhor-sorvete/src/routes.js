import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/home/Home";
import Login from "./Pages/login";
import Cardapio from "./Pages/cardapio/cardapio";
import Gastronomia from "./Pages/gastronomia";
import Contato from "./Pages/contato";
import HomeGerenciamento from "./Pages/homeGerenciamento";
import ListarProdutos from "../src/Pages/adm/listarProdutos";
import Destaque from "./Pages/adm/destaque";
import Recomendacoes from "./Pages/adm/recomendacoes"
import Estoque from "./Pages/adm/estoque";
import Saidas from "./Pages/adm/saidas/saidas";
import CadastrarSenha from "./Pages/adm/cadastrarSenha";
import ProdutoEstoque from "./Pages/adm/produtoEstoque";
import Dashboard from "./Pages/adm/dashboard";
import LGPD from "./Components/LGPD";
import NotFound from "./Pages/notFound";

const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/cardapio" element={<Cardapio/>}></Route>
                <Route path="/gastronomia" element={<Gastronomia/>}></Route>
                <Route path="/contato" element={<Contato/>}></Route>
                <Route path="/home/gerenciamento" element={<HomeGerenciamento/>}></Route>
                <Route path="/adm/listarProdutos" element={<ListarProdutos/>}></Route>
                <Route path="/adm/destaque" element={<Destaque/>}></Route>
                <Route path="/adm/recomendacoes" element={<Recomendacoes/>}></Route>
                <Route path="/adm/estoque" element={<Estoque/>}/>
                <Route path= "/adm/saidas" element={<Saidas/>}/>
                <Route path="/adm/cadastrar-senha" element={<CadastrarSenha/>}/>
                <Route path="/adm/dashboard" element={<Dashboard/>}/>
                <Route path="/Components/LGPD" element={<LGPD/>}/>
                <Route path="*" element={<NotFound />} />

                {/* TODO: TROCAR O CAMINHO PARA ":idEstoque" para receber o id do produto na URL */}
                <Route path="/adm/produto-estoque/:id" element={<ProdutoEstoque/>}/>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;