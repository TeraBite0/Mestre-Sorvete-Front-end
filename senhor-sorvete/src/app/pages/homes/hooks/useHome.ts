import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useHome = () => {
    // Função data atual
  const [dataAtual, setDataAtual] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [destaqueDia, setDestaqueDia] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    setDataAtual(`${dia}/${mes}/${ano}`);

    const fetchDestaque = async () => {
      try {
        const resposta = await fetch(
          "http://34.207.75.40:80/api/produtos/destaque",
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );

        if (resposta.status !== 200) {
          // Se o status não for 200, registra o erro
          console.error("Erro do servidor:", resposta.status);
        } else {
          const data = await resposta.json();
          setDestaqueDia(data); // Armazena os dados no estado
        }
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    };

    fetchDestaque();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateEmail(email)) {
      setError("");
      navigate("/cardapio");
    } else {
      setError("Por favor, insira um E-mail válido.");
    }
  };
}

export default useHome;