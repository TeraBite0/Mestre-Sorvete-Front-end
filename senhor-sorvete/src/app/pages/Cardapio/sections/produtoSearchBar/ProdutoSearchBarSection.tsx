import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './ProdutoSearchBar.css';
import FiltroCategoriaModal from '../../modais/filtro/FiltroCardapioModal';
import { useState } from 'react';
// import CarrinhoModalCardapio from '../../modais/carrinho/CarrinhoModalCardapio';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../../../store/store';

export default function ProdutoSearchBarSection() {
    const [mostrarFiltroCategoriaModal, setMostrarFiltroCategoriaModal] = useState<boolean>(false);
    // const [mostrarCarrinhoModal, setMostrarCarrinhoModal] = useState<boolean>(false);
    // const produtos = useSelector((state: RootState) => {
    //     const { listaProdutosAtivos, produtosFiltrados } = state.produtos;
    //     return produtosFiltrados.length > 0 ? produtosFiltrados : listaProdutosAtivos;
    //   });

    const fecharModalFiltro = () => {
        setMostrarFiltroCategoriaModal(false);
    }

    // const fecharModalCarrinho = () => {
    //     setMostrarCarrinhoModal(false);
    // }

    return (
        <>
            <div className="container-produto-search">

            <Button icon="pi pi-sliders-h" onClick={() => setMostrarFiltroCategoriaModal(true)} />
            {/* <Button icon="pi pi-shopping-cart" onClick={() => setMostrarCarrinhoModal(true)} className="p-button-success" style={{marginLeft: '10px'}} /> */}
            
                <div className="p-inputgroup flex-1" style={{marginLeft: '10px'}}>
                    {/* <InputText placeholder="Pesquisar..." className="inputPesquisa" /> */}
                    <Button icon="pi pi-search" className="botaoPesquisa" />
                </div>
            </div>

            <FiltroCategoriaModal isMaisModalOpen={mostrarFiltroCategoriaModal} isMaisModalClose={fecharModalFiltro} />
            {/* <CarrinhoModalCardapio isModalOpen={mostrarCarrinhoModal} closeModal={fecharModalCarrinho} cartItems={produtos}/> */}
        </>
    )
}
        
