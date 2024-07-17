import { Link } from "react-router-dom";
import BannerHome from "../components/Home/BannerHome";
import BasicDateCalendar from "../components/Home/BasicDateCalendar";
import HomeInfo from "../components/Home/HomeInfo";
import TableHome from "../components/Home/TableHome";

function Home() {
  // dias da semana a serem exibidos
  const diasDaSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  const hoje = new Date(); //nova data
  const diaDaSemana = diasDaSemana[hoje.getDay()]; //pega o dia e coloca com o padrao do dia da semana do array

  return (
      /* propriedades para responsividade do grid (sem prefixo e para telas pequenas md:para telas medias
     lg:para desktop se uma propriedade nao tiver outra que a anule ela permanece em todos os tipos)*/
    <div className="grid
    lg:grid-cols-10 lg:auto-rows-min lg:gap-4 
    md:grid-cols-5 md:gap-5
    grid-cols-5 gap-3
    ">
      <div className="flex md:justify-between 
       lg:flex-row lg:col-span-9  
       md:flex-col md:col-span-2
       flex-col col-span-3 justify-around
       ">
        <div>
          <h1 className="text-3xl">Home</h1>
          <p>
            {diaDaSemana},{" "}
            <small className="text-blaze-orange-500 font-normal">
              {hoje.toLocaleDateString()}
            </small>
          </p>
        </div>

        {/* botao para ir para pagina de vendas*/}
        <div className="bg-blaze-orange-500 text-white font-normal text-xl flex items-center rounded-2xl justify-center my-2 md:p-4 p-2 lg:w-48 lg:h-12 md:h-16">
          <Link to={"/sales"} className="flex space-x-4">
            <p className="font-bold">+</p>
            <p>Nova venda</p>
          </Link>
        </div>
      </div>
      {/* componente do banner */}
      <BannerHome />
      {/* sessao do calendario */}
      <div className="md:col-span-3 md:row-span-2 col-span-5">
        <BasicDateCalendar />
      </div>
      {/* sessao da tabela*/}
      <div className="lg:col-span-6 lg:row-span-2 col-span-5 ">
        <TableHome />
      </div>
      {/* sessao das informaçoes de vendas */}
      <div className="lg:col-span-3 lg:col-start-7 lg:row-start-4 md:col-span-2 md:row-start-3 row-start-2 col-start-4 col-span-2">
        <HomeInfo />
      </div>
    </div>
  );
}

export default Home;
