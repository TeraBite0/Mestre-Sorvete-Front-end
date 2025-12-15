interface ProdutoCardapioItemSectionProps {
    produto: any;
    addToCart: (produto: any) => void;
}

const ProdutoCardapioItemSection = ({ produto, addToCart }: ProdutoCardapioItemSectionProps) => (
  <div className="product">
    <img
      src={produto.imagemUrl}
      alt={`${produto.nome} Ice Cream`}
      className="w-full h-48 object-cover rounded-2xl mb-4"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "Imagens/404-icon.webp";
        target.alt = "Erro na imagem";
      }}
    />
    <div className="product-name" title={produto.nome}>{produto.nome}</div>
    <p>R$ {produto.preco.toFixed(2)}</p>
    <button className="notifyMe" onClick={() => addToCart(produto)}>
      <span>Reserva</span>
    </button>
  </div>
);

export default ProdutoCardapioItemSection;
