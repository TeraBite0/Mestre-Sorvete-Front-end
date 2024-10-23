import React from "react";
import "./notFound.css";
import Header from "../../Components/Header";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="notfound">
        <h1>Página não encontrada!</h1>
        <h2>404</h2>
        {/* <img src="" alt="Erro 404" /> */}
      </div>
    </>
  );
};

export default NotFound;
