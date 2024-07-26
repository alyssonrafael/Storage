import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'; // Importa o componente Chart da biblioteca react-apexcharts
import api from '../../api';

// Define os tipos para os dados recebidos da API
interface PaymentMethodData {
  categories: string[]; // Métodos de pagamento (nomes das categorias)
  values: number[]; // Quantidades de vendas para cada método de pagamento
}

const GraphicSalesByPaymentMethod = () => {
  // Estado para armazenar as opções do gráfico
  const [chartOptions, setChartOptions] = useState<ApexCharts.ApexOptions>({
    chart: {
      type: 'polarArea', // Tipo de gráfico ajustado para polarArea
      height: 320 // Altura do gráfico
    },
    labels: [], // Inicialmente vazio; será preenchido com os métodos de pagamento
    legend: {
      position: 'right', // Posição da legenda à direita do gráfico
    },
    fill: {
      opacity: 0.8 // Opacidade de preenchimento das áreas do gráfico
    },
    responsive: [{ // Configurações responsivas para diferentes tamanhos de tela
      breakpoint: 480, // Aplica configurações para telas menores que 480px
      options: {
        chart: {
          width: 300 // Largura do gráfico em telas menores
        },
        legend: {
          position: 'bottom' // Posição da legenda embaixo do gráfico em telas menores
        }
      }
    }],
    yaxis: {
      max: 0 // Inicialmente definido como 0; será atualizado após o carregamento dos dados
    }
  });

  // Estado para armazenar os dados da série do gráfico
  const [chartSeries, setChartSeries] = useState<number[]>([]);
  // Estado para armazenar o total de vendas
  const [totalSales, setTotalSales] = useState<number>(0);

  useEffect(() => {
    // Função assíncrona para buscar os dados da API
    const fetchData = async () => {
      try {
        // Faz uma requisição GET para buscar os dados dos métodos de pagamento
        const response = await api.get<PaymentMethodData>('/relatorios/metodos-de-pagamento');
        const data = response.data;

        // Calcula o valor máximo dos dados para ajustar o eixo Y
        const maxValue = Math.max(...data.values); 
        const maxAxisValue = maxValue + 2; // Ajusta para que o gráfico tenha uma borda de 2 unidades a mais do maior valor

        // Atualiza as opções do gráfico com os dados recebidos
        setChartOptions(prevOptions => ({
          ...prevOptions,
          labels: data.categories, // Atualiza os rótulos do gráfico com os métodos de pagamento
          yaxis: {
            max: maxAxisValue // Define o valor máximo do eixo Y
          }
        }));

        // Calcula o total de vendas
        const total = data.values.reduce((acc, value) => acc + value, 0);
        setTotalSales(total);

        // Atualiza os dados da série do gráfico
        setChartSeries(data.values);
      } catch (error) {
        // Loga qualquer erro encontrado durante a requisição
        console.error('Erro ao buscar dados do gráfico:', error);
      }
    };

    fetchData(); // Chama a função para buscar os dados
  }, []); // Dependências vazias significam que o efeito será executado apenas na montagem

  return (
    <div className="sales-by-payment-method-chart items-center text-center ">
      {/* Título do gráfico */}
      <h1 className="md:text-3xl text-xl text-blaze-orange-500 mb-6">Métodos de Pagamento Usados</h1>
      {/* Mostra o total de vendas */}
      <p className="mt-4 md:text-lg font-semibold">Quantidade Total de Vendas: {totalSales}</p>
      {/* Componente Chart da biblioteca react-apexcharts */}
      <Chart options={chartOptions} series={chartSeries} type="polarArea" height={290} />
    </div>
  );
};

export default GraphicSalesByPaymentMethod;
