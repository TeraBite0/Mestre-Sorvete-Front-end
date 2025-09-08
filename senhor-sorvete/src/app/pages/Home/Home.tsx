import "./home.css";
import Header from "../../shared/components/Header";
import Footer from "../../shared/components/Footer";
import IconeWhatsapp from "../../shared/components/IconeWhatsapp";
import CarrosselImagens from "../../shared/components/CarrosselImagens";
import useHome from "./hooks/useHome";
import HeroSection from "./sections/HeroSection";
import SobreSection from "./sections/SobreSection";
import SugestaoDoDiaSection from "./sections/SugestaoDoDiaSection";
import MaisSection from "./sections/MaisSection";
import MapaNewsletterSection from "./sections/MapaNewsletterSection";

const Home = () => {
  const { dataAtual, email, setEmail, error, handleSubmit, destaqueDia } = useHome();

  return (
    <div className="home">
      <Header />
      <main>
        <IconeWhatsapp />

        <HeroSection />
        <SobreSection />
        <CarrosselImagens />
        <SugestaoDoDiaSection dataAtual={dataAtual} destaqueDia={destaqueDia} />
        <MaisSection />
        <MapaNewsletterSection
          email={email}
          setEmail={setEmail}
          error={error}
          handleSubmit={handleSubmit}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Home;