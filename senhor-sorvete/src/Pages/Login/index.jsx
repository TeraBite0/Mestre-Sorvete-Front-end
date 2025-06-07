import "./login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const aoSalvar = (evento) => {
    evento.preventDefault();

    if (!email || !senha) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }

    // Realiza a validação das informações
    axios
      .post("http://52.71.251.167:80/api/usuarios/login", {
        email: email,
        senha: senha,
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          sessionStorage.setItem("token", data.token); // Armazena o token
          sessionStorage.setItem("usuario", JSON.stringify(data.usuario)); // Armazena os dados do usuario
          navigate("/home/gerenciamento");
        } else {
          toast.error("Credenciais Inválidas!");
        }
      })
      .catch((error) => {
        console.error("Erro ao realizar o login!", error);
        toast.error("Ocorreu um erro ao efetuar login. Tente novamente!");
      });
  };

  return (
    <div
      className="loginContainer"
      aria-label="Conteúdo para o cliente acessar o site"
    >
      <div className="loginLeft">
        <h1>Login</h1>
        <p>Estamos felizes em te ver novamente! Acesse sua conta.</p>
        <form
          onSubmit={aoSalvar}
          aria-label="Campos que o cliente deve preencher"
        >
          <label>E-mail:</label>
          <input
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Senha:</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
          {/* <a href="/adm/cadastrar-senha">Esqueci minha senha</a> */}
        </form>
        <p style={{ marginTop: '2rem', fontSize: '16px', width: '70%' }}>
          Ao entrar, você declara estar ciente e de acordo com os{' '}
          <a href="/Components/LGPD" target="_blank" rel="noopener noreferrer">
            <b>termos da Política de Privacidade</b>
          </a>.
        </p>
      </div>
      <div className="loginRight">
        <p>
          Bem-vindo ao sistema de gestão!
          <br />
          Para acessar suas funcionalidades de gerenciamento, por favor, insira
          suas credenciais.
        </p>
      </div>
    </div>
  );
};

export default Login;
