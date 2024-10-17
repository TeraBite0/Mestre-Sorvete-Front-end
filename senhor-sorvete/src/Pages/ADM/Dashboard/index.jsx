import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import HeaderGerenciamento from "../../../Components/HeaderGerenciamento";
import BotaoVoltarGerenciamento from "../../../Components/BotaoVoltarGerenciamento";
import "./dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const data = {
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
        label: "Vendas",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };
  return (
    <>
      <HeaderGerenciamento />
      <div className="secao-recomendacoes">
        <BotaoVoltarGerenciamento />
      </div>
      <div className="main-container">
        <div className="titulo-cadastrar">
          <h2>Dashboards</h2>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-item">
          <Bar data={data} />
        </div>
        <div className="dashboard-item">
          <Line data={data} />
        </div>
        <div className="dashboard-item">
          <Pie data={data} />
        </div>
        {/* <div className="dashboard-item">
          <Doughnut data={data} />
        </div> */}
      </div>
    </>
  );
};

export default Dashboard;
