import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";


const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;