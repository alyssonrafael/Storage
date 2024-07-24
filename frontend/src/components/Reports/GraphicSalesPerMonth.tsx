import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'; // Importa o componente Chart da biblioteca react-apexcharts
import axios from 'axios'; // Importa o axios para fazer requisições HTTP
import { ApexOptions } from 'apexcharts'; // Importa o tipo ApexOptions para as opções do gráfico

const GraphicSalesPerMonth = () => {
  // Estado para as opções do gráfico, usando o tipo ApexOptions para garantir que as opções estejam corretas
  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      height: 350, // Altura do gráfico
      type: 'line', // Tipo de gráfico (linha)
      zoom: {
        enabled: false // Desativa o zoom no gráfico
      }
    },
    dataLabels: {
      enabled: false // Desativa os rótulos de dados no gráfico
    },
    stroke: {
      curve: 'smooth' // Define a curva das linhas do gráfico como suave
    },
    xaxis: {
      categories: [], // Inicialmente vazio; será preenchido com os meses/datas
    },
    yaxis: {
      title: {
        text: 'Valor arrecadado' // Título do eixo Y
      },
      min: 0, // Define o valor mínimo do eixo Y como 0
      labels: {
        formatter: (value: number) => value.toFixed(2) // Formata os rótulos do eixo Y para mostrar 2 casas decimais
      }
    }
  });

  // Estado para os dados da série do gráfico
  const [chartSeries, setChartSeries] = useState([{
    name: "Valor total R$", // Nome da série
    data: [] // Inicialmente vazio; será preenchido com os dados de vendas
  }]);

  // Efeito colateral para buscar dados quando o componente é montado
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Faz uma requisição GET para buscar os dados do gráfico
        const response = await axios.get('http://localhost:3333/api/relatorios/tendencia-vendas'); 
        const data = response.data;

        // Formata valores com 2 casas decimais
        const formattedValues = data.values.map((value: string) => parseFloat(value).toFixed(2));

        // Atualiza as opções do gráfico com as categorias recebidas dos dados
        setChartOptions(prevOptions => ({
          ...prevOptions,
          xaxis: {
            categories: data.categories,
          }
        }));

        // Atualiza a série do gráfico com os valores formatados
        setChartSeries([{
          name: "Valor total R$",
          data: formattedValues
        }]);
      } catch (error) {
        // Loga qualquer erro encontrado durante a requisição
        console.error('Erro ao buscar dados do gráfico:', error);
      }
    };

    fetchData(); // Chama a função para buscar os dados
  }, []); // Dependências vazias significam que o efeito será executado apenas na montagem

  return (
    <div className="sales-trend-chart">
      {/* Título do gráfico */}
      <h1 className="text-3xl text-blaze-orange-500 text-center mb-6">Valor vendido por mês</h1>
      <small>Ultimos 6 meses</small>
      {/* Componente Chart da biblioteca react-apexcharts */}
      <Chart options={chartOptions} series={chartSeries} type="line" height={280} />
    </div>
  );
};

export default GraphicSalesPerMonth;
