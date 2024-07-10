import { Link } from "react-router-dom";
import RegisterForm from "../components/form/RegisterForm";

const Register = () => {
  //pagina de resistro
  return (
    <div className="flex flex-col md:flex-col lg:flex-row h-screen">
      {/* primeiro setor com imagem e titulo */}
      <div
        className="bg-blaze-orange-500
        lg:w-1/2 lg:h-screen lg:flex-col lg:justify-center lg:items-center lg:p-6
        md:h-1/3 md:w-full md:px-12 md:pt-12 md:flex md:flex-row
        flex flex-col justify-center items-center pt-4 px-4
      "
      >
        <h1
          className="text-white
         lg:text-center lg:text-4xl lg:mb-24
         md:text-3xl md:text-left
         text-center text-xl  mb-6
        "
        >
          Seja bem vindo ao <strong>storage</strong>
          <br />
          Sistema de gerenciamento de estoque.
        </h1>
        <img
          src="/imgInitial.svg"
          alt="undraw_hello"
          className="lg:p-6 lg:h-auto
         md:h-48 md:w-auto
         h-28 
        "
        />
      </div>
      {/* segundo setor com o form de cadastro e link para o login */}
      <div
        className="text-blaze-orange-600
      lg:w-1/2 lg:h-screen lg:mt-0 lg:text-left lg:p-0
      flex flex-col justify-center items-center  mt-6  text-center pb-6"
      >
        <div className=" space-y-8 w-2/3">
          <h1 className="text-5xl font-bold">Sign-Up</h1>
          <p className="text-sm md:text-base">
            Faça agora mesmo seu cadastro. Para sua privacidade faça o cadastro
            com dados ficticios.
          </p>
            <RegisterForm/>
          <p>
            Já tam cadastro ?
            <Link to="/" className="text-black ml-2 hover:underline ">
              Realizar Login.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;