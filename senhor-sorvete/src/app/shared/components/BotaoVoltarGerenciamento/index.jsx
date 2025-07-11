import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./BotaoVoltarGerenciamento.css";
import { useNavigate } from "react-router-dom";

const BotaoVoltarGerenciamento = ({ pagina, texto }) => {
  const navigate = useNavigate();

  if (pagina === "" || pagina == null) {
    pagina = "/home/gerenciamento";
  }

  const handleVoltar = () => {
    navigate(pagina);
  };

  if (texto === "" || texto == null) {
    texto = "Voltar a página inicial";
  }

  return (
    <button className="voltarGerenciamentoBtn" onClick={handleVoltar}>
      <ArrowBackIcon className="arrow-icon" />
      <span>{texto}</span>
    </button>
  );
};

export default BotaoVoltarGerenciamento;
