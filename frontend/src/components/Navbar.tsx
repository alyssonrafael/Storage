import { Link } from "react-router-dom";// Importa funçao para navegação dinâmica
import {
  FaHouse,
  FaBox,
  FaCartShopping,
  FaChartSimple,
  FaCircleQuestion,
} from "react-icons/fa6"; // Importa ícones do react-icons/fa6
import { FaTimes, FaUserShield  } from "react-icons/fa"; // Importa ícone do react-icons/fa
import UserMenu from "./UserMenu"; //inportaçao do user menu

// Interface das props passadas para o componente Navbar
interface NavbarProps {
    isMenuOpen: boolean
    toggleMenu: () => void
    user: string;
}

// Componente funcional da Navbar recebe duas props uma para gerenciar se o menu esta aberto e outra que muda o estado do menu
const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, toggleMenu, user }) => {
  return (

    <div className="flex-col h-full py-10 bg-blaze-orange-500 shadow lg:min-w-44 ">
      <div className=" grid grid-row-4 h-full">
        {/* div com o titulo */}
        <div className="flex items-center justify-center space-x-4 pb-4 row-span-1">
          <img src="/Storage.svg" alt="storage logo" className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-white">Storage</h2>
        </div>
        {/* divisor */}
        <hr /> 
        {/* div com a lista de links para as paginas */}
        <div className="flex justify-center row-span-2 ">
          <ul className="pt-2 pb-4 space-y-6 text-2xl">
            <li className="rounded-sm">
              <Link
                to="/home"
                className="flex items-center p-2 space-x-3 text-white hover:translate-x-2 duration-300"
                onClick={toggleMenu}
              >
                <FaHouse className="w-8 h-8 text-gray-700" />
                <span>Home</span>
              </Link>
            </li>
            <li className="rounded-sm">
              <Link
                to="/products"
                className="flex items-center p-2 space-x-3 text-white hover:translate-x-2 duration-300"
                onClick={toggleMenu}
              >
                <FaBox className="w-8 h-8 text-gray-700" />
                <span>Produtos</span>
              </Link>
            </li>
            <li className="rounded-sm">
              <Link
                to="/sales"
                className="flex items-center p-2 space-x-3 text-white hover:translate-x-2 duration-300"
                onClick={toggleMenu}
              >
                <FaCartShopping className="w-8 h-8 text-gray-700" />
                <span>Vendas</span>
              </Link>
            </li>
            {user === 'ADMIN' && (
              <li className="rounded-sm">
                <Link
                  to="/reports"
                  className="flex items-center p-2 space-x-3 text-white hover:translate-x-2 duration-300"
                  onClick={toggleMenu}
                >
                  <FaChartSimple className="w-8 h-8 text-gray-700" />
                  <span>Relatórios</span>
                </Link>
              </li>
            )}
            {user === 'ADMIN' && (
              <li className="rounded-sm">
                <Link
                  to="/userManagement"
                  className="flex items-center p-2 space-x-3 text-white hover:translate-x-2 duration-300"
                  onClick={toggleMenu}
                >
                  <FaUserShield className="w-8 h-8 text-gray-700" />
                  <span>Usuários</span>
                </Link>
              </li>
            )}
            <li className="rounded-sm">
              <Link
                to="/about"
                className="flex items-center p-2 space-x-3 text-white hover:translate-x-2 duration-300"
                onClick={toggleMenu}
              >
                <FaCircleQuestion className="w-8 h-8 text-gray-700" />
                <span>Sobre</span>
              </Link>
            </li>
          </ul>
        </div>
        {/* divisor */}
        <hr />
        {/* div com o menu do usuario */}
        <div className="row-span-1">
          <UserMenu toggleMenuNav={toggleMenu} />
        </div>
        {/* exibiçao condicional usando a condiçao que se a props isMenuOpen for verdadeira ela e exibida*/}
        {isMenuOpen && (
          <div className="absolute top-4 right-4">
            <FaTimes
              className="text-white text-2xl cursor-pointer"
              onClick={toggleMenu} //recdebe a props para gerenciar a abertura e fechamento da navbar
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
