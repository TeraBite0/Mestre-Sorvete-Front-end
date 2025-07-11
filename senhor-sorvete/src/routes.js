import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./app/pages/homes/Home";
import Login from "./app/pages/login";
import Cardapio from "./app/pages/cardapio/cardapio";
import Gastronomia from "./app/pages/gastronomia";
import Contato from "./app/pages/contato";
import HomeGerenciamento from "./app/pages/homeGerenciamento";
import ListarProdutos from "./app/pages/adm/listarProdutos";
import Destaque from "./app/pages/adm/destaque";
import Recomendacoes from "./app/pages/adm/recomendacoes"
import Estoque from "./app/pages/adm/estoque";
import Saidas from "./app/pages/adm/saidas/saidas";
import CadastrarSenha from "./app/pages/adm/cadastrarSenha";
import ProdutoEstoque from "./app/pages/adm/produtoEstoque";
import Dashboard from "./app/pages/adm/dashboard";
import LGPD from "./app/shared/components/LGPD";
import NotFound from "./app/pages/notFound";

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
                <Route path="/components/LGPD" element={<LGPD/>}/>
                <Route path="*" element={<NotFound />} />

                {/* TODO: TROCAR O CAMINHO PARA ":idEstoque" para receber o id do produto na URL */}
                <Route path="/adm/produto-estoque/:id" element={<ProdutoEstoque/>}/>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;