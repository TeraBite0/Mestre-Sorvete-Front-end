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
                texto="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
                video="https://www.youtube.com/embed/3LwyB8Gx4qk?si=0d4cXo0zh5Qidf7h"
            />

            <h4>Artigos</h4>

        <div className='artigos'>
            <Artigo
                imagem="/Imagens/images (4).jpeg"
                placeholder="Imagem com dois sorvetes de casquinhas de chocolate"
                titulo="MELHORES SABORES"
                texto="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
            />

            <Artigo
                imagem="/Imagens/download (2).jpeg"
                placeholder="Imagem com dois sorvetes de casquinhas de chocolate"
                titulo="PRIMEIRO SORVETE CRIADO"
                texto="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
            />
    </div>


        </div>

    );

}
export default Gastronomia;