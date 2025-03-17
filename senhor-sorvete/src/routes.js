import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Cardapio from "./Pages/Cardapio/cardapio";
import Gastronomia from "./Pages/Gastronomia";
import Contato from "./Pages/Contato";
import HomeGerenciamento from "./Pages/HomeGerenciamento";
import ListarProdutos from "../src/Pages/ADM/listarProdutos";
import Destaque from "./Pages/ADM/Destaque";
import Recomendacoes from "./Pages/ADM/Recomendacoes"
import Estoque from "./Pages/ADM/Estoque";
import Vendas from "./Pages/ADM/Vendas/vendas";
import CadastrarSenha from "./Pages/ADM/CadastrarSenha";
import ProdutoEstoque from "./Pages/ADM/ProdutoEstoque";
import Dashboard from "./Pages/ADM/Dashboard";
import NotFound from "./Pages/NotFound";

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
                <Route path= "/adm/vendas" element={<Vendas/>}/>
                <Route path="/adm/cadastrar-senha" element={<CadastrarSenha/>}/>
                <Route path="/adm/dashboard" element={<Dashboard/>}/>
                <Route path="*" element={<NotFound />} />

                {/* TODO: TROCAR O CAMINHO PARA ":idEstoque" para receber o id do produto na URL */}
                <Route path="/adm/produto-estoque" element={<ProdutoEstoque/>}/>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;