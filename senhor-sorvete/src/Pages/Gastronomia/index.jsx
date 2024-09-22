import './gastronomia.css';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import TextoVideo from '../../Components/TextoVideo';
import Artigo from '../../Components/Artigo';

const Gastronomia = (props) => {



    return (

        <div className='gastronomia'>
            <Header />

            <TextoVideo
                titulo="Conheça a história"
                texto= "O sorvete tem suas origens na China antiga, onde misturavam neve com leite e arroz. Marco Polo trouxe a ideia para a Europa no século XIII. No século XVII, o sorvete se popularizou na França, e no século XVIII, chegou aos Estados Unidos, onde se tornou uma sobremesa amada mundialmente."
                video="https://www.youtube-nocookie.com/embed/0O0KUGoEzX8?si=-mzqflFwRtkggv9B"
            />

            <h4>Artigos</h4>

            <div className='artigos'>
                <Artigo
                    imagem="/Imagens/images (4).jpeg"
                    placeholder="Imagem com dois sorvetes de casquinhas de chocolate"
                    titulo="MELHORES SABORES"
                    texto= "Sorvetes como baunilha, chocolate e morango, sofisticados como pistache e tiramisu, frutados como manga e limão siciliano, e exóticos como matcha e yuzu"
            />
                <Artigo
                    imagem="/Imagens/download (2).jpeg"
                    placeholder="Imagem com dois sorvetes de casquinhas de chocolate"
                    titulo="PRIMEIRO SORVETE CRIADO"
                    texto="O primeiro sabor de sorvete criado foi uma mistura simples de neve ou gelo com frutas e mel, desenvolvida pelos chineses há cerca de 3.000 anos."
                />
            </div>

           
                <TextoVideo Style="flex-direction: row-reverse"
                    titulo="Dicas para sua sobremesa gelada!"
                    texto="O sorvete é uma sobremesa versátil que combina bem com brownies, petit gâteau, waffles e profiteroles, criando um contraste delicioso entre quente e frio. Entre as frutas, morangos, bananas, mangas e frutas vermelhas são ótimas escolhas, assim como frutas flambadas, que contrastam com a cremosidade do sorvete."
                    video="https://www.youtube-nocookie.com/embed/l1RHDbMaUCI?si=lWdw1uMy2nedHx4r"
                />
          

            <Footer/>   


        </div>

    );

}
export default Gastronomia;