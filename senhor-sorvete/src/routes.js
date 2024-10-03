import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Cardapio from "./Pages/Cardapio/cardapio";
import Gastronomia from "./Pages/Gastronomia";
import Contato from "./Pages/Contato";
import HomeGerenciamento from "./Pages/HomeGerenciamento";
import ListarProdutos from "../src/Pages/ADM/listarProdutos";
import Recomendacao from "./Pages/ADM/Recomendacoes";
import Estoque from "./Pages/ADM/Estoque";
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
                <Route path="/adm/recomendacao" element={<Recomendacao/>}></Route>
                <Route path="/adm/estoque" element={<Estoque/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;