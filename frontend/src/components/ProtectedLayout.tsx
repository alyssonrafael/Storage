import { useState } from "react"; // import para controle de estado
import { Outlet } from "react-router-dom"; //importando o outlet para identificar onde as rotas filhas seeram apresentadas
import Navbar from "./Navbar"; //componente navbar
import { FaBars } from "react-icons/fa"; //icone do react/fa
import logoImage from "/Storage.svg"; // Importa a imagem do logo
import { useMediaQuery } from "react-responsive"; // Importa o hook para media queries

const ProtectedLayout = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // Estado para controlar a visibilidade da navbar
  const isMobile = useMediaQuery({ maxWidth: 1023 }); // Define o ponto de corte para telas móveis

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen); // Alterna o estado da navbar
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false); // Fecha a navbar
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-5 lg:w-screen min-h-screen">
      {/* Navbar visível em telas maiores */}
      <div className="lg:block hidden lg:col-span-2">
        <Navbar isMenuOpen={isNavbarOpen} toggleMenu={closeNavbar} />
      </div>
      {/* Overlay para tela escura em telas móveis */}
      {isMobile && isNavbarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleNavbar}
        />
      )}
      {/* Barra superior para telas menores */}
      <div className="bg-blaze-orange-500 w-screen lg:hidden flex justify-between items-center px-4 py-2 h-16 fixed top-0 left-0 right-0 z-50">
        {/* Ícone do menu hamburguer */}
        <div onClick={toggleNavbar}>
          <FaBars className="text-white text-2xl cursor-pointer" />
        </div>
        {/* Título e imagem da marca centralizados */}
        <div className="flex items-center space-x-2">
          <img src={logoImage} alt="Storage logo" className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-white">Storage</h2>
        </div>
        {/* Placeholder para ajustar o espaço do ícone do menu hamburguer */}
        <div className="w-8" />
      </div>
      {/* Exibição condicional da Navbar em telas móveis */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-60 bg-blaze-orange-500 z-50 transform transition-transform duration-300 ease-in-out ${
          isNavbarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* repassa a funçao e o estado para a nav bar */}
        <Navbar isMenuOpen={isNavbarOpen} toggleMenu={closeNavbar} />
      </div>
      {/* Conteúdo principal */}
      <div className="lg:mt-16 lg:col-span-10 mb-8 mt-24 mx-5 lg:my-0 lg:mx-0 lg:pl-2">
        {/*  onde as rotas filhas seram renderizadas */}
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
