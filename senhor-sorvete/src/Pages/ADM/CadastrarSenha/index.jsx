import './cadastrarSenha.css';
import HeaderGerenciamento from '../../../Components/HeaderGerenciamento';
import { useState } from 'react';

const CadastrarSenha = (props) => {

    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');

    const validarSenhas = () => {
        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem');
        } else {
            setErro('');
            console.log('Senha cadastrada com sucesso!');
        }
    }

    return (
        <>
            <HeaderGerenciamento />

            <div className='titulo-cadastrar'>
                <h2>Cadastrar nova senha</h2>
            </div>

            <div className='inputs-cadastrar' aria-label='Cadastrar nova senha do usuário'>
                <div className="campo-texto">
                    <label htmlFor="nova-senha">Nova senha</label>
                    <input
                        id="nova-senha"
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                <div className="campo-texto">
                    <label htmlFor="confirmar-senha">Digite a senha novamente</label>
                    <input
                        id="confirmar-senha"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                    />
                </div>

                {erro && <p className="erro-senha">{erro}</p>}
                
                <button onClick={validarSenhas}>Cadastrar Senha</button>
            </div>
        </>
    );
}

export default CadastrarSenha;
