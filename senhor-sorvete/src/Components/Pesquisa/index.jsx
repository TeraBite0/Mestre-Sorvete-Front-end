import './barraPesquisa.css';
import SearchIcon from '@mui/icons-material/Search';

const BarraPesquisa = (props) => {
    return (
        <div className='pesquisa'>
            <div className='barra-pesquisa'>
                <input
                    type="text"
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                />
                <button>
                    <SearchIcon />
                </button>
            </div>
        </div>
    );
};

export default BarraPesquisa;
