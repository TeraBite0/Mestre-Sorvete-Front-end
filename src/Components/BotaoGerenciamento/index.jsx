import React from 'react';
import './botaoGerenciamento.css';

const BotaoGerenciamento = ({ botao, onClick, className }) => {
    return (
        <div className='botaoGerencimento'>
            <div className='botao-salvar'>
                <button onClick={onClick} className={className}>{botao}</button>
            </div>
        </div>
    );
};

export default BotaoGerenciamento;