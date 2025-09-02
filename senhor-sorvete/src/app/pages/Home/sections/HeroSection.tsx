import { ButtonNavegation } from "../../../shared/components/buttonNavegation/ButtonNavegation";

const HeroSection = () => (
  <section className="hero-section">
    <div className="content">
      <h4>Bem-vindo ao</h4>
      <h1>MESTRE SORVETE</h1>
      <p>
        Sorvete do futuro: Aqui o sabor chega primeiro e você prova antes de todo mundo!
      </p>

      <ButtonNavegation
        pagina="/gastronomia"
        texto="Saiba Mais"
        classNameDiv="button"
        classNameButton="btn-primary"
        tipo="button" />

    </div>
    <div className="img-container">
      <img
        src="Imagens/imagem-principal-homepage.png"
        alt="Sorvete artesanal do Mestre Sorvete"
      />
    </div>
  </section>
);

export default HeroSection;