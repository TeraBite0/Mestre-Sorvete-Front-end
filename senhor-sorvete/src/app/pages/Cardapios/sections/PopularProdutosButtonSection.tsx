import WhatshotIcon from "@mui/icons-material/Whatshot";

type PopularProdutosButtonProps = {
    isPopularToggled: boolean;
    isLoadingPopular: boolean;
};

const PopularProdutosButtonSection = ({ isPopularToggled, isLoadingPopular }: PopularProdutosButtonProps ) => (
  <button
    className={`trendingButton ${isPopularToggled ? "toggled" : ""}`}
    disabled={isLoadingPopular}
    style={{
      backgroundColor: isPopularToggled ? "#772321" : "#FFF",
      color: isPopularToggled ? "white" : "inherit",
    }}
  >
    <WhatshotIcon style={{ color: isPopularToggled ? "white" : "inherit" }} />
    <span>{isLoadingPopular ? "Carregando..." : "Popular"}</span>
  </button>
);

export default PopularProdutosButtonSection;
