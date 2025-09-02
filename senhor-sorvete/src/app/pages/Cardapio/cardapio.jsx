import "./cardapio.css";
import Filtros from "../../shared/components/Filtros/Filtro.tsx";
import Header from "../../shared/components/Header/index.jsx";
import Footer from "../../shared/components/Footer/index.jsx";

import SearchIcon from "@mui/icons-material/Search";
import WhatshotIcon from "@mui/icons-material/Whatshot";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import useCardapio from "./hooks/useCardapio";

const Cardapio = () => {
  const { termo,
    setTermo,
    cartItems,
    addToCart,
    removeFromCart,
    priceRange,
    setPriceRange,
    selectedCategories,
    setSelectedCategories,
    produtos: filteredProdutos,
    isLoading,
    isModalOpen,
    openModal,
    closeModal,
    handleConfirm,
    isMaisModalOpen,
    closeMaisModal,
    sidebarRef,
    mainContentRef,
    isLoadingPopular,
    selectedTypes,
    setSelectedTypes,
    isPopularToggled} = useCardapio();

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
            ) : filteredProdutos.length === 0 ? (
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
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            width: { xs: "80%", sm: 400, md: 500 },
          }}
        >
          <h2>Filtrar por Categoria</h2>
          
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
