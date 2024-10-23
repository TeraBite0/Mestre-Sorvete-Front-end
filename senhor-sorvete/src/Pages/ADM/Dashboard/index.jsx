import React from "react";
import BotaoGerenciamento from "../../../Components/BotaoGerenciamento";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from "../../../Components/BotaoVoltarGerenciamento";
import "./dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const getCurrentWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const firstDayOfWeek = new Date(today);
  const lastDayOfWeek = new Date(today);

  firstDayOfWeek.setDate(
    today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  );
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

  const options = { day: "numeric", month: "long", year: "numeric" };
  const firstDayFormatted = firstDayOfWeek.toLocaleDateString("pt-BR", options);
  const lastDayFormatted = lastDayOfWeek.toLocaleDateString("pt-BR", options);

  return `Semana de ${firstDayFormatted} à ${lastDayFormatted}`;
};

const Dashboard = () => {
  const currentWeekLabel = getCurrentWeek();

  const dashProdutosMaisVendidos = {
    labels: [
      "Picolé de Uva",
      "Sorvete de Chocolate",
      "Picolé de Limão",
      "Picolé de Leite Condensado",
    ],
    datasets: [
      {
        label: "Mais Vendidos",
        backgroundColor: "rgba(34, 197, 94, 1)", // Verde
        data: [30, 28, 25, 23],
      },
    ],
  };

  const dashProdutosMenosVendidos = {
    labels: [
      "Picolé de Groselha",
      "Sorvete de Beijinho",
      "Sorvete de Manga",
      "Paleta de Maracujá",
    ],
    datasets: [
      {
        label: "Menos Vendidos",
        backgroundColor: "rgba(255, 0, 0, 0.8)", // Vermelho
        data: [1, 2, 4, 5],
      },
    ],
  };

  const dashVendasETemperatura = {
    labels: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
    ],
    datasets: [
      {
        type: "bar",
        label: "Vendas no mês",
        backgroundColor: "rgba(54, 162, 235, 0.7)", // Azul
        data: [290, 225, 210, 204, 140, 153, 160],
      },
      {
        type: "line",
        label: "Temperatura média (°C)",
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 1)", // Vermelho
        fill: false,
        data: [25, 27, 25, 23, 24, 22, 19],
      },
    ],
  };

  // Lógica de cores conforme previsão de vendas
  const vendasPrevistas = [25, 28, 30, 42, 50, 40, 80];
  const mediaDeVendas =
    vendasPrevistas.reduce((a, b) => a + b, 0) / vendasPrevistas.length;
  let corLinha = "green";

  if (mediaDeVendas < 30) {
    corLinha = "red";
  } else if (mediaDeVendas < 50) {
    corLinha = "yellow";
  }

  const dashPrevisaoDeVendas = {
    labels: [
      "Segunda-Feira",
      "Terça-Feira",
      "Quarta-Feira",
      "Quinta-Feira",
      "Sexta-Feira",
      "Sábado",
      "Domingo",
    ],
    datasets: [
      {
        label: "Previsão de Vendas",
        borderColor: corLinha,
        backgroundColor: corLinha,
        fill: false,
        data: vendasPrevistas,
      },
    ],
  };

  return (
    <>
      <HeaderGerenciamento />
      <div className="secao-recomendacoes">
        <BotaoVoltarGerenciamento />
      </div>
      <div className="exportar-dados">
       <BotaoGerenciamento botao="Exportar Dados" 
        /*  onClick={} */
        /> 
      </div>
      <div className="main-container">
        <div className="titulo-cadastrar">
          <h2>Dashboards</h2>
        </div>
      </div>

      <div className="dashboard-container">
        {/* 1º Dashboard - Produtos mais vendidos */}
        <div className="dashboard-item">
          <h1>Mais Vendidos</h1>
          <Bar data={dashProdutosMaisVendidos} />
        </div>

        {/* 2º Dashboard - Produtos menos vendidos */}
        <div className="dashboard-item">
          <h1>Menos Vendidos</h1>
          <Bar data={dashProdutosMenosVendidos} />
        </div>

        {/* 3º Dashboard - Vendas e Temperatura */}
        <div className="dashboard-item">
          <h1>Vendas e Temperatura</h1>
          <Bar data={dashVendasETemperatura} />
        </div>

        {/* 4º Dashboard - Previsão de Vendas */}
        <div className="dashboard-item">
          <h1>Previsão de Vendas</h1>
          <h5>{currentWeekLabel}</h5>
          <Line data={dashPrevisaoDeVendas} />
          <p>
            Legenda: <span style={{ color: "red" }}>Média abaixo de 30</span> |{" "}
            <span style={{ color: "yellow" }}>Média abaixo de 50</span> |{" "}
            <span style={{ color: "green" }}>Média maior ou igual à 50</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
