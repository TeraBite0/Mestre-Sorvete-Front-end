import { ButtonNavegation } from "../../../shared/components/buttonNavegation/ButtonNavegation";

const SugestaoDoDiaSection = ({ dataAtual, destaqueDia }: { dataAtual: string; destaqueDia: any }) => (
  <section className="sugestao-section">
    <h2>Sugestão do Dia</h2>
    <p className="data">{dataAtual}</p>

    <div className="sugestao-content">
      <div className="sugestao-img sugestao-div">
        {destaqueDia ? (
          <img
            src={destaqueDia.produto.imagemUrl || "Imagens/casquinhas-de-chocolate.jpeg"}
            alt={`Sorvete: ${destaqueDia.produto.nome}`}
          />
        ) : (
          <p>Carregando recomendação...</p>
        )}
      </div>

      <div className="sugestao-text">
        {destaqueDia ? (
          <>
            <h3>
              {destaqueDia.produto.nome} - R$
              {destaqueDia.produto.preco.toFixed(2).replace(".", ",")}
            </h3>
            <p>{destaqueDia.texto}</p>

            <ButtonNavegation
              pagina="/cardapio"
              texto="Experimentar"
              classNameDiv="button"
              classNameButton="btn-experimentar"
              tipo="button" />

          </>
        ) : (
          <p>Carregando recomendação...</p>
        )}
      </div>
    </div>
  </section>
);

export default SugestaoDoDiaSection;