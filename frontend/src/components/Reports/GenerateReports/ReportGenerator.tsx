import { useState } from "react";
import { saveAs } from "file-saver";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import api from "../../../api";

const ReportGenerator = () => {
  // Estados para armazenar os valores dos inputs
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formaDePagamento, setFormaDePagamento] = useState<string | undefined>("");

  // Função para gerar o relatório
  const handleGenerateReport = async () => {
    try {
      // Faz uma requisição GET para gerar o relatório de vendas
      const response = await api.get(
        "/relatorios/vendas",
        {
          params: {
            startDate, // Data inicial do relatório
            endDate, // Data final do relatório
            formaDePagamento, // Forma de pagamento selecionada
            formato: "excel", // Sempre em formato Excel
          },
          responseType: "blob", // Define o tipo de resposta como blob para lidar com arquivos
        }
      );

      // Cria um objeto Blob com o tipo correto
      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Usa file-saver para salvar o arquivo
      saveAs(file, "relatorio-vendas.xlsx");
    } catch (error) {
      console.error("Erro ao gerar o relatório:", error); // Exibe erro no console caso ocorra
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-blaze-orange-500">Gerar Relatório de Vendas</h1>
      <div className="flex space-x-2">
        {/* Campo de data inicial */}
        <div className="mb-4 w-1/3">
          <label className="block mb-2">Data Inicial:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 w-full border text-xs md:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white"
          />
        </div>

        {/* Campo de data final */}
        <div className="mb-4 w-1/3">
          <label className="block mb-2">Data Final:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 w-full border text-xs md:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white"
          />
        </div>

        {/* Campo de forma de pagamento */}
        <div className="mb-4 w-1/3">
          <label className="block mb-2">Forma de Pagamento:</label>
          <select
            value={formaDePagamento}
            onChange={(e) => setFormaDePagamento(e.target.value)}
            className="p-2 w-full border text-xs md:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white "
          >
            <option value="">Todos</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartão de débito">Cartão de Débito</option>
            <option value="cartão de crédito">Cartão de Crédito</option>
            <option value="pix">Pix</option>
            <option value="outro">Outro</option>
          </select>
        </div>
      </div>

      {/* Botão para gerar o relatório */}
      <button
        onClick={handleGenerateReport}
        className="bg-blaze-orange-500 text-white py-2 px-4 rounded-xl flex justify-center items-center space-x-4"
      >
        <BsFileEarmarkBarGraph className="text-2xl" />
        <p>Gerar Relatório</p>
      </button>
    </div>
  );
};

export default ReportGenerator;
