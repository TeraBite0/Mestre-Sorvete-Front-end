import { useState } from "react";
import './contato.css';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

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
<>
    <div>
      <Header/>
    </div>

    <div>
      {selecionado ? (
        <h2>Redirecionando para {selecionado}...</h2>
      ) : (
        <div className="contato">
          <div>
            <img src="" alt="" />
          </div>
          <h2>Senhor Sorvete</h2>
          <button onClick={() => handleSelect("whatsapp")}><WhatsAppIcon/> WhatsApp</button>
          <button onClick={() => handleSelect("instagram")}><InstagramIcon/> Instagram</button>
        </div>
      )}
    </div>

    <div>
      <Footer/>
    </div>
    </>
  );
};

export default Contato;
