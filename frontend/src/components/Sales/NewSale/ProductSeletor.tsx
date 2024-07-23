// components/ProductSelector.tsx
import React from "react";
import { Product } from "../../utils/types";

// Define os tipos de propriedades esperadas pelo componente
interface ProductSelectorProps {
  products: Product[]; // Lista de produtos disponíveis para seleção
  selectedProduct: Product | null; // Produto atualmente selecionado
  setSelectedProduct: (product: Product | null) => void; // Função para definir o produto selecionado
}

// Componente funcional para seleção de produtos
const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProduct,
  setSelectedProduct,
}) => (
  <div className="text-left space-y-2">
    {/* Rótulo para o campo de seleção de produtos */}
    <label className="text-sm block">Produto</label>
    <select
      value={selectedProduct?.id || ""} // Define o valor do select como o ID do produto selecionado ou uma string vazia
      onChange={(e) =>
        setSelectedProduct(
          products.find((product) => product.id === parseInt(e.target.value)) ||
            null
        )
      } // Atualiza o produto selecionado com base na seleção do usuário
      className="border border-black/20 rounded-lg h-8 lg:text-xs" // Estilos aplicados ao campo de seleção
    >
      <option value="" disabled>
        {" "}
        {/* Opção inicial desativada e vazia */}
        Selecione um produto
      </option>
      {products
        .filter(
          (product) =>
            product.quantidade > 0 && !product.deleted && product.disponivel
        ) // Filtra os produtos disponíveis para exibição
        .map((product) => (
          <option key={product.id} value={product.id}>
            {product.nome} {/* Nome do produto exibido no dropdown */}
          </option>
        ))}
    </select>
  </div>
);

export default ProductSelector;
