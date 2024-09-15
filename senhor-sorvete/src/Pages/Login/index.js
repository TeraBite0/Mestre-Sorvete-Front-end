import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import CampoTexto from '../../Components/CampoTexto';
import Botao from '../../Components/Botao';

const Login = () => {

    const[email, setEmail] = useState('');
    const[senha, setSenha] = useState('');
    const navigate = useNavigate();


    const aoSalvar = (evento) => {
        evento.preventDefault()

        if(!email || !senha) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email))  {
            alert('Por favor, insira um email válido.');
            return;
        
        } else if(senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if(email === 'josue@gmail.com' && senha === 'sorvete123') {
            navigate('/home');

        } else {
            alert ('Credenciais inválidas')
        }
    }

    return(
        <div className='login' aria-label='Contéudo para o cliente acessar o site'>
            <div className='login-banner'>
            <form onSubmit={aoSalvar}>
                <h1>Login</h1>
                <span>Estamos felizes em rever você novamente!</span>
                <span>Acesse sua conta</span>
                <div className='campo-texto-container' aria-label='Campos que o cliente deve preencher '>
                <CampoTexto
                    obrigatorio={true}
                    label = "E-mail:"
                    placeholder = "exemplo@email.com"
                    valor={email}  
                    aoAlterado={valor => setEmail(valor)}
                />

                <CampoTexto
                    obrigatorio={true}
                    label= "Senha:"
                    placeholder = "Digite sua senha"
                    valor = {senha}
                    aoAlterado = {valor => setSenha(valor)}
                />
            </div>
                <Botao>
                    Entrar
                </Botao>
            </form>

            <a href=''>Esqueci minha senha</a>

            </div>

            <div className='bem-vindo'>
                
                <p>Bem-vindo ao sistema de gestão! Para acessar suas funcionalidades de gerenciamento, por favor, insira suas credenciais ao lado.</p>

            </div>

        </div>
    );

}

export default Login;