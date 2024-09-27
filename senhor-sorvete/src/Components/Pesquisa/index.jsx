import './barraPesquisa.css';
import SearchIcon from '@mui/icons-material/Search';

const barraPesquisa = (props) => {

    return(
        <div className='pesquisa'>
           
           <div className='barra-pesquisa'>
                <input type="text" placeholder={props.placeholder}></input>    
                <button><SearchIcon/></button>
           </div>     
        
        </div>
    );
}
export default barraPesquisa;