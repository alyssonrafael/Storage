import { Component } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import api from '../../api';

// Define o tipo dos dados esperados da API
interface CategorySalesData {
  [category: string]: number; // A chave é o nome da categoria e o valor é a quantidade vendida
}

// Define o tipo do estado do componente
interface State {
  options: ApexOptions; // Opções do gráfico
  series: number[]; // Dados da série do gráfico (valores das vendas por categoria)
}

class GraphicSalesOfCategory extends Component<object, State> {
  constructor(props: object) {
    super(props);

    // Inicializa o estado do componente
    this.state = {
      options: {
        chart: {
          type: 'donut' // Tipo de gráfico
        },
        labels: [], // Rótulos das categorias
        colors: [], // Cores dos segmentos do gráfico
        legend: {
          position: 'bottom' // Posição da legenda
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 400 // Largura do gráfico em telas pequenas
            },
            legend: {
              position: 'bottom' // Posição da legenda em telas pequenas
            }
          }
        }],
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Produtos vendidos',
                  formatter: (w) => {
                    // Calcula o total de produtos vendidos e retorna como string
                    const totals = w.globals.seriesTotals as number[];
                    const total = totals.reduce<number>((a, b) => a + b, 0);
                    return total.toString(); // Retorna como string
                  }
                }
              }
            }
          }
        }
      },
      series: [], // Dados das vendas por categoria
    };
  }

  // Método chamado após o componente ser montado
  async componentDidMount() {
    try {
      const response = await api.get<CategorySalesData>('/relatorios/produtos-vendidos-categoria'); 
      const data = response.data;

      // Prepara dados para o gráfico
      const categories = Object.keys(data);
      const values = Object.values(data);

      this.setState({
        options: {
          ...this.state.options,
          labels: categories // Atualiza os rótulos com as categorias
        },
        series: values // Atualiza os dados da série com os valores
      });
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
    }
  }

  // Renderiza o gráfico
  render() {
    return (
      <div className="donut flex flex-col items-center">
        <h1 className="md:text-3xl text-xl text-blaze-orange-500 text-center mb-6">Vendas por categoria</h1>
        <Chart options={this.state.options} series={this.state.series} type="donut" height="300" />
      </div>
    );
  }
}

export default GraphicSalesOfCategory;
