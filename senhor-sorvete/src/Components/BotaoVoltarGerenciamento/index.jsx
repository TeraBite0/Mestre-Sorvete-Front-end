import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./BotaoVoltarGerenciamento.css"
import { useNavigate } from 'react-router-dom';


const BotaoVoltarGerenciamento = ({ pagina, texto }) => {
    const navigate = useNavigate();

    const handleVoltar = () => {
        navigate('/home/gerenciamento');
    };

    if (texto === "" || texto == null) {
        texto = "Voltar a página inicial"
    }

    return (
        <button className="voltarGerenciamentoBtn" onClick={handleVoltar}>
            <ArrowBackIcon className="arrow-icon" /> 
            <span>{texto}</span>
        </button>
    )
}



export default BotaoVoltarGerenciamento;