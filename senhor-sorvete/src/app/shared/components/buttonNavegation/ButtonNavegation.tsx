import { useNavigate } from 'react-router-dom';

interface BotaoSaibaMaisProps {
    texto: string
    pagina?: string;
    classNameDiv?: string;
    classNameButton?: string;
    tipo?: "button" | "submit";
}

export const ButtonNavegation = ({
    pagina,
    texto,
    classNameDiv,
    classNameButton,
    tipo
}: BotaoSaibaMaisProps) => {

    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (tipo === "button" && pagina) {
            navigate(pagina);
        }
    }

    return (
        <div className={classNameDiv}>
            <button className={classNameButton}
                onClick={handleClick}>
                {texto}
            </button>
        </div>
    );

}