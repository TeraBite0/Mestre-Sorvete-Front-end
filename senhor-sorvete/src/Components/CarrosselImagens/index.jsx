import "./carrosselImagens.css";
import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";
import { Link } from "react-router-dom";
import axios from "axios";

export default function BasicDemo() {
  const [produtos, setProdutos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const responsiveOptions = [
    { breakpoint: "1400px", numVisible: 2, numScroll: 1 },
    { breakpoint: "1199px", numVisible: 3, numScroll: 1 },
    { breakpoint: "767px", numVisible: 2, numScroll: 1 },
    { breakpoint: "575px", numVisible: 1, numScroll: 1 },
  ];

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/produtos/recomendacao")
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } 
    };
    fetchProdutos();
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % produtos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [produtos.length]);

  const productTemplate = (produto) => {
    return (
      <div className="card-item">
        <Link to="/cardapio">
          <img
            src="Imagens/casquinhas-de-chocolate.jpeg"
            alt={`${produto.nome} Ice Cream`}
          />
          <h3>{produto.nome}</h3>
          <p>R${produto.preco},00</p>
        </Link>
      </div>
    );
  };

  return (
    <div className="card">
      <h1>Eu Quero!</h1>
      <Carousel
        value={produtos}
        numVisible={3}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        itemTemplate={productTemplate}
        showIndicators={false}
        circular
        activeIndex={activeIndex}
        autoplayInterval={3000}
      />
    </div>
  );
}
