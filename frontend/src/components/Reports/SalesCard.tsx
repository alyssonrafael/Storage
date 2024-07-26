import Slider from 'react-slick'; // Importa o componente Slider do pacote react-slick para criar um carrossel
import "slick-carousel/slick/slick.css"; // Importa o estilo padrão do carrossel
import "slick-carousel/slick/slick-theme.css"; // Importa o tema padrão do carrossel
import Card from './Card'; // Importa o componente Card que será usado no carrossel
import { useEffect, useState } from 'react'; // Importa useEffect e useState do React
import api from '../../api';

// Componente principal SalesCard
const SalesCard = () => {
  // Estado para armazenar os valores das vendas
  const [daySales, setDaySales] = useState<number | null>(null); // Estado para armazenar as vendas do dia
  const [monthSales, setMonthSales] = useState<number | null>(null); // Estado para armazenar as vendas do mês
  const [yearSales, setYearSales] = useState<number | null>(null); // Estado para armazenar as vendas do ano

  // Função para buscar os dados de vendas
  const fetchData = async () => {
    try {
      // Faz requisições para obter os dados de vendas do dia, mês e ano
      const [dayResponse, monthResponse, yearResponse] = await Promise.all([
        api.get('/relatorios/vendas-dia'),
        api.get('/relatorios/vendas-mes'),
        api.get('/relatorios/vendas-ano')
      ]);

      // Define os estados com os dados obtidos
      setDaySales(dayResponse.data.vendasDoDia);
      setMonthSales(monthResponse.data.vendasDoMes);
      setYearSales(yearResponse.data.vendasDoAno);
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
        <div className="flex justify-center"> {/* Slide para as vendas do dia */}
          <Card title="Vendas do dia" subtitle={daySales !== null ? daySales : 'Carregando...'} />
        </div>
        <div className="flex justify-center"> {/* Slide para as vendas do mês */}
          <Card title="Vendas do Mês" subtitle={monthSales !== null ? monthSales : 'Carregando...'}/>
        </div>
        <div className="flex justify-center"> {/* Slide para as vendas do ano */}
          <Card title="Vendas do Ano" subtitle={yearSales !== null ? yearSales : 'Carregando...'} />
        </div>
      </Slider>
    </div>
  );
};

export default SalesCard;
