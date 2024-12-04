import './artigo.css';

const Artigo = (props) => {

    return(

        <div className='artigo'>
            

            <div className='informacoes'>

                    <img src={props.imagem} alt={props.placeholder}/>
               

                <div className='texto-artigo'>
                    <h6>{props.titulo}</h6>
                    <p>{props.texto}</p>
                </div>

            </div>
        </div>
    );

}
export default Artigo;