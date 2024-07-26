import Slider from 'react-slick'; // Importa o componente Slider do pacote react-slick para criar um carrossel
import "slick-carousel/slick/slick.css"; // Importa o estilo padrão do carrossel
import "slick-carousel/slick/slick-theme.css"; // Importa o tema padrão do carrossel
import Card from './Card'; // Importa o componente Card que será usado no carrossel
import { useEffect, useState } from 'react'; // Importa useEffect e useState do React
import api from '../../api';

// Componente principal ValueSalesCard
const ValueSalesCard = () => {
  // Estado para armazenar os valores das vendas
  const [valueSalesDayData, setValueSalesDayData] = useState<number | null>(null); // Estado para armazenar o valor total de vendas do dia
  const [valueSalesMonthData, setValueSalesMonthData] = useState<number | null>(null); // Estado para armazenar o valor total de vendas do mês
  const [valueSalesYearData, setValueSalesYearData] = useState<number | null>(null); // Estado para armazenar o valor total de vendas do ano

  // Função para buscar os dados das vendas
  const fetchData = async () => {
    try {
      // Faz requisições para obter os dados das vendas do dia, mês e ano
      const [dayResponse, monthResponse, yearResponse] = await Promise.all([
        api.get('/relatorios/total-vendas-dia'),
        api.get('/relatorios/total-vendas-mes'),
        api.get('/relatorios/total-vendas-ano')
      ]);

      // Define os estados com os dados obtidos
      setValueSalesDayData(dayResponse.data.totalSales);
      setValueSalesMonthData(monthResponse.data.totalSales);
      setValueSalesYearData(yearResponse.data.totalSales);
    } catch (error) {
      console.error('Erro ao buscar dados de vendas:', error); // Exibe um erro no console se a requisição falhar
    }
  };

  // useEffect para buscar os dados quando o componente for montado
  useEffect(() => {
    fetchData();
  }, []);

  // Configurações do carrossel
  const settings = {
    slidesToShow: 1, // Número de slides a serem exibidos ao mesmo tempo
    slidesToScroll: 1, // Número de slides a serem rolados por vez
    arrows: false, // Desativa as setas de navegação
    dots: true // Ativa os pontos de navegação
  };

  return (
    <div>
      <Slider {...settings}> {/* Inicia o carrossel com as configurações especificadas */}
        <div className="flex justify-center"> {/* Slide para o valor total vendido no dia */}
          <Card title="Valor vendido no dia" subtitle={valueSalesDayData !== null ? `R$${valueSalesDayData.toFixed(2)}` : 'Carregando...'}/>
        </div>
        <div className="flex justify-center"> {/* Slide para o valor total vendido no mês */}
          <Card title="Valor vendido no mês" subtitle={valueSalesMonthData !== null ? `R$${valueSalesMonthData.toFixed(2)}` : 'Carregando...'}/>
        </div>
        <div className="flex justify-center"> {/* Slide para o valor total vendido no ano */}
          <Card title="Valor vendido no ano" subtitle={valueSalesYearData !== null ? `R$${valueSalesYearData.toFixed(2)}` : 'Carregando...'}/>
        </div>
      </Slider>
    </div>
  );
};

export default ValueSalesCard;
