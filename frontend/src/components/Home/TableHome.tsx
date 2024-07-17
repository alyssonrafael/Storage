import React, { useState, useEffect } from "react"; // Importa React e hooks de estado e efeito
import axios from "axios"; // Importa axios para fazer requisições HTTP
import { FiPrinter } from "react-icons/fi"; // Importa o ícone de impressora
import { PDFDownloadLink } from "@react-pdf/renderer"; // Importa o componente para gerar links de download de PDFs
import SalesPDF from "../PDFs/SalesPDF"; // Importa o componente PDF para gerar o relatório
import { SalesData } from "../utils/types"; // Importa o tipo SalesData

const TableHome: React.FC = () => {
  const [data, setData] = useState<SalesData>([]); // Estado para armazenar os dados das vendas
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o carregamento dos dados

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Faz a requisição para obter os dados das últimas vendas
        const response = await axios.get<SalesData>(
          "http://localhost:3333/api/ultimas-vendas"
        );
        setData(response.data); // Atualiza o estado com os dados recebidos
        setLoading(false); // Define o estado de carregamento como falso
      } catch (error) {
        console.error("Erro ao buscar dados:", error); // Loga qualquer erro que ocorra na requisição
        setLoading(false); // Define o estado de carregamento como falso em caso de erro
      }
    };

    fetchData(); // Chama a função para buscar os dados ao montar o componente
  }, []); // Array vazio [] faz com que o useEffect seja executado apenas uma vez, ao montar o componente

  // Exibe uma mensagem de carregando enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <h1 className="text-2xl text-blaze-orange-500 font-medium">
          Carregando...
        </h1>
      </div>
    );
  }

  return (
    <div className="py-3 px-5 rounded-2xl shadow-2xl">
      <h1 className="text-2xl text-blaze-orange-500 font-medium">
        Últimas vendas
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4">Cod. Venda</th>
              <th className="py-2 px-4">Tipo de PAG</th>
              <th className="py-2 px-4">Qnt. Itens</th>
              <th className="py-2 px-4">Valor da venda</th>
              <th className="py-2 px-4">Ação</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-center">
            {data.map((sale) => (
              <tr key={sale.id}>
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
                  <PDFDownloadLink
                    document={<SalesPDF data={sale} />} // Gera o documento PDF para download
                    fileName={`venda_${sale.id}.pdf`} // Define o nome do arquivo para download
                  >
                    {({ loading }) =>
                      loading ? "....." : <FiPrinter /> // Exibe o ícone de impressora ou "....." se estiver carregando
                    }
                  </PDFDownloadLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableHome; // Exporta o componente TableHome como padrão
