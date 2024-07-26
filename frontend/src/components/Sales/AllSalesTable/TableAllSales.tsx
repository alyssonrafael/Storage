import React, { useState, useEffect } from "react";
import SalesTable from "./SalesTable"; // Importa o componente para exibir a tabela de vendas
import SaleDetailsModal from "./SaleDetailsModal"; // Importa o componente para exibir os detalhes da venda
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Importa o componente para confirmar exclusão
import MensagemCard from "../../MessageCard"; // Importa o componente para exibir mensagens de sucesso ou erro
import { SalesData, Sale, Product } from "../../utils/types"; // Importa os tipos para os dados de vendas e produtos
import api from "../../../api";

// Componente principal que exibe todas as vendas e lida com ações como visualizar detalhes e deletar vendas
const TableAllSales: React.FC<{ onSalesChange: () => void }> = ({
  onSalesChange,
}) => {
  
  // Estados para armazenar dados e controlar a interface
  const [salesData, setSalesData] = useState<SalesData>([]); // Armazena os dados das vendas
  const [loading, setLoading] = useState<boolean>(true); // Controla o estado de carregamento
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null); // Armazena a venda selecionada para detalhes
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false); // Controla a visibilidade do modal de detalhes
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); // Controla a visibilidade do modal de confirmação de exclusão
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null); // Armazena o ID da venda a ser deletada
  const [products, setProducts] = useState<Product[]>([]); // Armazena os dados dos produtos
  const [mensagem, setMensagem] = useState({ sucesso: false, texto: "" }); // Armazena a mensagem de sucesso ou erro
  const [mensagemCount, setMensagemCount] = useState(0); // Contador para forçar a atualização do componente de mensagem

  useEffect(() => {
    // Função para buscar os dados das vendas
    const fetchSalesData = async () => {
      try {
        const response = await api.get<SalesData>("/vendas");
        setSalesData(response.data); // Atualiza o estado com os dados das vendas
        setLoading(false); // Define o estado de carregamento como falso após receber os dados
      } catch (error) {
        console.error("Erro ao buscar dados:", error); // Loga qualquer erro ocorrido
        setLoading(false); // Define o estado de carregamento como falso em caso de erro
      }
    };

    // Função para buscar os dados dos produtos
    const fetchProductsData = async () => {
      try {
        const response = await api.get<Product[]>("/produtos");
        setProducts(response.data); // Atualiza o estado com os dados dos produtos
      } catch (error) {
        console.error("Erro ao buscar dados dos produtos:", error); // Loga qualquer erro ocorrido
      }
    };

    fetchSalesData(); // Chama a função para buscar os dados das vendas
    fetchProductsData(); // Chama a função para buscar os dados dos produtos
  }, [onSalesChange]);

  // Função para mostrar o modal com detalhes da venda
  const handleShowDetails = (sale: Sale) => {
    setSelectedSale(sale); // Define a venda selecionada
    setShowDetailsModal(true); // Mostra o modal de detalhes
  };

  // Função para iniciar o processo de exclusão da venda
  const handleDeleteSale = (saleId: number) => {
    setSaleToDelete(saleId); // Define a venda a ser deletada
    setShowDeleteModal(true); // Mostra o modal de confirmação de exclusão
  };

  // Função para confirmar a exclusão da venda
  const confirmDeleteSale = async () => {
    // Redefine a mensagem antes da exclusão
    setMensagem({ sucesso: false, texto: "" });
    // Incrementa o contador de mensagens para forçar a atualização do componente MensagemCard
    setMensagemCount(mensagemCount + 1);

    if (saleToDelete !== null) {
      try {
        await api.delete(`/venda/${saleToDelete}`);
        setSalesData(salesData.filter((sale) => sale.id !== saleToDelete)); // Atualiza a lista de vendas removendo a venda excluída
        setShowDeleteModal(false); // Fecha o modal de confirmação de exclusão
        setMensagem({ sucesso: true, texto: "Venda excluída com sucesso" }); // Define a mensagem de sucesso
        onSalesChange()
      } catch (error) {
        console.error("Erro ao deletar venda:", error); // Loga qualquer erro ocorrido
        setMensagem({ sucesso: false, texto: "Erro ao excluir venda" }); // Define a mensagem de erro
      }
    }
  };

  // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <h1 className="text-2xl text-blaze-orange-500 font-medium">Carregando...</h1>
      </div>
    );
  }

  return (
    <div className="py-3 px-5 rounded-2xl">
      <h2 className="text-xl md:sticky md:top-0 z-10 bg-white text-blaze-orange-500 font-medium mb-6">
        Todas as vendas
      </h2>
      <SalesTable
        salesData={salesData}
        products={products}
        onShowDetails={handleShowDetails}
        onDeleteSale={handleDeleteSale}
      />

      {showDetailsModal && selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          products={products}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={confirmDeleteSale}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      
      <MensagemCard
        sucesso={mensagem.sucesso}
        mensagem={mensagem.texto}
        key={mensagemCount} // Chave para forçar a atualização do componente MensagemCard
      />
    </div>
  );
};

export default TableAllSales;
