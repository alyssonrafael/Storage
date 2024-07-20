import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Sale, Product } from "../../utils/types";
import { FaEye, FaTrash } from "react-icons/fa6";
import { FiPrinter } from "react-icons/fi";
import AllSalesPDF from "../../PDFs/AllSalesPDF";

//interfface com as props do componente
interface SalesTableRowProps {
  sale: Sale;
  products: Product[];
  onShowDetails: (sale: Sale) => void;
  onDeleteSale: (saleId: number) => void;
}
//componete funcionall das linhas da tabela 
const SalesTableRow: React.FC<SalesTableRowProps> = ({
  sale,
  products,
  onShowDetails,
  onDeleteSale,
}) => {
  // retona o padrao da linha que as vendas vao ter
  return (
    <tr>
      <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
        {sale.id}
      </td>
      <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
        {sale.formaDePagamento}
      </td>
      <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
        {sale.produtos.length}
      </td>
      <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
        R${sale.total.toFixed(2)}
      </td>
      <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
        {/* açoes que cada venda tera */}
        <div className="flex space-x-4">
          <button>
            <FaEye
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => onShowDetails(sale)} //chama a funçao para exibir o modal de detalhes
            />
          </button>
          {/* faz o dowload dos detalhes da venda */}
          <button>
            <PDFDownloadLink
              document={<AllSalesPDF sale={sale} products={products} />}
              fileName={`Venda_${sale.id}.pdf`}
            >
              {({ loading }) => (loading ? "..." : <FiPrinter />)}
            </PDFDownloadLink> 
          </button>
          <button>
            <FaTrash
              className="text-red-500 hover:underline"
              onClick={() => onDeleteSale(sale.id)} //chama a funçao para exibir o modal de exclusao
            />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SalesTableRow;
