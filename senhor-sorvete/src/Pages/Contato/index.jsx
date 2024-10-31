import { useState } from "react";
import './contato.css';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import Header from '../../Components/Header';

const Contato = () => {
  const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

  const [selecionado, setSelecionado] = useState(null);

  const handleSelect = (platform) => {
    setSelecionado(platform);

    setTimeout(() => {
      if (platform === "whatsapp") {
        if (isMobile()) {
          window.location.href =
            "https://api.whatsapp.com/send/?phone=5511988469500&text&type=phone_number&app_absent=0";
        } else {
          window.location.href =
            "https://web.whatsapp.com/send?phone=5511988469500";
        }
      } else if (platform === "instagram") {
        window.location.href =
          "https://www.instagram.com/mestresorvete?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
      }
    }, 300);
  };

  return (
    <div className="contato-container">
      <Header />

      <div className="contato">
        <div>
          <img src="/Imagens/logo-josue.jpg" alt="Logo do mestre sorvete"/>
        </div>
        <h2>Mestre Sorvete</h2>
        <button className="botao-whatsaap" onClick={() => handleSelect("whatsapp")}>
          <WhatsAppIcon /> WhatsApp
        </button>
        <button className="botao-instagram" onClick={() => handleSelect("instagram")}>
          <InstagramIcon /> Instagram
        </button>
      </div>


    </div>
  );
};

export default Contato;
