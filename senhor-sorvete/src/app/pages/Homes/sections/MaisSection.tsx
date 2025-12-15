import { ButtonNavegation } from "../../../shared/components/buttonNavegation/ButtonNavegation";

const MaisSection = () => (
  <section className="mais-section">
    <div className="more-text">
      <h1>Mais</h1>
      <p>
        Mergulhe na arte da culinária gastronômica com um toque
        refrescante! Descubra como os mestres da cozinha transformam
        ingredientes simples em verdadeiras obras de arte geladas.
        Acompanhe nossos vídeos inspiradores, onde exploramos técnicas
        sofisticadas de preparo de sorvetes e picolés.
      </p>

      <ButtonNavegation
        pagina="/gastronomia"
        texto="Saiba Mais"
        classNameDiv="button"
        classNameButton="btn-primary"
        tipo="button" />

    </div>
    <div className="more-img">
      <img src="Imagens/maispng.png" alt="Arte da gastronomia" />
    </div>
  </section>
);

export default MaisSection;