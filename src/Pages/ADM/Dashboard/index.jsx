import React, { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import "./dashboard.css";

// Registro dos componentes do Chart.js
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

// Função para obter a ordem dinâmica dos meses
const getDynamicMonthOrder = () => {
  const allMonths = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const startMonth = 5; // Junho (índice 5)
  return [...allMonths.slice(startMonth), ...allMonths.slice(0, startMonth)];
};

// Função para obter a semana atual
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
  const [dashboardData, setDashboardData] = useState({
    resumoDeVendas: [],
    previsaoTemperatura: [],
    produtosMaisVendidos: [],
    produtosMenosVendidos: [],
    produtosBaixoEstoque: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateCSVData = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return '';
    }
  
    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(header => item[header]));
  
    const csvContent = [
      headers.join(','), // Cabeçalhos
      ...rows.map(row => row.join(',')), // Dados
    ].join('\n');
  
    return csvContent;
  };
  
  
  const fetchGerarCsv = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch("http://localhost:8080/exportcsv", {
        method: "GET",
        headers: {
          Accept: "*/*", // Alterado para * / * conforme esperado pelo back-end
        },
      });
  
      // Tratamento para erros 500
      if (response.status === 500) {
        const errorData = await response.text();
        console.error("Erro do servidor:", errorData);
        throw new Error("Erro interno do servidor. Por favor, tente novamente mais tarde.");
      }
  
      // Outros erros (não OK)
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Resposta de erro:", errorData);
        throw new Error(`Erro ${response.status}: ${errorData || 'Erro desconhecido'}`);
      }
  
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("O arquivo CSV está vazio.");
      }
  
      // Criação do link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "dados-dashboard.csv");
      document.body.appendChild(link);
      link.click();
  
      // Limpeza após o clique
      window.URL.revokeObjectURL(url);
      link.remove();
  
    } catch (error) {
      console.error("Erro detalhado:", error);
  
      // Definir mensagem de erro amigável
      let errorMessage = error.message;
  
      // Tratamento customizado de erros comuns
      if (errorMessage.includes("500")) {
        errorMessage = "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.";
      } else if (errorMessage.includes("401")) {
        errorMessage = "Sessão expirada. Por favor, faça login novamente.";
      } else if (errorMessage.includes("403")) {
        errorMessage = "Você não tem permissão para exportar estes dados.";
      }
  
      // Atualiza o estado de erro com a mensagem amigável
      setError(`Não foi possível exportar os dados: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  
 
  // Função para tratar datas em formato DD/MM/YYYY
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  // Função para buscar dados do back-end
  const fetchDashboardData = async () => {
    const token = sessionStorage.getItem("token");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/dashboard/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
          `Erro ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data || typeof data !== "object" || !data.resumoDeVendas) {
        throw new Error("Dados inválidos ou incompletos recebidos do servidor.");
      }

      // Ordenar resumoDeVendas com base na ordem dinâmica dos meses
      const order = getDynamicMonthOrder();
      data.resumoDeVendas = data.resumoDeVendas.sort((a, b) => {
        const monthA = new Date(a.data).toLocaleDateString("pt-BR", { month: "long" }).toLowerCase();
        const monthB = new Date(b.data).toLocaleDateString("pt-BR", { month: "long" }).toLowerCase();
        return order.indexOf(monthA) - order.indexOf(monthB);
      });

      setDashboardData(data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError(error.message);
      setDashboardData({
        resumoDeVendas: [],
        previsaoTemperatura: [],
        produtosMaisVendidos: [],
        produtosMenosVendidos: [],
        produtosBaixoEstoque: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Configurações dos gráficos
  const dashProdutosMaisVendidos = {
    labels: dashboardData.produtosMaisVendidos.map(produto => produto.nome),
    datasets: [{
      label: "Mais Vendidos",
      backgroundColor: "rgba(34, 197, 94, 1)",
      data: dashboardData.produtosMaisVendidos.map(produto => produto.qtdVendido)
    }]
  };

  const dashProdutosMenosVendidos = {
    labels: dashboardData.produtosMenosVendidos.map(produto => produto.nome),
    datasets: [{
      label: "Menos Vendidos",
      backgroundColor: "rgba(255, 0, 0, 0.8)",
      data: dashboardData.produtosMenosVendidos.map(produto => produto.qtdVendido)
    }]
  };

  const dashVendasETemperatura = {
    labels: dashboardData.resumoDeVendas.map(resumo => {
      const data = parseDate(resumo.data);
      return data && !isNaN(data.getTime())
        ? data.toLocaleDateString("pt-BR", { month: "long" })
        : "Data inválida";
        console.log("Temperaturas:", dashboardData.resumoDeVendas.map(resumo => resumo.temperaturaMedia));
    }),
    datasets: [
      {
        type: "bar",
        label: "Faturamento no mês",
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        data: dashboardData.resumoDeVendas.map(resumo => resumo.faturamento)
      },
      {
        type: "line",
        label: "Temperatura média (°C)",
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 1)",
        fill: false,
        data: dashboardData.resumoDeVendas.map(resumo => resumo.temperaturaMedia)
      }
    ]
  };

  const dashPrevisaoDeVendas = {
    labels: dashboardData.previsaoTemperatura.map(prev => {
      const data = new Date(prev.data);
      return data.toLocaleDateString("pt-BR", { weekday: "long" });
    }),
    datasets: [{
      label: "Previsão de Vendas",
      borderColor: "rgba(34, 197, 94, 1)",
      backgroundColor: "rgba(34, 197, 94, 1)",
      fill: false,
      data: dashboardData.previsaoTemperatura.map(prev => prev.porcentagemVenda)
    }]
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erro ao carregar os dados: {error}</p>
        <button onClick={fetchDashboardData}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <>
      <HeaderGerenciamento />
      <div className="secao-recomendacoes">
        <BotaoVoltarGerenciamento />
        <div className="exportar-dados">
          <BotaoGerenciamento botao="Exportar CSV" onClick={fetchGerarCsv} />
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-item">
          <h1>Mais Vendidos</h1>
          <Bar data={dashProdutosMaisVendidos} />
        </div>

        <div className="dashboard-item">
          <h1>Menos Vendidos</h1>
          <Bar data={dashProdutosMenosVendidos} />
        </div>

        <div className="dashboard-item">
          <h1>Vendas & Temperatura</h1>
          <Line data={dashVendasETemperatura} />
        </div>

        <div className="dashboard-item">
          <h1>Previsão de Vendas</h1>
          <Line data={dashPrevisaoDeVendas} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;