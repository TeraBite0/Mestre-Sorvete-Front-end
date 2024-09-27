import './botaoGerenciamento.css';

const botaoGerenciamento = (props) => {

    return(

        <div className='botaoGerencimento'>
        <div className='botao-salvar'>
        <button>{props.botao}</button>
        </div>
   </div>

    );
}
export default botaoGerenciamento;