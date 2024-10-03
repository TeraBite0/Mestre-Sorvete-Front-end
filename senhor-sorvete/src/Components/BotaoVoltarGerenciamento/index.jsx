import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./BotaoVoltarGerenciamento.css"

const BotaoVoltarGerenciamento = (props) => {
    return (
        <div className="voltarGerenciamentoBtn">
            <ArrowBackIcon className="arrow-icon" /> 
            <span>{props.pagina}</span>
        </div>
    )
}

export default BotaoVoltarGerenciamento;