import GraphicCarousel from "../components/Reports/GraphicCarousel";
import ValueSalesCard from "../components/Reports/ValueSalesCard";
import TopCategoryCard from "../components/Reports/TopCategoryCard";
import SalesCard from "../components/Reports/SalesCard";
import ProductsReportGenerator from "../components/Reports/GenerateReports/ProductsReport";
import ReportGenerator from "../components/Reports/GenerateReports/ReportGenerator";

const Reports = () => {

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
      {/* Seção para gerar ralatorios*/}
      <div className="col-span-5 lg:col-span-5 p-2 rounded-lg shadow-2xl ">
        
      <ReportGenerator/>
      <hr className="border-2 border-dotted border-blaze-orange-500" />
       <ProductsReportGenerator/>
     
      </div>
    {/* seção com o carrousel com os graficos */}
      <div className="col-span-5 lg:mr-2 p-6 rounded-lg shadow-2xl ">
        <GraphicCarousel/>
      </div>
     {/* cadrs de informações */}
      <div className=" col-span-5 lg:col-span-10 lg:mr-2 lg:grid lg:grid-cols-3 lg:justify-center lg:items-center lg:space-x-4 space-y-6 lg:space-y-0 row-start-3 lg:row-auto">
      <SalesCard/>
      <ValueSalesCard/>
      <TopCategoryCard/>
      </div>
    </div>
  );
}

export default Reports;
