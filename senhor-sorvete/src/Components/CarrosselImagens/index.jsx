import React, { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import "./carrosselImagens.css";

const CarrosselImagens = () => {
  const carouselInnerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = 6; // Total de cards no carrossel
  const visibleCards = 3; // Número de cards visíveis ao mesmo tempo

  // Mover o carrossel
  const updateCarousel = useCallback(() => {
    const cardWidth =
      carouselInnerRef.current.querySelector(".card").offsetWidth;
    const newTransformValue = -currentIndex * (cardWidth + 20); // margin - 20px
    carouselInnerRef.current.style.transform = `translateX(${newTransformValue}px)`;
  }, [currentIndex]);

  // Avançar o carrossel
  const handleNextClick = () => {
    if (currentIndex < totalCards - visibleCards) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Volta ao início quando chega no final
    }
  };

  // Retroceder o carrossel
  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(totalCards - visibleCards); // Vai para o final
    }
  };

  useEffect(() => {
    updateCarousel(); // Atualiza o carrossel sempre que o currentIndex mudar
  }, [currentIndex, updateCarousel]);

  useEffect(() => {
    let autoScroll = setInterval(() => {
      if (currentIndex < totalCards - visibleCards) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 3000);

    const carouselInner = carouselInnerRef.current;

    // Pausando o auto-scroll quando o mouse estiver sobre o carrossel
    const handleMouseOver = () => clearInterval(autoScroll);
    const handleMouseOut = () =>
      (autoScroll = setInterval(() => {
        if (currentIndex < totalCards - visibleCards) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0);
        }
      }, 3000));

    carouselInner.addEventListener("mouseover", handleMouseOver);
    carouselInner.addEventListener("mouseout", handleMouseOut);

    return () => {
      clearInterval(autoScroll);
      carouselInner.removeEventListener("mouseover", handleMouseOver);
      carouselInner.removeEventListener("mouseout", handleMouseOut);
    };
  }, [currentIndex]);

  return (
    <section className="populares">
      <h1>Populares!</h1>
      <div className="carousel">
        <div className="carousel-inner" ref={carouselInnerRef}>
          <div className="card">
            <a href="/cardapio">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
              <h3>Banana Soft Cream</h3>
              <p>R$ 9,99</p>
            </a>
          </div>
          <div className="card">
            <a href="/cardapio">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
              <h3>Chocolate Soft Cream</h3>
              <p>R$ 9,99</p>
            </a>
          </div>
          <div className="card">
            <a href="/cardapio">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
              <h3>Morango Soft Cream</h3>
              <p>R$ 9,99</p>
            </a>
          </div>
          <div className="card">
            <a href="/cardapio">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
              <h3>Baunilha Soft Cream</h3>
              <p>R$ 9,99</p>
            </a>
          </div>
          <div className="card">
            <a href="/cardapio">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
              <h3>Café Soft Cream</h3>
              <p>R$ 9,99</p>
            </a>
          </div>
          <div className="card">
            <a href="/cardapio">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
              <h3>Caramelo Soft Cream</h3>
              <p>R$ 9,99</p>
            </a>
          </div>
          <div className="card">
            <a href="/cardapio">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
              <h3>Banana Soft Cream</h3>
              <p>R$ 9,99</p>
            </a>
          </div>
        </div>
        <button className="carousel-prev" onClick={handlePrevClick}>
          &lt;
        </button>
        <button className="carousel-next" onClick={handleNextClick}>
          &gt;
        </button>
      </div>
      <div className="ver-tudo">
        <a href="/cardapio">ver tudo</a>
      </div>
    </section>
  );
};

export default CarrosselImagens;



// import React, { useEffect, useRef, useState } from "react";
// import { useCallback } from "react";
// import "./carrosselImagens.css";

// const CarrosselImagens = () => {
//   const carouselInnerRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const totalCards = 9; // Total de cards no carrossel
//   const [visibleCards, setVisibleCards] = useState(5); // Agora isso será atualizado dinamicamente

//   // Função para ajustar o número de cards visíveis conforme a largura da janela
//   const updateVisibleCards = useCallback(() => {
//     const cardWidth = 220; // Largura mínima esperada para cada card (incluindo a margem)
//     const availableWidth = window.innerWidth - 40; // Largura da janela com um padding
//     const calculatedVisibleCards = Math.floor(availableWidth / cardWidth);
//     setVisibleCards(calculatedVisibleCards);
//   }, []);

//   // Mover o carrossel
//   const updateCarousel = useCallback(() => {
//     const cardWidth = carouselInnerRef.current.querySelector(".card").offsetWidth;
//     const newTransformValue = -currentIndex * (cardWidth + 20); // Incluindo margens
//     carouselInnerRef.current.style.transform = `translateX(${newTransformValue}px)`;
//   }, [currentIndex]);

