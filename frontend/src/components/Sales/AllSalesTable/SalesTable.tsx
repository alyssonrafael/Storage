import React from "react";
import { Sale, Product } from "../../utils/types";
import SalesTableRow from "./SalesTableRow";

// interface com as props que o componente recebe
interface SalesTableProps {
  salesData: Sale[];
  products: Product[];
  onShowDetails: (sale: Sale) => void;
  onDeleteSale: (saleId: number) => void;
}

// componente funcional da tabela 
const SalesTable: React.FC<SalesTableProps> = ({
  salesData,
  products,
  onShowDetails,
  onDeleteSale,
}) => {
  // retorno da tabela
  return (
    <table className="min-w-full rounded-lg shadow-md mb-8">
      <thead className="bg-white sticky top-0 md:top-7 text-xs md:text-sm lg:text-base">
        <tr>
          <th className="py-2 px-4">Cod. Venda</th>
          <th className="py-2 px-4">Tipo de PAG</th>
          <th className="py-2 px-4">Qnt. Itens</th>
          <th className="py-2 px-4">Valor da venda</th>
          <th className="py-2 px-4">Ações</th>
        </tr>
      </thead>
      {/* faz um map e passa as props para o componente que monta as linha da tebela como os dados de cada venda*/}
      <tbody className="text-gray-700 text-center">
        {salesData.map((sale) => (
          <SalesTableRow
            key={sale.id}
            sale={sale}
            products={products}
            onShowDetails={onShowDetails}
            onDeleteSale={onDeleteSale}
          />
        ))}
      </tbody>
    </table>
  );
};

export default SalesTable;
