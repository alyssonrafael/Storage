import GraphicCarousel from "../components/Reports/GraphicCarousel";

function Reports() {
  return (
    <div
      className="
    grid lg:grid-cols-10 lg:gap-2
    md:gap-7
    grid-cols-5 gap-3
    "
    >
      <div className="col-span-5 lg:col-span-10 mb-4">
        <h1 className="text-xl md:text-3xl mb-2">Relatorios e Dashboard</h1>
      </div>
      {/* Seção para gerar ralatorios (placeholder)*/}
      <div className="col-span-5 lg:col-span-5">
        gerar
      </div>
    {/* seção com o carrousel com os graficos */}
      <div className="col-span-5 lg:mr-2 p-6 rounded-lg shadow-2xl ">
        <GraphicCarousel/>
      </div>
     {/* cadrs de informaçao (placeholder) */}
      <div className=" col-span-5 lg:col-span-10 lg:mr-2 ">
        cards
      </div>
    </div>
  );
}

export default Reports;
