import { useState } from 'react';
import './cardapio.css';
import Header from '../../Components/Header';

const Cardapio = () => {
    // termo de procura de pesquisa
    const[termo, setTermo] = useState('');



    return (
        <div class='container'>
            <Header/>
        </div>
    )

}

export default Cardapio