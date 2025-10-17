import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './ProdutoSearchBar.css';

export default function ProdutoSearchBarSection() {
    return (
        <div className="container-produto-search">

          <Button icon="pi pi-sliders-h" />
          <Button icon="pi pi-shopping-cart" className="p-button-success" style={{marginLeft: '10px'}} />
          
            <div className="p-inputgroup flex-1" style={{marginLeft: '10px'}}>
                <InputText placeholder="Pesquisar..." className="inputPesquisa" />
                <Button icon="pi pi-search" className="botaoPesquisa" />
            </div>
        </div>
    )
}
        
