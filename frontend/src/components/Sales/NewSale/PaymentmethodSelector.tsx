// components/PaymentMethodSelector.tsx
import React from "react";

// Define os tipos de propriedades esperadas pelo componente
interface PaymentMethodSelectorProps {
  paymentMethod: string; // Forma de pagamento selecionada
  setPaymentMethod: (method: string) => void; // Função chamada quando a forma de pagamento é alterada
}

// Componente funcional para seleção da forma de pagamento
const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  setPaymentMethod,
}) => (
  <div className="md:text-left">
    {/* Rótulo para o campo de seleção da forma de pagamento */}
    <label className="text-sm block">Forma de pagamento</label>
    <select
      value={paymentMethod} // Valor atual da forma de pagamento
      onChange={(e) => setPaymentMethod(e.target.value)} // Atualiza a forma de pagamento quando o usuário seleciona uma nova opção
      className="md:h-6 md:w-52 h-full w-full border border-black/20 rounded-lg p-2 md:p-0" // Estilos aplicados ao campo de seleção
    >
      <option value="dinheiro">Dinheiro</option>
      <option value="cartao/debito">Cartão de Débito</option>
      <option value="cartao/credito">Cartão de Crédito</option>
      <option value="pix">Pix</option>
      <option value="outro">Outro</option>
    </select>
  </div>
);

export default PaymentMethodSelector;
