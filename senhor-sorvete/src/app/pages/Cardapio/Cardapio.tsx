

import CardapioBannerSection from "./sections/CardapioBannerSection";
import ProdutoSearchBarSection from "./sections/ProdutoSearchBarSection";
import PopularProdutosButtonSection from "./sections/PopularProdutosButtonSection";
import FiltrosECarrinhoSection from "./sections/FiltrosECarrinhoSection";
import ListaProdutosCardapioSection from "./sections/ListaProdutosCardapioSection";
import ReservaModalCardapioSection from "./modais/ReservaModalCardapio";
import FiltroCategoriaModalSection from "./modais/FiltroCategoriaModal";

import useCardapio from "./hooks/useCardapio";
import Header from "../../shared/components/Header";
import Footer from "../../shared/components/Footer";
import "./cardapio.css";

const Cardapio = () => {
  const cardapio = useCardapio();

  return (
    <div className="containerCardapio">
      <Header />
      <CardapioBannerSection />

      <nav className="navegacao">
        <PopularProdutosButtonSection
          isPopularToggled={cardapio.isPopularToggled}
          isLoadingPopular={cardapio.isLoadingPopular}
        />
        <ProdutoSearchBarSection termo={cardapio.termo} setTermo={cardapio.setTermo} />
      </nav>

      <div className="mainContentWrapper" ref={cardapio.mainContentRef}>
        <div className="mainContent">
          <FiltrosECarrinhoSection {...cardapio} />
          <main className="products">
            <ListaProdutosCardapioSection
              produtos={cardapio.produtos}
              isLoading={cardapio.isLoading}
              addToCart={cardapio.addToCart}
            />
          </main>
        </div>
      </div>

      <Footer />
      <ReservaModalCardapioSection {...cardapio} />
      <FiltroCategoriaModalSection {...cardapio} />
    </div>
  );
};

export default Cardapio;
