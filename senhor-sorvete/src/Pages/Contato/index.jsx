import { useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import Header from "../../Components/Header";
import "./contato.css";

const Contato = () => {
  const [selecionado, setSelecionado] = useState(null);

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
      <div className="contato">
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
  );
};

export default Contato;
