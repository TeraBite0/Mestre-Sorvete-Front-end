import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import CampoTexto from '../../Components/CampoTexto';
import Botao from '../../Components/Botao';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const Login = () => {

    const[email, setEmail] = useState('');
    const[senha, setSenha] = useState('');
    const navigate = useNavigate();


    const aoSalvar = (evento) => {
        evento.preventDefault()

        if(!email || !senha) {
            toast.error('Por favor, preencha todos os campos!');
            return;
        }
       
            //Realiza a validação das informações
         axios.post('http://localhost:8080/usuarios/login', {
                email: email,
                senha: senha
            })
            .then((response) => {
                if(response.status === 200) {
                    const data = response.data;
                    sessionStorage.setItem('token', data.token); //Vai receber um toker e armazenar
                    sessionStorage.setItem('usuario', JSON.stringify(data.usuario)) // Armazena os dados do usuario
                    navigate('/home/gerenciamento');
                } else {
                    toast.error('Credenciais Inválidas!');
                }
            })
            .catch((error) => {
                console.error('Erro ao realizar o login!', error);
                toast.error('Ocorreu um erro ao efetuar login. Tente novamente!');
            });           

        }
            
    return(
        <div className='login' aria-label='Contéudo para o cliente acessar o site'>
            <div className='bem-vindo'>
                <p>Bem-vindo ao sistema de gestão! Para acessar suas funcionalidades de gerenciamento, por favor, insira suas credenciais ao lado.</p>
            </div>
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

            <a href='/adm/cadastrar-senha'>Esqueci minha senha</a>

            </div>


        </div>
    );

}

export default Login;