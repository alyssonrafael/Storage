import React from "react";

//interface do modal que recebe as funçoes de confirmar e cancelar
interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

//componente funcional do modal de excluçao de venda
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  //retorno com as mensagens de aviso e botoes para cancelar ou confirmar
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg max-w-96 mx-4">
        <h2 className="text-2xl font-bold mb-4">Confirmar Exclusão</h2>
        <p>
        <strong>
            Tem certeza que deseja deletar permanentemente essa venda?
          </strong>{" "}
          <br />
          Essa ação{" "}
          <strong className="text-blaze-orange-500">afetará o estoque</strong>{" "}
          com a devolução dos itens <br />
          Essa ação{" "}
          <strong className="text-blaze-orange-500">afetará os relatórios</strong>{" "}
          com a não inclusão dessa venda
        </p>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded mr-2"
          onClick={onConfirm} //recebe a props de confirmaçao
        >
          Confirmar
        </button>
        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
          onClick={onCancel} //recebe a props de cancelar
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
