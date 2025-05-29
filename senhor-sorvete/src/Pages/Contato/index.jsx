import { useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import Header from "../../Components/Header";
import "./contato.css";

const Contato = () => {
  const [setSelecionado] = useState(null);

  const handleSelect = (platform) => {
    setSelecionado(platform);

    const whatsappUrl = /Mobi|Android/i.test(navigator.userAgent)
      ? "https://api.whatsapp.com/send/?phone=5511988469500&text&type=phone_number&app_absent=0"
      : "https://web.whatsapp.com/send?phone=5511988469500";

    const instagramUrl =
      "https://www.instagram.com/mestresorvete?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

    const url = platform === "whatsapp" ? whatsappUrl : instagramUrl;
    window.open(url, "_blank");
  };

  return (
    <div className="contato-container">
      <Header />
      <div className="contato" >
        <div class="contato-full-componentes">
          <div class="section-5"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.090514945892!2d-46.492801125018104!3d-23.63692926437218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce69769e05f995%3A0xa5657f81c68e3102!2sMestre%20Sorvete!5e0!3m2!1spt-BR!2sbr!4v1740097443188!5m2!1spt-BR!2sbr" title="Mapa da unidade Contato" width="620" height="400" style={{borderRadius: 30, boxShadow: '10px 10px 30px #222222'}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
            <div class="contato-discricao">
              <div>
                <img src="Imagens/logo-josue.jpg" alt="Logo do mestre sorvete" />
              </div>
              <h2>Mestre Sorvete</h2>
              <button
                className="botao plataforma-whatsapp"
                onClick={() => handleSelect("whatsapp")}
              >
                <WhatsAppIcon /> WhatsApp
              </button>
              <button
                className="botao plataforma-instagram"
                onClick={() => handleSelect("instagram")}
              >
                <InstagramIcon /> Instagram
              </button>
            </div>
          </div>
        </div>
    </div>  
  );
};

export default Contato;
