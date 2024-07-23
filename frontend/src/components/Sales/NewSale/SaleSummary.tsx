// components/SaleSummary.tsx
import React from "react";

// Define os tipos de propriedades esperadas pelo componente
interface SaleSummaryProps {
  totalValue: number; // Valor total da venda, após aplicar descontos
  discount: number; // Valor total do desconto aplicado
  subtotal: number; // Valor subtotal antes da aplicação de descontos
}

// Componente funcional para exibir o resumo da venda
const SaleSummary: React.FC<SaleSummaryProps> = ({
  totalValue,
  discount,
  subtotal,
}) => (
  <div className="text-blaze-orange-500 text-sm">
    {/* Exibe o valor total da venda */}
    <p>
      Valor Total: <br />
      <label className="text-black">{totalValue.toFixed(2)}</label>
    </p>

    {/* Exibe o desconto aplicado */}
    <p>
      Desconto: <br />
      <label className="text-black">{discount.toFixed(2)}</label>
    </p>

    {/* Exibe o subtotal, visível apenas em telas médias e maiores */}
    <p className="md:hidden block">
      Subtotal: <br />
      <label className="text-black">{subtotal.toFixed(2)}</label>
    </p>
  </div>
);

export default SaleSummary;
