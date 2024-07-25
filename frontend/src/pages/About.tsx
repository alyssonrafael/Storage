// import de icones
import {
  FaNodeJs,
  FaReact,
  FaDocker,
  FaFigma,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { RiTailwindCssFill } from "react-icons/ri";
import { BiLogoPostgresql, BiLogoTypescript } from "react-icons/bi";
import { SiPostman, SiPrisma } from "react-icons/si";
import { MdOutlineEmail, MdWorkOutline } from "react-icons/md";
// componente com o card de tecnologia
import Technologie from "../components/Technologie";

// pagina about
function About() {
  return (
    <div
      className="
          grid lg:grid-cols-9 lg:gap-2 lg:mr-4
          md:gap-7
          grid-cols-5 gap-3
          "
    >
      {/* seção de titulo */}
      <div className="col-span-5 lg:col-span-9 mb-12">
        <h1 className="text-xl md:text-3xl mb-2">Relatorios e Dashboard</h1>
      </div>
    {/* seção das funcionalidades */}
      <div className="col-span-5 lg:col-span-3 rounded-lg shadow-2xl pt-8">
        <h1 className="text-center text-2xl font-semibold text-blaze-orange-500 mb-4">
          Funcionalidades
        </h1>
        <ol className="list-decimal list-inside space-y-1 text-lg p-6 text-center lg:text-left">
          <li>Autenticação Segura</li>
          <li>Tipo de Usuários</li>
          <li>Cadastro de Vários Usuários</li>
          <li>Gerenciamento de Produtos</li>
          <li>Gerenciamento de Categorias</li>
          <li>Dados Intuitivos</li>
          <li>Fluxo de Vendas</li>
          <li>Relatórios e Dashboard</li>
          <li>Edição de Usuário</li>
        </ol>
      </div>
      {/* seção da motivação */}
      <div className="col-span-5 lg:col-span-3  rounded-lg shadow-2xl pt-8 ">
        <h1 className="text-center text-2xl font-semibold text-blaze-orange-500 mb-4">
          Motivação
        </h1>
        <p className="text-lg p-6 text-center">
          O projeto Storage foi criado com o objetivo de desenvolver uma solução
          full-stack que me permita praticar e aprimorar minhas habilidades em
          todas as etapas do desenvolvimento. Desde a prototipagem inicial no
          Figma até a implementação da API e o desenvolvimento do frontend, o
          Storage abrange todo o processo, garantindo uma experiência completa e
          integrada.
        </p>
      </div>
      {/* seção de tecnologias */}
      <div className="col-span-5 lg:col-span-3 rounded-lg shadow-2xl pt-8">
        <h1 className="text-center text-2xl font-semibold text-blaze-orange-500 mb-4">
          Tecnologias
        </h1>
        <div className="flex flex-wrap justify-center ">
          <Technologie
            text="NodeJs"
            Icon={FaNodeJs}
            className="hover:border-green-400"
            iconClassName="text-green-400"
          />
          <Technologie
            text="JavaScript"
            Icon={IoLogoJavascript}
            className="hover:border-yellow-400"
            iconClassName="text-yellow-400 border border-black"
          />
          <Technologie
            text="Docker"
            Icon={FaDocker}
            className="hover:border-blue-400"
            iconClassName="text-blue-400"
          />
          <Technologie
            text="PostgreSql"
            Icon={BiLogoPostgresql}
            className="hover:border-blue-400"
            iconClassName="text-blue-400"
          />
          <Technologie
            text="Postman"
            Icon={SiPostman}
            className="hover:border-orange-400"
            iconClassName="text-orange-400"
          />
          <Technologie
            text="Prisma"
            Icon={SiPrisma}
            className="hover:border-black"
            iconClassName="text-black"
          />
          <Technologie
            text="Figma"
            Icon={FaFigma}
            className="hover:border-pink-400"
            iconClassName="text-pink-400"
          />
          <Technologie
            text="TypeScript"
            Icon={BiLogoTypescript}
            className="hover:border-blue-400"
            iconClassName="text-blue-400"
          />
          <Technologie
            text="ReactJs"
            Icon={FaReact}
            className="hover:border-blue-400"
            iconClassName="text-blue-400"
          />
          <Technologie
            text="TailwindCss"
            Icon={RiTailwindCssFill}
            className="hover:border-blue-400"
            iconClassName="text-blue-400"
          />
        </div>
      </div>
      {/* banner final com links para redes sociais*/}
      <div className="col-span-5 lg:col-span-9 bg-blaze-orange-500 rounded-lg py-2">
        <div className="flex justify-around px-6 items-center">
          <p className="md:text-2xl text-white w-2/4 ">
            Gostou do meu trabalho ? você pode visitar meu portifolio e minhas
            redes sociais .
          </p>
          <div className="md:space-x-8 space-y-2 md:space-y-0 flex flex-wrap md:flex-row flex-col md:flex-nowrap  text-white">
            <a href="https://github.com/alyssonrafael" target="_blank" rel="noopener noreferrer">
              <FaGithub className="md:text-5xl text-3xl" />
            </a>
            <a href="https://www.linkedin.com/in/alyssonrafael/" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="md:text-5xl text-3xl" />
            </a>
            <a href="mailto:alyssonrafaelf@outlook.com" target="_blank" rel="noopener noreferrer">
              <MdOutlineEmail className="md:text-5xl text-3xl" />
            </a>
            <a href="https://portifolio-react-js-gamma.vercel.app/" target="_blank" rel="noopener noreferrer">
              <MdWorkOutline className="md:text-5xl text-3xl" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
