import Slider from 'react-slick'; // Importa o componente Slider do pacote react-slick para criar um carrossel
import "slick-carousel/slick/slick.css"; // Importa o estilo padrão do carrossel
import "slick-carousel/slick/slick-theme.css"; // Importa o tema padrão do carrossel
import Card from './Card'; // Importa o componente Card que será usado no carrossel
import { useEffect, useState } from 'react'; // Importa useEffect e useState do React
import api from '../../api';

// Componente principal TopCategoryCard
const TopCategoryCard = () => {
  // Estado para armazenar os valores das categorias
  const [topDayCategoryData, setTopDayCategoryData] = useState<string>("Ainda não há"); // Estado para armazenar a categoria top do dia
  const [topMonthCategoryData, setTopMonthCategoryData] = useState<string>("Ainda não há"); // Estado para armazenar a categoria top do mês
  const [topYearCategoryData, setTopYearCategoryData] = useState<string>("Ainda não há"); // Estado para armazenar a categoria top do ano

  // Função para buscar os dados das categorias
  const fetchData = async () => {
    try {
      // Faz requisições para obter os dados das categorias top do dia, mês e ano
      const [dayResponse, monthResponse, yearResponse] = await Promise.all([
        api.get('/relatorios/categoria-top-dia'),
        api.get('/relatorios/categoria-top-mes'),
        api.get('/relatorios/categoria-top-ano')
      ]);

      // Define os estados com os dados obtidos
      setTopDayCategoryData(dayResponse.data.categoria);
      setTopMonthCategoryData(monthResponse.data.categoria);
      setTopYearCategoryData(yearResponse.data.categoria);
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
        <div className="flex justify-center"> {/* Slide para a categoria top do dia */}
          <Card title="Top categoria dia" subtitle={topDayCategoryData !== null ? topDayCategoryData : 'Carregando...'}/>
        </div>
        <div className="flex justify-center"> {/* Slide para a categoria top do mês */}
          <Card title="Top categoria mês" subtitle={topMonthCategoryData !== null ? topMonthCategoryData : 'Carregando...'}/>
        </div>
        <div className="flex justify-center"> {/* Slide para a categoria top do ano */}
          <Card title="Top categoria ano" subtitle={topYearCategoryData !== null ? topYearCategoryData : 'Carregando...'}/>
        </div>
      </Slider>
    </div>
  );
};

export default TopCategoryCard;
