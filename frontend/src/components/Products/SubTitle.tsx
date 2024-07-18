import { useState, useEffect } from "react";
import axios from "axios";

// Componente funcional que exibe o número de produtos cadastrados e disponíveis
const SubTitle: React.FC<{ productChange: boolean }> = ({ productChange }) => {
  const [productCount, setProductCount] = useState(0); // Estado para armazenar o número de produtos

  // Efeito para buscar o número de produtos ao montar o componente ou quando productChange muda
  useEffect(() => {
    // Função assíncrona para buscar o número de produto
    const fetchProductCount = async () => {
      try {
        // Requisição GET para o endpoint que retorna o número de produtos
        const response = await axios.get(
          "http://localhost:3333/api/produtos/count"
        );
        setProductCount(response.data.totalProdutos); // Define o número de produtos no estado
      } catch (error) {
        console.error("Erro ao buscar número de produtos:", error);
      }
    };

    fetchProductCount();
  }, [productChange]);

  return (
    <>
    {/* Exibe o número de produtos cadastrados disponíveis */}
      <p className="md:text-lg">
        atualmente há{" "}
        <small className="text-blaze-orange-500 font-semibold text-sm md:text-base lg:text-xl ">
          {productCount}
        </small>{" "}
        produtos cadastrados e disponiveis
      </p>
    </>
  );
};

export default SubTitle;
