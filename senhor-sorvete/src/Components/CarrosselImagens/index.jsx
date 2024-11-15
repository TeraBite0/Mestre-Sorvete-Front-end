import "./carrosselImagens.css";
import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";

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
        fetch("http://localhost:8080/produtos/populares")
            .then((response) => response.json())
            .then((data) => setProdutos(data.slice(0, 9)));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % produtos.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [produtos.length]);

    const productTemplate = (produto) => {
        return (
            <div className="card-item">
                <img
                    src="Imagens/casquinhas-de-chocolate.jpeg"
                    alt={`${produto.nome} Ice Cream`}
                />
                <h3>{produto.nome}</h3>
                <p>R${produto.preco},00</p>
            </div>
        );
    };

    return (
        <div className="card">
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
