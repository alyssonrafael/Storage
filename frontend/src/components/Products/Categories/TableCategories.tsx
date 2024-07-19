import { useState, useEffect } from "react";
import axios from "axios";
import { Categoria } from "../../utils/types";
import { FaPen, FaCheck, FaX, FaTrash } from "react-icons/fa6";
import MensagemCard from "../../MessageCard";

// componente funcional da tabela de categorias disponiveis
const TableCategories: React.FC<{ onProductChange: () => void }> = ({
  onProductChange,
}) => {
  //estado que vai salvar as categorias deletadas
  const [categories, setCategories] = useState<Categoria[]>([]);
  //estado para carregamento dos dados da tabela
  const [loading, setLoading] = useState(true);
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
        const response = await axios.get(
          "http://localhost:3333/api/categorias"
        );
        // Filtra categorias com deleted: false
        const filteredCategories = response.data.filter(
          (category: Categoria) => !category.deleted
        );
        setCategories(filteredCategories);
      } catch (err) {
        console.log("Erro ao buscar categorias", err);
      } finally {
        setLoading(false);
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
    // Tenta atualizar a categoria na API com o novo nome
    try {
      await axios.put(`http://localhost:3333/api/categoria/${id}`, {
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
  //funçao para marcar a categoria como deletada
  const handleDeleteClick = async (id: number) => {
    // Redefina a mensagem
    setMensagem({ sucesso: false, texto: "" });
    // Incrementa o contador de mensagens forçando ela a aparecer
    setMensagemCount(mensagemCount + 1);
    try {
      // Verificar se a categoria tem produtos associados
      const response = await axios.get(
        `http://localhost:3333/api/categorias/${id}/produtos`
      );
      //se tiver mensagem de erro
      if (response.data.hasProducts > 0) {
        setMensagem({
          sucesso: false,
          texto: "categoria tem produtos associados nao pode ser excluida",
        });
        return;
      }

      // tenta fazer requisicao para rota que muda o deleted da categoria para true
      await axios.put(`http://localhost:3333/api/delete-categoria/${id}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
      //se tiver sucesso mensagem de sucesso
      setMensagem({ sucesso: true, texto: "categoria deletada com sucesso" });
      onProductChange(); //chama o onProductChange para manter a consistencia nos outros componentes
    } catch (err) {
      // tratamneto de erro
      setMensagem({ sucesso: false, texto: "Erro ao deletar a categoria" });
      console.log("Erro ao deletar categoria", err);
    }
  };

  if (loading)
    return (
      <p className="text-center text-2xl text-blaze-orange-500">
        Carregando...
      </p>
    ); //se os dados ainda nao estiverem prontos exibe o loading

  // return da tabela de categorias disponiveis
  return (
    <>
      {/* titulo */}
      <h1 className="text-xl text-green-500">Tabela de disponiveis</h1>
      <table className="min-w-full">
        {/* heder da tabela */}
        <thead className="bg-white sticky top-0 text-xs md:text-sm lg:text-base ">
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
              {/* coluna com as funçoes de ediçao e delete da categoria */}
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
                      <FaTrash
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteClick(category.id)}
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

export default TableCategories;
