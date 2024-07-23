// components/DiscountInput.tsx
import React from "react";

// Define os tipos de propriedades esperadas pelo componente
interface DiscountInputProps {
  discount: number; // Valor atual do desconto
  handleDiscountChange: (value: string) => void; // Função chamada quando o desconto é alterado
}

// Componente funcional para entrada de desconto
const DiscountInput: React.FC<DiscountInputProps> = ({
  discount,
  handleDiscountChange,
}) => (
  <div className="md:text-left">
    {/* Rótulo para o campo de entrada de desconto */}
    <label className="text-sm block">Desconto</label>
    <input
      type="number" // Tipo de entrada numérica
      value={discount === 0 ? "" : discount} // Mostra um valor vazio se o desconto for 0, caso contrário, mostra o valor do desconto
      onChange={(e) => handleDiscountChange(e.target.value)} // Chama a função de manipulação quando o valor muda
      min="0" // Define o valor mínimo permitido como 0
      step="0.01" // Define o incremento mínimo para o valor como 0.01
      className="md:h-6 md:w-52 h-full w-full border border-black/20 rounded-lg p-2" // Estilos aplicados ao campo de entrada
      placeholder="0.00" // Texto exibido quando o campo está vazio
    />
  </div>
);

export default DiscountInput;
