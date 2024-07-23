import { useState } from "react";
import TableAllSales from "../components/Sales/AllSalesTable/TableAllSales";
import CreateSale from "../components/Sales/NewSale/CreateSale";

const Sales = () => {
  const [salesChange, setSalesChange] = useState(false);

  // Função para lidar com a mudança de e categorias, usado nos useefect para que os componetes sejam atualizados quando o onProductChange muda para mander a consistencia de dados das 3 seçoes
  const handleSalesChange = () => {
    setSalesChange(!salesChange);
  };

  return (
    <div
      className="
    grid lg:grid-cols-10 lg:gap-2
    md:gap-7
    grid-cols-5 gap-3
    "
    >
      {/* Seção do título */}
      <div className="col-span-5 lg:col-span-10 mb-4">
        <h1 className="text-xl md:text-3xl mb-2">Página de vendas</h1>
      </div>
      {/* Seção da venda */}
      <div className="col-span-5 shadow-2xl rounded-2xl text-center px-6">
        <CreateSale onSalesChange={handleSalesChange} />
      </div>
      {/* seção da tabela de todas as vendas */}
      <div className="col-span-5 shadow-2xl h-[74vh] overflow-y-auto rounded-2xl mr-2">
        <TableAllSales onSalesChange={handleSalesChange} />
      </div>
    </div>
  );
};

export default Sales;
