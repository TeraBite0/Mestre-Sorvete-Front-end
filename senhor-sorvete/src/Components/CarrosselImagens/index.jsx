import "./carrosselImagens.css";
import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";
import { Link } from "react-router-dom";
import axios from "axios";

export default function BasicDemo() {
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const responsiveOptions = [
    { breakpoint: "1400px", numVisible: 2, numScroll: 1 },
    { breakpoint: "1199px", numVisible: 3, numScroll: 1 },
    { breakpoint: "767px", numVisible: 2, numScroll: 1 },
    { breakpoint: "575px", numVisible: 1, numScroll: 1 },
  ];

  useEffect(() => {
    const fetchRecomendacoes = async () => {
      try {
        const response = await axios.get("http://34.207.75.40:80/api/produtos/recomendacao")
        setRecomendacoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar recomendacoes:", error);
      }
    };
    fetchRecomendacoes();
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % recomendacoes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [recomendacoes.length]);

  const productTemplate = (destaque) => {
    return (
      <div className="card-item">
        <Link to="/cardapio">
          <img
            src={destaque.produto.imagemUrl || "Imagens/casquinhas-de-chocolate.jpeg"}
            // src={destaque.produto.imagemUrl}
            alt={`${destaque.nome} Ice Cream`}
          />
          <h3>{destaque.produto.nome}</h3>
          <p>R${destaque.produto.preco},00</p>
        </Link>
      </div>
    );
  };

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
        activeIndex={activeIndex}
        autoplayInterval={3500}
      />
    </div>
  );
}
