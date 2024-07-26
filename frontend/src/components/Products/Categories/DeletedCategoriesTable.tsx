import { useState, useEffect } from "react";
import axios from "axios";
import { Categoria } from "../../utils/types";
import { FaPen, FaCheck, FaX, FaArrowUp } from "react-icons/fa6";
import MensagemCard from "../../MessageCard";
import api from "../../../api";

// componente funcional da tabela de categorias deletadas
const DeletedCategoriesTable: React.FC<{ onProductChange: () => void }> = ({
  onProductChange,
}) => {
  //estado que vai salvar as categorias deletadas
  const [categories, setCategories] = useState<Categoria[]>([]);
  //estado que vai pegar o id da categoria que esta sendo editada
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  //estadado do nome da categoria que esta sendo editada
  const [editName, setEditName] = useState<string>("");
  // estados para controle da mensagem de feedback
  const [mensagem, setMensagem] = useState({ sucesso: false, texto: "" });
  const [mensagemCount, setMensagemCount] = useState(0);

  //efeiro para carregar as categorias
  useEffect(() => {
    // Função para buscar categorias da API
    const fetchCategories = async () => {
      try {
        const response = await api.get(
          "/categorias"
        );
        // Filtra categorias com deleted: true
        const filteredCategories = response.data.filter(
          (category: Categoria) => category.deleted
        );
        setCategories(filteredCategories);
      } catch (err) {
        console.log("Erro ao buscar categorias", err);
      }
    };

    fetchCategories();
  }, [onProductChange]); //montado sempre que o onProductChange muda

  // funçao para abrir a ediçao da categoria
  const handleEditClick = (category: Categoria) => {
    setEditingCategoryId(category.id);
    setEditName(category.nome);
  };
  // funçao para salvar essa ediçao
  const handleSaveClick = async (id: number) => {
    // Redefina a mensagem
    setMensagem({ sucesso: false, texto: "" });
    // Incrementa o contador de mensagens forçando ela a aparecer
    setMensagemCount(mensagemCount + 1);
    //
    try {
      // Tenta atualizar a categoria na API com o novo nome
      await api.put(`/categoria/${id}`, {
        nome: editName,
      });
      // Atualiza o estado local com o novo nome da categoria atualizada
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id ? { ...category, nome: editName } : category
        )
      );
      // Define a mensagem de sucesso
      setMensagem({ sucesso: true, texto: "Categoria atualizada com sucesso" });
      // Redefine o ID da categoria em edição para null
      setEditingCategoryId(null);
    } catch (err) {
      // Verifica se o erro é do Axios e se o status da resposta é 409 (Conflito)
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setMensagem({
          sucesso: false,
          texto: "Conflito de nomes. Tente outro.",
        });
      } else {
        // Define mensagem genérica para outros erros
        setMensagem({ sucesso: false, texto: "Erro ao atualizar categoria" });
      }
    }
  };
  //funçao para fechar a ediçao
  const handleCancelClick = () => {
    setEditingCategoryId(null);
  };
  //funçao para restaurar a categoria para utilizaveis
  const handleRestoreClick = async (id: number) => {
    // Redefina a mensagem
    setMensagem({ sucesso: false, texto: "" });
    // Incrementa o contador de mensagens forçando ela a aparecer
    setMensagemCount(mensagemCount + 1);
    try {
      // tenta fazer requisicao para rota que muda o deleted da categoria para false
      await api.put(`/restore-categoria/${id}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
      //se tudo ocorrer bem mensagem de sucesso
      setMensagem({ sucesso: true, texto: "Categoria restaurada com sucesso" });
      onProductChange(); //chama o onProductChange para manter a consistencia nos outros componentes
    } catch (err) {
      // tratamento de erro
      setMensagem({ sucesso: false, texto: "Erro ao restaurar a categoria" });
      console.log("Erro ao restaurar categoria", err);
    }
  };
  // return da tabela de categorias deletadas
  return (
    <>
      {/* titulo */}
      <h1 className="text-red-500 my-4 text-xl">Tabela de deletados</h1>
      <table className="min-w-full">
        <thead className="bg-white sticky top-0 text-xs md:text-sm lg:text-base">
          {/* heder da tabela */}
          <tr>
            <th className="px-6 py-3 text-center font-semibold">ID</th>
            <th className="px-6 py-3 text-center font-semibold">Nome</th>
            <th className="px-6 py-3 text-center font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-center text-xs md:text-sm lg:text-base">
          {/* corpo da tabela realiza um map para que todas as categorias sejam exibidas */}
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
                {category.id}
              </td>
              <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
                {editingCategoryId === category.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  category.nome
                )}
              </td>
              {/* coluna com as funçoes de ediçao e restore da categoria */}
              <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300">
                {editingCategoryId === category.id ? (
                  <button className="cursor-default">
                    <div className="flex space-x-4">
                      <FaCheck
                        className="text-green-500 cursor-pointer"
                        onClick={() => handleSaveClick(category.id)}
                      />
                      <FaX
                        className="text-red-500 cursor-pointer"
                        onClick={handleCancelClick}
                      />
                    </div>
                  </button>
                ) : (
                  <button className="cursor-default">
                    <div className="flex space-x-4">
                      <FaPen
                        className="text-yellow-500 cursor-pointer"
                        onClick={() => handleEditClick(category)}
                      />
                      <FaArrowUp
                        className="text-green-500 cursor-pointer"
                        onClick={() => handleRestoreClick(category.id)}
                      />
                    </div>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* mensagem de feedback */}
      <MensagemCard
        sucesso={mensagem.sucesso}
        mensagem={mensagem.texto}
        key={mensagemCount}
      />
    </>
  );
};

export default DeletedCategoriesTable;
