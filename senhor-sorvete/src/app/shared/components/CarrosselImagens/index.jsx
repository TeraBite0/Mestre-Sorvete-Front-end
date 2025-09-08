import "./carrosselImagens.css";
import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CarrosselImagens() {
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [index, setIndex] = useState(0);

  const responsiveOptions = [
    { breakpoint: "1400px", numVisible: 2, numScroll: 1 },
    { breakpoint: "1199px", numVisible: 3, numScroll: 1 },
    { breakpoint: "767px", numVisible: 2, numScroll: 1 },
    { breakpoint: "575px", numVisible: 1, numScroll: 1 },
  ];

  useEffect(() => {
    const fetchRecomendacoes = async () => {
      try {
        const response = await axios.get(
          "https://mestre-sorvete-back-end.onrender.com/produtos/recomendacao"
        );
        setRecomendacoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar recomendacoes:", error);
      }
    };
    fetchRecomendacoes();
  }, []);

  const productTemplate = (destaque) => (
    <div className="card-item">
      <Link to="/cardapio">
        <img
          src={destaque.produto.imagemUrl || "Imagens/casquinhas-de-chocolate.jpeg"}
          alt={`${destaque.produto.nome} Ice Cream`}
        />
        <h3>{destaque.produto.nome}</h3>
        <p>R${destaque.produto.preco.toFixed(2).replace(".", ",")}</p>
      </Link>
    </div>
  );

  return (
    <div className="card">
      <h1>Eu Quero!</h1>
      <Carousel
        value={recomendacoes}
        numVisible={3}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        itemTemplate={productTemplate}
        showIndicators={false}
        circular
        autoplayInterval={5000} // autoplay automático
      />
    </div>
  );
}
