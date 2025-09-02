import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./app/pages/home/Home";
import Login from "./app/pages/Login";
import Cardapio from "./app/pages/cardapio/cardapio";
import Gastronomia from "./app/pages/Gastronomia";
import Contato from "./app/pages/Contato";
import HomeGerenciamento from "./app/pages/HomeGerenciamento";
import ListarProdutos from "./app/pages/ADM/listarProdutos";
import Destaque from "./app/pages/ADM/Destaque";
import Recomendacoes from "./app/pages/ADM/Recomendacoes"
import Estoque from "./app/pages/ADM/Estoque";
import Saidas from "./app/pages/ADM/Saidas/saidas";
import CadastrarSenha from "./app/pages/ADM/CadastrarSenha";
import ProdutoEstoque from "./app/pages/ADM/ProdutoEstoque";
import Dashboard from "./app/pages/ADM/Dashboard";
import LGPD from "./app/shared/components/LGPD";
import NotFound from "./app/pages/NotFound";

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