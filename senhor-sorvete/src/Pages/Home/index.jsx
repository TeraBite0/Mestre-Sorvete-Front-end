import "./home.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import IconeWhatsapp from "../../Components/IconeWhatsapp";
import CarrosselImagens from "../../Components/CarrosselImagens";
import { Link } from "react-router-dom";

const Home = (props) => {
  // Função data atual
  const [dataAtual, setDataAtual] = useState("");

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    setDataAtual(`${dia}/${mes}/${ano}`);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateEmail(email)) {
      setError("");
      navigate("/cardapio");
    } else {
      setError("Por favor, insira um E-mail válido.");
    }
  };

  return (
    <div className="home">
      <Header />
      <main>
        <IconeWhatsapp />
        <section className="section-1">
          <div className="content">
            <h4>Bem-vindo ao</h4>
            <h1>MESTRE SORVETE</h1>
            <p>
              Descubra uma experiência deliciosa com nossos sorvetes artesanais,
              preparados com ingredientes frescos e sabores únicos. Venha
              experimentar combinações clássicas e inovações surpreendentes!
            </p>
            <div className="button">
              <button className="btn-primary">
                <Link
                  to="/"
                  onClick={() =>
                    document.getElementById("section-2").scrollIntoView()
                  }
                >
                  Saiba Mais
                </Link>
              </button>
            </div>
          </div>
          <img
            src="Imagens/imagem-principal-homepage.png"
            alt="Imagem principal banner"
          />
        </section>

        <section className="section-2" id="section-2">
          <div className="sobre-container">
            <div className="sobre-img">
              <img src="Imagens/imagem-2-homepage.png" alt="Imagem sobre nós" />
            </div>
            <div className="sobre-text">
              <h2>Sobre nós</h2>
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

        <CarrosselImagens />

        <section className="section-3">
          <h2>SUGESTÃO DO DIA</h2>
          <p className="data">
            <span>{dataAtual}</span>
          </p>
          <div className="sugestao-content">
            <div className="sugestao-img">
              <img
                src="Imagens/imagem-3-homepage.png"
                alt="Sugestão do Dia - Chocolate Trufado"
              />
            </div>
            <div className="sugestao-text">
              <h3>Chocolate trufado</h3>
              <p>
                Hoje, nossa dica especial é o irresistível sorvete de Chocolate
                Trufado. Com uma combinação perfeita de cremosidade e sabor
                intenso. Venha experimentar essa delícia que derrete na boca e
                transforma o seu dia em um momento de puro prazer!
              </p>
              <button className="btn-experimentar">
                <Link to="/cardapio">Experimentar</Link>
              </button>
            </div>
          </div>
        </section>

        <section className="section-4">
          <div className="more-text">
            <h1>Mais</h1>
            <p>
              Mergulhe na arte da culinária gastronômica com um toque
              refrescante! Descubra como os mestres da cozinha transformam
              ingredientes simples em verdadeiras obras de arte geladas.
              Acompanhe nossos vídeos inspiradores, onde exploramos técnicas
              sofisticadas de preparo de sorvetes e picolés, desde a escolha dos
              ingredientes até a apresentação final.
            </p>
            <button className="btn-primary">
              <Link to="/gastronomia">Saiba Mais</Link>
            </button>
          </div>
          <div className="more-img">
            <img src="Imagens/imagem-4-homepage.png" alt="Imagem placeholder" />
          </div>
        </section>

        <section className="section-5">
          <div className="notificacoes-text">
            <h2>Receber notificações</h2>
            <p>
              Não perca a chance de ser o primeiro a saber quando novos sabores
              chegam à nossa sorveteria! Inscreva-se para receber notificações
              por e-mail e fique por dentro de todas as novidades.
            </p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p id="validacao-email">{error}</p>}
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
