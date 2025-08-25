import React from "react";
import Header from "../../shared/components/Header";
import "./notFound.css";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="notfound">
        <h1>Página não encontrada!</h1>
        <img src="Imagens/404-icon.webp" alt="Erro 404" />
      </div>
    </>
  );
};

export default NotFound;
