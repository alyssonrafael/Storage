import {
  FaCircleChevronUp,
  FaUser,
  FaPen,
  FaArrowRightToBracket,
} from "react-icons/fa6"; // Importa ícones do react-icons/fa6
import { decodeToken } from "./utils/tokenUtils"; // Importa a função para decodificar o token
import axios from "axios"; // Importa Axios para fazer requisições HTTP
import { useState, useEffect, useRef } from "react"; // Importa hooks do React
import { useNavigate, Link } from "react-router-dom"; // Importa funções para navegação dinâmica

// Interface do usuário
interface User {
  name: string;
  role: string;
}

// Interface das props passadas para o componente UserMenu
interface UserMenuProps {
  toggleMenuNav: () => void; // Função para alternar o estado do menu de navegação
}

// Componente funcional do menu do usuário localizado na barra de navegação
const UserMenu: React.FC<UserMenuProps> = ({ toggleMenuNav }) => {
  const [user, setUser] = useState<User | null>(null); // Estado do usuário
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado do menu
  const navigate = useNavigate(); // Hook para navegação
  const menuRef = useRef<HTMLDivElement>(null); // Referência para o menu

  // Efeito para buscar o usuário quando o componente é montado
  useEffect(() => {
    const token = localStorage.getItem("token"); // Obtém o token do localStorage
    if (token) {
      const decoded = decodeToken(token); // Decodifica o token
      if (decoded) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Configura o cabeçalho da requisição com o token
          },
        };
        axios
          .get(`http://localhost:3333/api/user/${decoded.userId}`, config) // Faz a requisição para obter os dados do usuário
          .then((response) => {
            const { name, role } = response.data;
            setUser({ name, role }); // Define o estado do usuário
          })
          .catch((error) => console.error("Erro ao buscar usuário:", error)); // Trata erros na requisição
      }
    }
  }, [user]); //monitorarndo o user para quando atualizar o nome ele tambem ser atualizado

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token do localStorage
    navigate("/"); // Navega para a página inicial
  };

  // Função para alternar o estado do menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para fechar o menu quando clicado fora dele
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  // Efeito para adicionar/remover o evento de clique fora do menu
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative pt-4" ref={menuRef}>
      <div className="flex justify-center items-center space-x-4 text-white">
        <FaUser className="w-6 h-6 text-gray-700" /> {/* Ícone do usuário */}
        <div className="flex flex-col justify-center items-center">
          <p>{user?.name}</p> {/* Nome do usuário */}
          <p>({user?.role})</p> {/* Papel do usuário */}
        </div>
        <FaCircleChevronUp
          className={`w-6 h-6 text-gray-700 cursor-pointer ${
            isMenuOpen ? "transform rotate-180" : ""
          }`}
          onClick={toggleMenu} // Alterna o menu
        />
      </div>
      {isMenuOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border rounded-md shadow-lg z-50">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer lg:hidden">
              <Link
                to="/accountediting" // Navega para a edição de conta
                className="flex items-center space-x-4"
                onClick={toggleMenuNav} //a props que e passada faz com que a navbar se feche em telas medias e pequenas
              >
                <p>
                  <FaPen />
                </p>
                <p>Editar Usuário</p>
              </Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer lg:block hidden">
              <Link
                to="/accountediting"
                className="flex items-center space-x-4"
              >
                <p>
                  <FaPen />
                </p>
                <p>Editar Usuário</p>
              </Link>
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center space-x-4"
              onClick={handleLogout} // Faz logout
            >
              <p>
                <FaArrowRightToBracket />
              </p>
              <p>Logout</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
