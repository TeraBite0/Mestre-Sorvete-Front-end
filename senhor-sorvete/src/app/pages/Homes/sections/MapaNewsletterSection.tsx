const MapaNewsletterSection = ({
  email,
  setEmail,
  error,
  handleSubmit,
}: {
  email: string;
  setEmail: (value: string) => void;
  error: string;
  handleSubmit: (e: React.FormEvent) => void;
}) => (
  <section className="mapa-section">
    <div className="mapa-section">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.090514945892!2d-46.492801125018104!3d-23.63692926437218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce69769e05f995%3A0xa5657f81c68e3102!2sMestre%20Sorvete!5e0!3m2!1spt-BR!2sbr!4v1740097443188!5m2!1spt-BR!2sbr"
        title="Localização Mestre Sorvete"
        width="620"
        height="350"
        loading="lazy"
      />
    </div>
    <div className="classe-notificacao-e-email">
      {/*
      <div className="notificacoes-text">
        <h2>Receber notificações</h2>
        <p>
          Não perca a chance de ser o primeiro a saber quando novos sabores
          chegam à nossa sorveteria! Inscreva-se para receber notificações
          por e-mail.
        </p>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="email-error">{error}</p>}        

          <ButtonNavegation
              texto="Receber"
              classNameButton="btn-primary"
              tipo="submit"/>

        </form>
      </div>
      */}
    </div>
  </section>
);

export default MapaNewsletterSection;