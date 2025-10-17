import Header from "../../shared/components/Header";
import Footer from "../../shared/components/Footer";
import "./cardapio.css";
import CardapioBannerSection from "./sections/CardapioBannerSection";
import ProdutoSearchBarSection from "./sections/produtoSearchBar/ProdutoSearchBarSection";
// import ListaProdutosCardapioSection from "./sections/ListaProdutosCardapioSection";
import useCardapio from "./hooks/useCardapio";
import ListaProdutosCardapioSection from "./sections/cardapio/ProdutoCardapio";

const Cardapio = () => {
  const cardapio = useCardapio();

  return (
    <div className="containerCardapio">
      <Header />
      {/* <CardapioBannerSection /> */}

      <nav className="navegacao">
        <ProdutoSearchBarSection  />
      </nav>

      
      <ListaProdutosCardapioSection
        produtos={cardapio.produtos}
        isLoading={cardapio.isLoading}
        addToCart={cardapio.addToCart}
      />

      <Footer />
    </div>
  );
};

export default Cardapio;
