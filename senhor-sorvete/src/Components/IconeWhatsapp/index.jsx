import "./iconeWhatsapp.css";

const IconeWhatsapp = (props) => {
  return (
    <div className="whatsapp-icon">
      <a
        href="https://wa.me/5511988469500"
        target="_blank" // Abrir em uma nova guia
        className="whatsapp-icon"
        rel="noopener noreferrer"
      >
        <img src="Imagens/logo-whatsapp.png" alt="WhatsApp Icon" />
      </a>
    </div>
  );
};

export default IconeWhatsapp;
