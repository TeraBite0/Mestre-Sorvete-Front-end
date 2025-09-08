import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

type ProdutoDestaque = {
  id: number;
  nome: string;
  preco: number;
  imagemUrl: string;
  texto: string;
  produto: {
    id: number;
    nome: string;
    preco: number;
    imagemUrl: string;
  }
};

const useHome = () => {
    const [dataAtual, setDataAtual] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [destaqueDia, setDestaqueDia] = useState<ProdutoDestaque | null>(null);
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
                    "https://mestre-sorvete-back-end.onrender.com/produtos/destaque",
                    {
                        method: "GET",
                        headers: {
                            Accept: "*/*",
                        },
                    }
                );

                if (resposta.status !== 200) {
                    console.error("Erro do servidor:", resposta.status);
                } else {
                    const data = await resposta.json();
                    setDestaqueDia(data);
                }
            } catch (error) {
                console.error("Erro ao fazer a requisição:", error);
            }
        };

        fetchDestaque();
    }, []);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (validateEmail(email)) {
            setError("");
            navigate("/cardapio");
        } else {
            setError("Por favor, insira um E-mail válido.");
        }
    };

    return {
        dataAtual,
        email,
        setEmail,
        error,
        handleSubmit,
        destaqueDia,
        Link,
    }
}

export default useHome;