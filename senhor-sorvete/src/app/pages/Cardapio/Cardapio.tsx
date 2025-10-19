import Header from "../../shared/components/Header";
import Footer from "../../shared/components/Footer";
import "./cardapio.css";
import ProdutoSearchBarSection from "./sections/produtoSearchBar/ProdutoSearchBarSection";
// import ListaProdutosCardapioSection from "./sections/ListaProdutosCardapioSection";
import useCardapio from "./hooks/useCardapio";
import ListaProdutosCardapioSection from "./sections/cardapio/ProdutoCardapio";

const Cardapio = () => {
  const cardapio = useCardapio();

  return (
    <div className="containerCardapio">
      <Header />

      <nav className="navegacao">
        <ProdutoSearchBarSection  />
      </nav>

      
      <ListaProdutosCardapioSection
        isLoading={cardapio.isLoading}
        addToCart={cardapio.addToCart}
      />

      <Footer />
    </div>
  );
};

export default Cardapio;
