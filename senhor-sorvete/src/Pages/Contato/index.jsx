import { useState } from "react";

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
    <div>
      {selecionado ? (
        <h2>Redirecionando para {selecionado}...</h2>
      ) : (
        <div>
          <h2>Escolha um contato</h2>
          <button onClick={() => handleSelect("whatsapp")}>WhatsApp</button>
          <button onClick={() => handleSelect("instagram")}>Instagram</button>
        </div>
      )}
    </div>
  );
};

export default Contato;
