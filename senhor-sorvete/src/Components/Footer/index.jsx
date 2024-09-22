import './footer.css';

const Footer = () => {

    return (
        <div className='footer' aria-label='Rodapé do site Senhor Sorvete que contém a logo da empresa que criou o site, um texto descrevendo como foi feito o site e um menu de opções.'>
            <div className='logo'>
                <img src='/Imagens/logo.png' alt='Logo da empresa TeraBite, responsável pela criação e desencolvimento do site.' />
            </div>

            <div className='sobre-projeto'>
                <p>Este projeto é resultado da dedicação e expertise da equipe TeraBite. Cada detalhe foi pensado com cuidado
                    para proporcionar a melhor experiência aos nossos clientes.</p>
            </div>

            <div className="itens">

                <div className='itens-coluna1'>
                    <ul>
                        <li>Contato</li>
                        <li>Cardápio</li>
                    </ul>
                </div>

                <div className='itens-coluna2'>
                    <ul>
                        <li>Sobre</li>
                        <li>Gastrônomia</li>
                    </ul>
                </div>
            </div>
        </div>
    );

}
export default Footer;