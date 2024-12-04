import './cadastrarSenha.css';
import HeaderGerenciamento from '../../../Components/HeaderGerenciamento';
import BotaoGerenciamento from '../../../Components/BotaoGerenciamento';
import { ToastContainer, toast } from 'react-toastify'; // Importa o ToastContainer e a função toast
import 'react-toastify/dist/ReactToastify.css'; // Importa os estilos
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { useState } from 'react';

const CadastrarSenha = () => {
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const navigate = useNavigate(); 

    const validarSenhas = () => {

        if (senha.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres.');
            return;
        
        }else if (senha !== confirmarSenha) {
            toast.error('As senhas não coincidem'); 
            return;
        } 
            toast.success('Senha cadastrada com sucesso!'); 
           
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        }
    

    return (
        <>
            <HeaderGerenciamento />
            <div className='main-container'>
                <div className='titulo-cadastrar'>
                    <h2>Cadastrar nova senha</h2>
                </div>

                <div className='inputs-cadastrar' aria-label='Cadastrar nova senha do usuário'>
                    <div className="campo-texto-cadastrar">
                        <label htmlFor="senha">Nova senha</label>
                        <input
                            type="password"
                            id="senha"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div className="campo-texto-cadastrar">
                        <label htmlFor="confirmar-senha">Digite a senha novamente</label>
                        <input
                            type="password"
                            id="confirmar-senha"
                            placeholder="Confirme sua senha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                        />
                    </div>

                    <div className='botao-atualizar'>
                        <BotaoGerenciamento
                            botao='Atualizar Senha'
                            onClick={validarSenhas}
                        />
                    </div>
    
                </div>
            </div>

         <ToastContainer />
        </>
    );
}

export default CadastrarSenha;