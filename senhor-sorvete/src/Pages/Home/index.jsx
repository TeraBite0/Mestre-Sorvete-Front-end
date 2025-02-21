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
  const [recomendacaoDia, setRecomendacaoDia] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    setDataAtual(`${dia}/${mes}/${ano}`);

    const fetchRecomendacao = async () => {
      try {
        const resposta = await fetch(
          "http://localhost:8080/produtos/recomendacao-do-dia",
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );

        if (resposta.status !== 200) {
          // Se o status não for 200, registra o erro
          console.error("Erro do servidor:", resposta.status);
        } else {
          const data = await resposta.json();
          setRecomendacaoDia(data); // Armazena os dados no estado
        }
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    };

    fetchRecomendacao();
  }, []);

  // const fetchRecomendacaoDia = async () => {
  //   try {
  //     const resposta = await fetch("http://localhost:8080/produtos/recomendacao-do-dia", {
  //       method: "GET",
  //       headers: {
  //         Accept: "*/*",
  //       },
  //     });

  //     if (resposta.status !== 200) {
  //       // Se o status não for 200, registra o erro
  //       console.error("Erro do servidor:", resposta.status);
  //     } else {
  //       // Aqui você pode processar a resposta se o status for 200
  //       const data = await resposta.json(); // Ou outro formato conforme a resposta do servidor
  //       console.log(data);
  //     }
  //   } catch (error) {
  //     console.error("Erro ao fazer a requisição:", error);
  //   }
  // };

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
              {recomendacaoDia ? (
                <img
                  //   src={recomendacaoDia.imagemUrl} // Aqui você usa a URL da imagem retornada pela API
                  // alt={`Sugestão do Dia - ${recomendacaoDia.nome}`}
                  src="Imagens/imagem-3-homepage.png"
                  alt={`Sugestão do Dia - ${recomendacaoDia.nome}`}
                />
              ) : (
                <p>Carregando recomendação...</p>
              )}
            </div>
            <div className="sugestao-text">
              {recomendacaoDia ? (
                <>
                  <h3>{recomendacaoDia.nome}</h3>
                  <p>
                    Hoje, nossa dica especial é o irresistível sorvete de{" "}
                    {recomendacaoDia.nome}. Com uma combinação perfeita de
                    cremosidade e sabor intenso. Venha experimentar essa delícia
                    que derrete na boca e transforma o seu dia em um momento de
                    puro prazer!
                  </p>
                  <button className="btn-experimentar">
                    <Link to="/cardapio">Experimentar</Link>
                  </button>
                </>
              ) : (
                <p>Carregando recomendação...</p>
              )}
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
        <div class="section-5"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.090514945892!2d-46.492801125018104!3d-23.63692926437218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce69769e05f995%3A0xa5657f81c68e3102!2sMestre%20Sorvete!5e0!3m2!1spt-BR!2sbr!4v1740097443188!5m2!1spt-BR!2sbr" width="620" height="350" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
          <div class="classe-notificacao-e-email"> 
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

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
