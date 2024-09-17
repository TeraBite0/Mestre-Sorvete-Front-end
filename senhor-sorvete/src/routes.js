import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Cardapio from "./Pages/Cardapio";



const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
                <Route path="/cardapio" element={<Cardapio/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;