//   // Avançar o carrossel
//   const handleNextClick = () => {
//     if (currentIndex < totalCards - visibleCards) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       setCurrentIndex(totalCards - visibleCards); // Ficar no último card visível
//     }
//   };

//   // Retroceder o carrossel
//   const handlePrevClick = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     } else {
//       setCurrentIndex(0); // Volta ao início se estiver no começo
//     }
//   };

//   useEffect(() => {
//     updateCarousel(); // Atualiza o carrossel sempre que o currentIndex mudar
//   }, [currentIndex, updateCarousel]);

//   useEffect(() => {
//     updateVisibleCards(); // Atualiza o número de cards visíveis conforme o tamanho da janela
//     window.addEventListener("resize", updateVisibleCards);
//     return () => window.removeEventListener("resize", updateVisibleCards);
//   }, [updateVisibleCards]);

//   useEffect(() => {
//     let autoScroll = setInterval(() => {
//       if (currentIndex < totalCards - visibleCards) {
//         setCurrentIndex(currentIndex + 1);
//       } else {
//         setCurrentIndex(0);
//       }
//     }, 3000);

//     const carouselInner = carouselInnerRef.current;

//     // Pausando o auto-scroll quando o mouse estiver sobre o carrossel
//     const handleMouseOver = () => clearInterval(autoScroll);
//     const handleMouseOut = () =>
//       (autoScroll = setInterval(() => {
//         if (currentIndex < totalCards - visibleCards) {
//           setCurrentIndex(currentIndex + 1);
//         } else {
//           setCurrentIndex(0);
//         }
//       }, 3000));

//     carouselInner.addEventListener("mouseover", handleMouseOver);
//     carouselInner.addEventListener("mouseout", handleMouseOut);

//     return () => {
//       clearInterval(autoScroll);
//       carouselInner.removeEventListener("mouseover", handleMouseOver);
//       carouselInner.removeEventListener("mouseout", handleMouseOut);
//     };
//   }, [currentIndex, visibleCards, totalCards]);

//   return (
//     <section className="populares">
//       <h1>Populares!</h1>
//       <div className="carousel">
//         <div className="carousel-inner" ref={carouselInnerRef}>
//           {/* Cards do carrossel */}
//           <div className="card">
//             <img src="Imagens/sorvete-de-chocolate.png" alt="" />
//             <h3>Banana Soft Cream</h3>
//             <p>R$ 9,99</p>
//           </div>
//           <div className="card">
//             <img src="Imagens/sorvete-de-chocolate.png" alt="" />
//             <h3>Chocolate Soft Cream</h3>
//             <p>R$ 9,99</p>
//           </div>
//           <div className="card">
//             <img src="Imagens/sorvete-de-chocolate.png" alt="" />
//             <h3>Morango Soft Cream</h3>
//             <p>R$ 9,99</p>
//           </div>
//           <div className="card">
//             <img src="Imagens/sorvete-de-chocolate.png" alt="" />
//             <h3>Baunilha Soft Cream</h3>
//             <p>R$ 9,99</p>
//           </div>
//           <div className="card">
//             <img src="Imagens/sorvete-de-chocolate.png" alt="" />
//             <h3>Café Soft Cream</h3>
//             <p>R$ 9,99</p>
//           </div>
//           <div className="card">
//             <img src="Imagens/sorvete-de-chocolate.png" alt="" />
//             <h3>Caramelo Soft Cream</h3>
//             <p>R$ 9,99</p>
//           </div>
//           <div className="card">
//             <img src="Imagens/sorvete-de-chocolate.png" alt="" />
//             <h3>Chocolate Soft Cream</h3>
//             <p>R$ 9,99</p>
//           </div>
//           <div className="card">
//             <img src="Imagens/sorvete-de-chocolate.png" alt="" />
//             <h3>Chocolate Soft Cream</h3>
//             <p>R$ 9,99</p>
//           </div>
//           <div className="card">
//             <img src="Imagens/sorvete-de-chocolate.png" alt="" />
//             <h3>Chocolate Soft Cream</h3>
//             <p>R$ 9,99</p>
//           </div>
//         </div>
//         <button className="carousel-prev" onClick={handlePrevClick}>
//           &lt;
//         </button>
//         <button className="carousel-next" onClick={handleNextClick}>
//           &gt;
//         </button>
//       </div>
//       <div className="ver-tudo">
//         <a href="/cardapio">ver tudo</a>
//       </div>
//     </section>
//   );
// };

// export default CarrosselImagens;
