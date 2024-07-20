import TableAllSales from "../components/Sales/AllSalesTable/TableAllSales";

function Sales() {
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
        <h1 className="text-xl md:text-3xl mb-2">Produtos e categorias</h1>
      </div>
      {/* Seção da venda propramente dita (placeholder)*/}
      <div className="col-span-5 shadow-2xl rounded-2xl text-center">
        <h1>vendas</h1>
      </div>
    {/* seção da tabela de todas as vendas */}
      <div className="col-span-5 shadow-2xl h-[70vh] overflow-y-auto rounded-2xl mr-2">
      <TableAllSales/>
      </div>
      
    </div>
  );
}

export default Sales;
