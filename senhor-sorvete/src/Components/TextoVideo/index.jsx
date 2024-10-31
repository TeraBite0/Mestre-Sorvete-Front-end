import "./textoVideo.css";

const TextoVideo = (props) => {
  return (
    <div className="sobre-sorvete">
      <div className="texto-sobre">
        <h1>{props.titulo}</h1>
        <p>{props.texto}</p>
      </div>

      <div className="sorvete-video">
        <iframe
          width="600"
          height="450"
          src={props.video}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        ></iframe>
      </div>
    </div>
  );
};
export default TextoVideo;
