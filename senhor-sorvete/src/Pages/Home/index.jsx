import "./home.css";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import IconeWhatsapp from "../../Components/IconeWhatsapp";

const Home = (props) => {
  return (
    <div className="home">
      <Header />
      <main>
        <IconeWhatsapp />
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
          <img src="Imagens/imagem-principal-homepage.png" alt="" />
        </section>

        <section className="sobre-nos">
          <div className="sobre-container">
            <div className="sobre-img">
              <img
                src="Imagens/sorvete-doce-de-leite.png"
                alt="Imagem sobre nós"
              />
            </div>
            <div className="sobre-text">
              <h2>——— Sobre nós ———</h2>
              <p>
                Somos apaixonados por oferecer os melhores sorvetes do mercado,
                selecionando cuidadosamente para revenda em nossa loja. Com um
                compromisso com a qualidade, trazemos para você uma variedade de
                sabores irresistíveis.
              </p>
              <p>
                Nosso objetivo é proporcionar uma experiência refrescante e
                deliciosa em cada visita, oferecendo sorvetes que conquistam
                todos os paladares. Visite-nos e descubra sua próxima sobremesa
                favorita!
              </p>
            </div>
          </div>
        </section>

        <section className="populares">
          <h1>——— Populares! ———</h1>
          <div className="carousel">
            <div className="carousel-inner">
              <div className="card">
                <img src="Imagens/sorvete-de-chocolate.png" alt="" />
                <h3>Banana Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
              <div className="card">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
                <h3>Chocolate Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
              <div className="card">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
                <h3>Morango Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
              <div className="card">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
                <h3>Baunilha Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
              <div className="card">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
                <h3>Café Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
              <div className="card">
              <img src="Imagens/sorvete-de-chocolate.png" alt="" />
                <h3>Caramelo Soft Cream</h3>
                <p>R$ 9,99</p>
              </div>
            </div>
            <button className="carousel-prev">&lt;</button>
            <button className="carousel-next">&gt;</button>
          </div>
          <div className="ver-tudo">
            <a href="/">ver tudo</a>
          </div>
        </section>


        <section className="sugestao-do-dia">
        {/* <h2>Sugestão do Dia</h2>
              <p className="data">
                <span id="data-atual"></span>
              </p> */
              /* <div class name="sugestao-container"> </div> */}
          <div className="sugestao-container">
            <div className="sugestao-img">
              <img src="Imagens/imagem-3-homepage.png" alt="Sugestão do Dia - Chocolate Trufado" />
            </div>
            <div className="sugestao-text">
              <h3 className="titulo-sugestao">Chocolate trufado</h3>
              <p className="descricao">
              Hoje, nossa dica especial é o irresistível sorvete de Chocolate Trufado. Com uma combinação perfeita de cremosidade e sabor intenso. Venha experimentar essa delícia que derrete na boca e transforma o seu dia em um momento de puro prazer!
              </p>
              <button className="btn-experimentar">Experimentar</button>
              </div>
            </div>
        </section>

        <section className="more-info">
          <div className="more-text">
            <h1>——— Mais! ———</h1>
            <p>
            Mergulhe na arte da culinária gastronômica com um toque refrescante! Descubra como os mestres da cozinha transformam ingredientes simples em verdadeiras obras de arte geladas. Acompanhe nossos vídeos inspiradores, onde exploramos técnicas sofisticadas de preparo de sorvetes e picolés, desde a escolha dos ingredientes até a apresentação final.
            </p>
            <button className="btn-primary">Saiba Mais</button>
          </div>
          <div className="more-img">
            <img src="Imagens/sorvete-chocolate-plantas.png" alt="Imagem placeholder" />
          </div>
        </section>

        <section className="newsletter">
          <h2>Receber notificações</h2>
          <p>
          Não perca a chance de ser o primeiro a saber quando novos sabores chegam à nossa sorveteria! Inscreva-se para receber notificações por e-mail e fique por dentro de todas as novidades.
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
