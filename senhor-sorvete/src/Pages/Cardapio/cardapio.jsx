import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "./cardapio.css";
import Filtros from "../../Components/Filtros/Filtro.tsx";
import Header from "../../Components/Header/index.jsx";
import Footer from "../../Components/Footer/index.jsx";

import SearchIcon from "@mui/icons-material/Search";
import WhatshotIcon from "@mui/icons-material/Whatshot";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";

const Cardapio = () => {
  const [termo, setTermo] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [priceRange, setPriceRange] = useState(15);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMaisModalOpen, setIsMaisModalOpen] = useState(false);
  const [setEmailError] = useState("");
  const [produtosPopulares] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isPopularToggled] = useState(false);

  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://50.19.70.8:8080/produtos/ativos"
        );
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  const [isLoadingPopular] = useState(false);

  // Solução provisória ao erro do populares, **REMOVER QUANDO CONCERTADO!!!!**
  // Basicamente essa função uso os dados dos produtos buscados anteriormente
  // const fetchPopular = async () => {
  //   setIsLoadingPopular(true);
  //   try {
  //     const response = await axios.get("http://50.19.70.8:8080/produtos/populares");
  //     if (response.status === 200) {
  //       const popularProductsWithFullData = response.data.map(popularProduct => {
  //         const fullProductDetails = produtos.find(
  //           produto => produto.nome.toLowerCase() === popularProduct.nome.toLowerCase()
  //         );

  //         return (
  //           fullProductDetails || {
  //             id: null,
  //             nome: popularProduct.nome,
  //             preco: popularProduct.preco,
  //             subtipo: {
  //               nome: "Desconhecido",
  //               tipoPai: { nome: "Desconhecido" },
  //             },
  //             emEstoque: false,
  //           }
  //         );
  //       }
  //       );

  //       setPopular(popularProductsWithFullData);
  //       setIsPopularToggled(!isPopularToggled);

  //       if (!isPopularToggled) {
  //         toast.success(
  //           `${popularProductsWithFullData.length} produtos populares carregados!`
  //         );
  //       } else {
  //         toast.info("Exibição de produtos populares desativada.");
  //       }
  //     }
  //   } catch (error) {
  //     toast.error(
  //       "Erro ao buscar produtos populares. Tente novamente mais tarde."
  //     );
  //     console.error("Erro ao buscar produtos populares:", error);
  //   } finally {
  //     setIsLoadingPopular(false);
  //   }
  // };

  //TODO: Quando o popular ser concertado no back, descomentar esse código
  // const fetchPopular = async () => {
  //     setIsLoadingPopular(true); // Ativa o estado de carregamento
  //     try {
  //         const response = await axios.get("http://50.19.70.8:8080/produtos/populares");
  //         if (response.status === 200) {
  //             setPopular(response.data);
  //             setIsPopularToggled(!isPopularToggled);
  //             if (!isPopularToggled) {
  //                 toast.success("Produtos populares carregados com sucesso!");
  //             } else {
  //                 toast.info("Exibição de produtos populares desativada.");
  //             }
  //         }
  //     } catch (error) {
  //         toast.error("Erro ao buscar produtos populares. Tente novamente mais tarde.");
  //         console.error("Erro ao buscar produtos populares:", error);
  //     } finally {
  //         setIsLoadingPopular(false);
  //     }
  // };

  // const openMaisModal = () => setIsMaisModalOpen(true);
  const closeMaisModal = () => setIsMaisModalOpen(false);

  // const sendNotification = async () => {
  //   const processedItems = [];
  //   const failedItems = [];

  //   const reserva = cartItems.map(async (item) => {
  //     try {
  //       const response = await axios.post("http://50.19.70.8:8080/notificacoes", {
  //         email,
  //         idProduto: item.id,
  //       });

  //       if (response.status === 201) {
  //         processedItems.push(item);
  //       }
  //     } catch (error) {
  //       console.error(`Erro ao mandar notificação para ${item.nome}`, error);
  //       failedItems.push(item);
  //     }
  //   });

  //   await Promise.allSettled(reserva);

  //   if (processedItems.length > 0) {
  //     toast.success(
  //       `Itens processados: ${processedItems.length}/${cartItems.length}`
  //     );
  //   }

  //   if (failedItems.length > 0) {
  //     if (failedItems.length === 1)
  //       toast.error(`Falha ao processar ${failedItems.length} item`);
  //     else toast.error(`Falha ao processar ${failedItems.length} itens`);
  //   }
  // };

  const addToCart = (produto) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === produto.id);

      if (itemExists) {
        // Produto já no carrinho: incrementa quantidade
        return prevItems.map((item) =>
          item.id === produto.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        // Produto novo no carrinho: adiciona com quantity = 1 e preço corrigido
        return [...prevItems, { ...produto, price: produto.preco, quantity: 1 }];
      }
    });
  };


  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = (item.quantity || 1) - 1;
            if (newQuantity <= 0) return null; // remove se chegou a 0
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item !== null); // remove os nulos (quantidade 0)
    });
  };


  const filteredProdutos = produtos.filter((produto) => {
    const matchesTermo = termo
      ? produto.nome.toLowerCase().includes(termo.toLowerCase())
      : true;

    const matchesPrice = produto.preco <= priceRange;

    const matchesCategory =
      selectedCategories.length === 0 ||
      (produto.subtipo && selectedCategories.includes(produto.subtipo.nome)) ||
      (produto.subtipo && produto.subtipo.tipoPai && selectedCategories.includes(produto.subtipo.tipoPai.nome));

    const matchesType =
      selectedTypes.length === 0 ||
      (produto.subtipo && produto.subtipo.tipoPai && selectedTypes.includes(produto.subtipo.tipoPai.nome));

    const matchesPopular =
      !isPopularToggled ||
      produtosPopulares.some(
        (popularProduto) => popularProduto.id === produto.id
      );

    return (
      matchesTermo &&
      matchesPrice &&
      matchesCategory &&
      matchesType &&
      matchesPopular
    );
  });

  // const categorias = [
  //   ...new Set(
  //     produtos.flatMap((produto) => [
  //       produto.subtipo.nome,
  //       produto.subtipo.tipoPai.nome,
  //     ])
  //   ),
  // ];

  // const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // // const handleConfirm = () => {
  // //   if (!validateEmail(email)) {
  // //     setEmailError("Por favor, insira um email válido.");
  // //     return;
  // //   }
  // //   setEmailError("");
  // //   closeModal();
  // //   sendNotification();
  // // };

  const handleConfirm = () => {

    const numeroVendedor = 5511988469500; // Número do vendedor

    if (cartItems.length === 0) {
      toast.error("Nenhum item no carrinho para enviar.");
      return;
    }

    const produtosReservados = cartItems.map((item) => `${item.nome} - ${item.quantity}x - R$ ${item.price.toFixed(2).replace(".", ",")}`).join("\n");
    const valorTotal = cartItems
      .reduce((total, item) => total + item.price * (item.quantity || 1), 0)
      .toFixed(2)
      .replace(".", ",");

    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString("pt-BR");

    const mensagem = encodeURIComponent(
      `Olá, Josué! Gostaria de realizar uma reserva.\n\n` +
      `📅 *Data da reserva:* ${dataFormatada}\n\n` +
      `🛍️ *Produtos reservados:*\n${produtosReservados}\n\n` +
      `💰 *Valor total:* R$ ${valorTotal}\n\n` +
      `Aguardo a confirmação. Desde já, obrigado!`
    );

    window.open(
      `https://api.whatsapp.com/send?phone=${numeroVendedor}&text=${mensagem}`,
      "_blank"
    );


  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEmailError("");
    setEmail("");
  };

  return (
    <div className="containerCardapio">
      <Header />
      <div className="banner">
        <div className="bannerContent">
          <h1>Bem-vindo!</h1>
          <p>
            Experimente nossos sabores únicos e refrescantes! Feitos com
            ingredientes frescos e naturais.
          </p>
        </div>
      </div>

      <nav className="navegacao">
        <button
          className={`trendingButton ${isPopularToggled ? "toggled" : ""}`}
          // onClick={fetchPopular}
          disabled={isLoadingPopular}
          style={{
            backgroundColor: isPopularToggled ? "#772321" : "#FFF",
            color: isPopularToggled ? "white" : "inherit",
          }}
        >
          <WhatshotIcon
            style={{
              color: isPopularToggled ? "white" : "inherit",
            }}
          />
          <span>{isLoadingPopular ? "Carregando..." : "Popular"}</span>
        </button>

        <div className="barraPesquisaCardapio">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            className="inputPesquisa"
          />
          <button className="botaoPesquisa">
            <SearchIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      </nav>

      <div className="mainContentWrapper" ref={mainContentRef}>
        <div className="mainContent">
          <div className="sidebarWrapper" ref={sidebarRef}>
            <aside className="sidebar">
              <Filtros
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
              />
            </aside>
            <aside className="reserva">
              <h2>Reservas</h2>
              {cartItems.length === 0 ? (
                <p
                  style={{
                    color: "#888",
                    textAlign: "center",
                    fontStyle: "italic",
                    padding: "20px",
                  }}
                >
                  Nenhum item adicionado ainda
                </p>
              ) : (
                <>
                  <ul>
                    {cartItems.map((item, index) => (
                      <li key={index}>
                        <img
                          src={`${item.imagemUrl}`}
                          alt={item.nome}
                          onError={(e) => {
                            e.target.src = "Imagens/sorvete-baunilha.jpg";
                            e.target.alt = "Imagem genérica do produto";
                          }}
                        />
                        <div className="cartItemDetails">
                          <h4>{item.nome}</h4>
                          <div className="quantityWrapper">
                            <button onClick={() => removeFromCart(item.id)}>-</button>
                            <span>{item.quantity || 1}</span>
                            <button onClick={() => addToCart(item)}>+</button>
                          </div>
                          <p>Total: R$ {(item.price * (item.quantity || 1)).toFixed(2)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button className="checkoutButton" onClick={openModal}>
                    Realizar Reserva
                  </button>
                </>
              )}
            </aside>
          </div>

          <main className="products">
            {isLoading ? (
              Array.from(new Array(6)).map((_, index) => (
                <div key={index} className="product">
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={160}
                    className="mb-4"
                  />
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </div>
              ))
            ) : produtos.length === 0 ? (
              <div className="error-message">
                <p
                  style={{
                    color: "#8B4513",
                    textAlign: "center",
                    padding: "20px",
                    backgroundColor: "rgba(245, 245, 220, 0.6)",
                    borderRadius: "10px",
                    width: "50rem",
                  }}
                >
                  O conteúdo não pôde ser carregado. Tente novamente mais tarde.
                </p>
              </div>
            ) : (
              filteredProdutos.map((produto, index) => (
                <div key={index} className="product">
                  <img
                    src={`${produto.imagemUrl}`}
                    alt={`${produto.nome} Ice Cream`}
                    className="w-full h-48 object-cover rounded-2xl mb-4"
                    onError={(e) => {
                      e.target.src = "Imagens/404-icon.webp";
                      e.target.alt = "Erro na imagem";
                    }}
                  />

                  <div className="product-name" title={produto.nome}>
                    {produto.nome}
                  </div>
                  <p>R$ {produto.preco.toFixed(2)}</p>
                  <button
                    className="notifyMe"
                    onClick={() => addToCart(produto)}
                  // disabled={produto.emEstoque}
                  >
                    <span>Reserva</span>
                  </button>
                </div>
              ))
            )}
          </main>
        </div>
      </div>

      <Footer />

      <Modal open={isMaisModalOpen} onClose={closeMaisModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <h2>Filtrar por Categoria</h2>
          <div>
            {/* {categorias.map((categoria, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(categoria)}
                    onChange={(e) => {
                      const updatedCategories = e.target.checked
                        ? [...selectedCategories, categoria]
                        : selectedCategories.filter((cat) => cat !== categoria);
                      setSelectedCategories(updatedCategories);
                    }}
                  />
                  {categoria}
                </label>
              </div>
            ))} */}
          </div>
        </Box>
      </Modal>

      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <h2>Reserva!</h2>
          <p>Ao confirmar, você será redirecionado para o WhatsApp para finalizar sua reserva.</p>
          {/* <TextField
            // label="Digite seu e-mail"
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
            // error={Boolean(emailError)}
            // helperText={emailError}
            // fullWidth
            // margin="normal"
          /> */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={closeModal} variant="outlined" color="error">
              Cancelar
            </Button>
            <Button onClick={handleConfirm} variant="contained" color="primary" style={{ marginLeft: "10px" }}>
              Confirmar
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Cardapio;
