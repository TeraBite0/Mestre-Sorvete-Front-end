import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./BotaoVoltarGerenciamento.css"
import { useNavigate } from 'react-router-dom';


const BotaoVoltarGerenciamento = ({ pagina }) => {
    const navigate = useNavigate();

    const handleVoltar = () => {
        navigate('/home/gerenciamento');
    };
    return (
        <button className="voltarGerenciamentoBtn" onClick={handleVoltar}>
            <ArrowBackIcon className="arrow-icon" /> 
            <span>Voltar para o início</span>
        </button>
    )
}



export default BotaoVoltarGerenciamento;