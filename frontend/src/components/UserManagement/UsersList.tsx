import { useState, useEffect } from "react";
import { User } from "../utils/types";
import MensagemCard from "../MessageCard";
import api from "../../api";

function UsersList() {
  // Estado para armazenar todos os usuários
  const [users, setUsers] = useState<User[]>([]);
  // Estado para armazenar os usuários filtrados
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  // Estado para controlar o carregamento dos dados
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState<string | null>(null);
  // Estado para armazenar mensagens de sucesso/erro
  const [mensagem, setMensagem] = useState({ sucesso: false, texto: "" });
  // Contador para renderizar o componente de mensagem corretamente
  const [mensagemCount, setMensagemCount] = useState(0);
  // Estado para armazenar o termo de busca
  const [searchTerm, setSearchTerm] = useState("");
  // useEffect para buscar os usuários ao carregar o componente
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token"); // Obtém o token do localStorage

      try {
        // Faz a requisição para buscar os usuários
        const response = await api.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho da requisição
          },
        });
        setUsers(response.data); // Armazena os usuários no estado
        setFilteredUsers(response.data); // Inicialmente, todos os usuários são exibidos
      } catch (err) {
        setError("Erro ao buscar usuários"); // Armazena a mensagem de erro no estado
      } finally {
        setLoading(false); // Define o estado de carregamento como falso
      }
    };

    fetchUsers();
  }, []);

  // useEffect para filtrar os usuários com base no termo de busca
  useEffect(() => {
    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filtra os usuários pelo nome
    );
    setFilteredUsers(results); // Atualiza o estado dos usuários filtrados
  }, [searchTerm, users]);

  // Função para lidar com a mudança de função do usuário
  const handleRoleChange = async (userId: string, newRole: string) => {
    const token = localStorage.getItem("token"); // Obtém o token do localStorage

    setMensagem({ sucesso: false, texto: "" });
    setMensagemCount(mensagemCount + 1);

    try {
      // Faz a requisição para atualizar a função do usuário
      await api.patch(
        `/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho da requisição
          },
        }
      );
      // Atualiza a função do usuário no estado
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setMensagem({ sucesso: true, texto: "Função do usuário alterada" }); // Define a mensagem de sucesso
    } catch (err) {
      console.error("Erro ao atualizar a role do usuário", err);
      setMensagem({
        sucesso: false,
        texto: "Erro ao alterar função do usuário",
      });
      setError("Erro ao atualizar a role do usuário"); // Define a mensagem de erro
    }
  };

  if (loading)
    return (
      <div>
        <h1 className="text-3xl text-blaze-orange-500 font-semibold">
          Carregando...{" "}
        </h1>{" "}
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="mx-auto h-[65vh] overflow-y-auto overflow-x-auto">
      <div className="mb-4">
        {/* Campo de busca por nome */}
        <input
          type="text"
          placeholder="Buscar por nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border text-xs md:text-base rounded p-2 focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white"
        />
      </div>
      <table className="min-w-full text-base">
        <thead>
          <tr className="bg-blaze-orange-500 border-b text-white sticky top-0 z-10">
            <th className="py-2 px-4 font-semibold">ID</th>
            <th className="py-2 px-4 font-semibold">Nome</th>
            <th className="py-2 px-4 font-semibold">Email</th>
            <th className="py-2 px-4 font-semibold">Função</th>
          </tr>
        </thead>
        <tbody className="text-center text-xs md:text-sm lg:text-base">
          {/* Exibe a lista de usuários filtrados */}
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="border-b-2 border-blaze-orange-300 py-2 px-4">
                {user.id}
              </td>
              <td className="border-b-2 border-blaze-orange-300 py-2 px-4">
                {user.name}
              </td>
              <td className="border-b-2 border-blaze-orange-300 py-2 px-4">
                {user.email}
              </td>
              <td className="border-b-2 border-blaze-orange-300 py-2 px-4">
                <select
                  value={user.role}
                  onChange={(e) => {
                    if (user.id) {
                      handleRoleChange(user.id, e.target.value);
                    }
                  }}
                  className="border text-xs md:text-base rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <MensagemCard
        sucesso={mensagem.sucesso}
        mensagem={mensagem.texto}
        key={mensagemCount}
      />
    </div>
  );
}

export default UsersList;
