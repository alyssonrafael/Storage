import Slider from 'react-slick'; // Importa o componente Slider da biblioteca react-slick
import "slick-carousel/slick/slick.css"; // Importa o CSS padrão para o carrossel
import "slick-carousel/slick/slick-theme.css"; // Importa o CSS para o tema do carrossel

// Importa os gráficos que serão exibidos no carrossel
import GraphicSalesOfCategory from './GraphicSalesOfCategory';
import GraphicSalesPerMonth from './GraphicSalesPerMonth';
import GraphicSalesByPaymentMethod from './GraphicPaymentMethod';

const GraphicCarousel = () => {
    // Configurações para o carrossel
    const settings = {
        dots: true, // Exibe indicadores (pontos) na parte inferior do carrossel
        infinite: true, // Permite rolar infinitamente pelo carrossel
        slidesToShow: 1, // Número de slides a serem exibidos por vez
        slidesToScroll: 1, // Número de slides a serem rolados de cada vez
        autoplay: true, // Ativa a rotação automática dos slides
        autoplaySpeed: 5000, // Tempo (em milissegundos) entre mudanças automáticas de slides
        pauseOnHover: true, // Pausa a rotação automática quando o usuário passa o mouse sobre o carrossel
        arrows: false // Desativa as setas de navegação
    };

    return (
        <Slider {...settings}>
            {/* Cada div dentro do Slider representa um slide */}
            <div>
                <GraphicSalesOfCategory /> {/* Primeiro gráfico no carrossel */}
            </div>
            <div>
                <GraphicSalesPerMonth /> {/* Segundo gráfico no carrossel */}
            </div>
            <div>
                <GraphicSalesByPaymentMethod /> {/* Terceiro gráfico no carrossel */}
            </div>
        </Slider>
    );
};

export default GraphicCarousel;
