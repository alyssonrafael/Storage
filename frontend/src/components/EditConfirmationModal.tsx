import React from 'react';

// Define a interface para as propriedades do modal
interface ConfirmationModalProps {
  isOpen: boolean; // Indica se o modal está aberto ou fechado
  onClose: () => void; // Função chamada quando o modal deve ser fechado
  onConfirm: () => void; // Função chamada quando a confirmação é feita
  message: string; // Mensagem a ser exibida no modal
}

// Componente funcional para o modal de confirmação
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  // Se o modal não estiver aberto, retorna null para não renderizar nada
  if (!isOpen) return null;

  return (
    // Contêiner do modal, posicionado fixamente no centro da tela com um fundo semitransparente
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        {/* Título do modal */}
        <h3 className="text-lg font-semibold mb-4">Confirmação</h3>
        {/* Mensagem exibida no corpo do modal */}
        <p className="mb-4">{message}</p>
        {/* Contêiner para os botões de ação */}
        <div className="flex justify-end space-x-4">
          {/* Botão para cancelar a ação */}
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg"
          >
            Cancelar
          </button>
          {/* Botão para confirmar a ação */}
          <button
            onClick={onConfirm}
            className="bg-blaze-orange-500 text-white py-2 px-4 rounded-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
