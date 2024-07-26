import { useState, useEffect } from "react";
import api from "../../api"

const HomeInfo = () => {

    const [vendasHoje, setVendasHoje] = useState(null); //estado para vendasdodia
    const [vendasMes, setVendasMes] = useState(null); //estados para vendas domes

    useEffect(() => {
        const fetchVendasHoje = async () => {
          try {
            const response = await api.get("/relatorios/vendas-dia"); 
            setVendasHoje(response.data.vendasDoDia); 
          } catch (error) {
            console.error("Erro ao buscar vendas hoje:", error);
          }
        };
    
        const fetchVendasMes = async () => {
          try {
            const response = await api.get("/relatorios/vendas-mes"); 
            setVendasMes(response.data.vendasDoMes); 
          } catch (error) {
            console.error("Erro ao buscar vendas do mês:", error);
          }
        };
    
        // Chama as funções de busca ao montar o componente
        fetchVendasHoje();
        fetchVendasMes();
      }, []); // O array vazio [] faz com que o useEffect seja executado apenas uma vez, ao montar o componente

  return (
    /* propriedades para responsividade do grid (sem prefixo e para telas pequenas md:para telas medias
     lg:para desktop se uma propriedade nao tiver outra que a anule ela permanece em todos os tipos)*/
    <div className="lg:p-4 space-y-4 lg:space-y-6">
        <div className="bg-blaze-orange-500 text-white flex justify-center items-center rounded-2xl  shadow-md
         lg:flex-col
         md:text-2xl md:space-x-4 md:p-4
         text-base flex-col p-2 text-center
         ">
            <h1>Vendas hoje:</h1>
            <h2 className="md:text-4xl font-semibold">{vendasHoje !== null ? vendasHoje : "Carregando..."}</h2>
        </div>
        <div className="bg-blaze-orange-500 text-white flex justify-center items-center rounded-2xl  shadow-md
         lg:flex-col
         md:text-2xl md:space-x-4 md:p-4
         text-base flex-col p-2 text-center
         ">
            <h1>Vendas Mês:</h1>
            <h2 className="md:text-4xl font-semibold">{vendasMes !== null ? vendasMes : "Carregando..."}</h2>
        </div>
    </div>
  )
}

export default HomeInfo