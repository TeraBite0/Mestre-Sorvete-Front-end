import React, { useEffect } from "react";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { saveStateToLocalStorage } from "./utils/localStorageUtils";

function App() {
  const { listaProdutosAtivos, produtosFiltrados, carrinho, minhaLista } = useSelector(
    (state: RootState) => state.produtos
  );

  // Salva no localStorage sempre que algum estado mudar
  useEffect(() => {
    saveStateToLocalStorage("listaProdutosAtivos", listaProdutosAtivos);
    saveStateToLocalStorage("produtosFiltrados", produtosFiltrados);
    saveStateToLocalStorage("carrinho", carrinho);
    saveStateToLocalStorage("minhaLista", minhaLista);
  }, [listaProdutosAtivos, produtosFiltrados, carrinho, minhaLista]);

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;