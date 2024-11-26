import "./gastronomia.css";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import TextoVideo from "../../Components/TextoVideo";
import Artigo from "../../Components/Artigo";

const Gastronomia = (props) => {
  return (
    <div className="gastronomia">
      <Header />

      <TextoVideo
        titulo="Conheça a história"
        texto="O sorvete tem suas origens na China antiga, onde se misturavam neve com leite e outros ingredientes, como arroz ou leite de coco. A técnica de congelar e misturar substâncias foi trazida para a Europa por Marco Polo no século XIII, embora a receita em si tenha evoluído com o tempo. No século XVII, o sorvete começou a ganhar popularidade na França, e no século XVIII, espalhou-se pelos Estados Unidos, tornando-se uma das sobremesas mais apreciadas mundialmente."
        video="https://www.youtube-nocookie.com/embed/0O0KUGoEzX8?si=-mzqflFwRtkggv9B"
      />

      <h4>Artigos</h4>
      <div className="artigos">
        <Artigo
          imagem="/Imagens/casquinhas-de-chocolate.jpeg"
          placeholder="Imagem com dois sorvetes de casquinhas de chocolate"
          titulo="MELHORES SABORES"
          texto="Sorvetes em uma incrível variedade de sabores encantam todos os paladares: desde os clássicos e atemporais como baunilha, chocolate e morango, até opções mais sofisticadas, como pistache e tiramisu, que oferecem uma experiência mais refinada. Para quem busca frescor, sabores frutados como manga e limão siciliano são uma explosão de frescor e leveza."
        />
        <Artigo
          imagem="/Imagens/sorvete-e-rosto.jpeg"
          placeholder="Imagem sobre a história do sorvete"
          titulo="PRIMEIRO SORVETE CRIADO"
          texto="O primeiro sabor de sorvete, uma mistura primitiva e refrescante, foi criado pelos chineses há cerca de 3.000 anos. Essa iguaria consistia em uma combinação simples, mas inovadora, de neve ou gelo triturado, misturado com frutas e mel, proporcionando uma sobremesa gelada que trazia alívio e prazer nos climas quentes."
        />
      </div>

      <TextoVideo
        Style="flex-direction: row-reverse"
        titulo="Dicas para sua sobremesa gelada!"
        texto="O sorvete é uma sobremesa versátil que combina bem com brownies, petit gâteau, waffles e profiteroles, criando um contraste delicioso entre quente e frio. Entre as frutas, morangos, bananas, mangas e frutas vermelhas são ótimas escolhas, assim como frutas flambadas, que contrastam com a cremosidade do sorvete."
        video="https://www.youtube-nocookie.com/embed/l1RHDbMaUCI?si=lWdw1uMy2nedHx4r"
      />

      <Footer />
    </div>
  );
};
export default Gastronomia;
