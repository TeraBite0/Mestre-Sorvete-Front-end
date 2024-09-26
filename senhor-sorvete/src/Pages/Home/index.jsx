import "./home.css";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

const Home = (props) => {
  return (
    <div className="home">
      <Header />
      <main>
        <a
          href="https://wa.me/00000000000"
          target="_blank"
          className="whatsapp-icon"
          rel="noopener noreferrer"
        >
          <img src="Imagens/logo-whatsapp.png" alt="WhatsApp Icon" />
        </a>

        <section className="hero">
          <div className="content">
            <h4>Bem vindo à</h4>
            <h1>MESTRE SORVETE</h1>
            <p>
              Descubra uma experiência deliciosa com nossos sorvetes artesanais,
              preparados com ingredientes frescos e sabores únicos. Venha
              experimentar combinações clássicas e inovações surpreendentes!
            </p>
            <div className="buttons">
              <button className="btn-primary">Saiba Mais</button>
              <button className="btn-secondary">Entrar em contato</button>
            </div>
          </div>
        </section>

        <section className="sobre-nos">
          <div className="sobre-container">
            <div className="sobre-text">
              <h2>Sobre nós</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac
                vestibulum risus. Phasellus quis neque non nunc malesuada
                fringilla.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                efficitur libero at lacus fermentum, non viverra mi viverra.
              </p>
            </div>
            <div className="sobre-img">
              <img src="" alt="Imagem sobre nós" />
            </div>
          </div>
        </section>

        <section className="populares">
          <h1>Populares!</h1>
          <div className="carousel">
            <div className="carousel-inner">
              <div className="card">
                <h3>Banana Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
              <div className="card">
                <h3>Chocolate Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
              <div className="card">
                <h3>Morango Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
              <div className="card">
                <h3>Baunilha Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
              <div className="card">
                <h3>Café Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
              <div className="card">
                <h3>Caramelo Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
            </div>
            <button className="carousel-prev">&lt;</button>
            <button className="carousel-next">&gt;</button>
          </div>
          <a href="#" className="ver-tudo">
            Ver tudo
          </a>
        </section>

        <section className="sugestao-do-dia">
          <div className="sugestao-container">
            <div className="sugestao-text">
              <h2>Sugestão do Dia</h2>
              <p className="data">
                <span id="data-atual"></span>
              </p>
              <h3 className="titulo-sugestao">Chocolate trufado</h3>
              <p className="descricao">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                id felis eu est sodales tempor. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Duis ac vestibulum risus.
              </p>
              <button className="btn-experimentar">Experimentar</button>
            </div>
            <div className="sugestao-img">
              <img src="" alt="Sugestão do Dia - Chocolate Trufado" />
            </div>
          </div>
        </section>

        <section className="more-info">
          <div className="more-text">
            <h1>Mais!</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
              malesuada. Aenean vehicula velit nec tellus tempus ullamcorper.
            </p>
            <button className="btn-primary">Saiba Mais</button>
          </div>
          <div className="more-img">
            <img src="" alt="Imagem placeholder" />
          </div>
        </section>

        <section className="newsletter">
          <h2>Receber notificações</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
            quis sem at nibh elementum imperdiet.
          </p>
          <form className="newsletter-form">
            <input type="email" placeholder="Email" required />
            <button className="btn-primary" type="submit">
              Receber
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
