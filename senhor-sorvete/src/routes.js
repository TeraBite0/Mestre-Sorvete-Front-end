import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Cardapio from "./Pages/Cardapio/cardapio";
import Gastronomia from "./Pages/Gastronomia"


const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/cardapio" element={<Cardapio/>}></Route>
                <Route path="/" element={<Gastronomia/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;