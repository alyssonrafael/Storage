// components/QuantityInput.tsx
import React from "react";

// Define os tipos de propriedades esperadas pelo componente
interface QuantityInputProps {
  quantity: number; // Quantidade atual que será exibida e editada
  setQuantity: (quantity: number) => void; // Função para atualizar a quantidade
}

// Componente funcional para entrada de quantidade
const QuantityInput: React.FC<QuantityInputProps> = ({
  quantity,
  setQuantity,
}) => (
  <div className="space-y-2 max-h-min ">
    {/* Rótulo para o campo de entrada de quantidade */}
    <label className="text-sm block">Quantidade</label>
    <input
      type="number" // Tipo de input para aceitar apenas números
      value={quantity} // Define o valor atual do input como a quantidade fornecida
      onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} // Atualiza a quantidade com base na entrada do usuário. Usa 1 como valor padrão se o valor for NaN ou vazio.
      min="1" // Define o valor mínimo permitido como 1
      className="border border-black/20 rounded-lg text-center w-14 h-8" // Estilos aplicados ao campo de entrada
    />
  </div>
);

export default QuantityInput;
