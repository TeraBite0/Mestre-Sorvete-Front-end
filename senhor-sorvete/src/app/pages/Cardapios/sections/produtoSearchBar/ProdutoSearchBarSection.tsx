import './ProdutoSearchBar.css';
import { useState } from 'react';
import 'primeicons/primeicons.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/primereact.min.css';
import { RootState } from '../../../../../store/store';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import FiltroCategoriaModal from '../../modais/filtro/FiltroCardapioModal';
import { setProdutosFiltrados } from '../../../../../store/slices/produtos';
import CarrinhoModalCardapio from '../../modais/carrinho/CarrinhoModalCardapio';

export default function ProdutoSearchBarSection() {
    const dispatch = useDispatch();
    const listaProdutosAtivos = useSelector((state: RootState) => state.produtos.listaProdutosAtivos);
    const listaCompleta = listaProdutosAtivos;
    const [inputPesquisa, setInputPesquisa] = useState<string>('');

    const [mostrarFiltroCategoriaModal, setMostrarFiltroCategoriaModal] = useState<boolean>(false);
    const [mostrarCarrinhoModal, setMostrarCarrinhoModal] = useState<boolean>(false);
    const fecharModalFiltro = () => {setMostrarFiltroCategoriaModal(false);}
    const fecharModalCarrinho = () => {setMostrarCarrinhoModal(false);}

    const pesquisar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e) {
            const termo = e.target.value.toLowerCase();
            const resultados = listaCompleta.filter(produto =>
                (produto.nome?.toLowerCase().includes(termo) ?? false) ||
                (produto.descricao?.toLowerCase().includes(termo) ?? false)
            );
            dispatch(setProdutosFiltrados(resultados));
            setInputPesquisa(e.target.value);
        }
    }

    return (
        <>
            <div className="container-produto-search">
                <Button icon="pi pi-sliders-h" onClick={() => setMostrarFiltroCategoriaModal(true)} />
                <Button icon="pi pi-heart" onClick={() => setMostrarCarrinhoModal(true)} className="p-button-success" style={{ marginLeft: '10px' }} />

                <div className="p-inputgroup flex-1" style={{ marginLeft: '10px' }}>
                    <InputText value={inputPesquisa} placeholder="Pesquisar..." className="inputPesquisa" onChange={(e) => pesquisar(e)} />
                    <Button icon="pi pi-search" className="botaoPesquisa" />
                </div>
            </div>

            <FiltroCategoriaModal isMaisModalOpen={mostrarFiltroCategoriaModal} isMaisModalClose={fecharModalFiltro} />
            <CarrinhoModalCardapio isModalOpen={mostrarCarrinhoModal} closeModal={fecharModalCarrinho} />
        </>
    )
}

