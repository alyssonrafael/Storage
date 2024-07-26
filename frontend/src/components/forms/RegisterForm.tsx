import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react"; //importaçao hook
import MensagemCard from "../MessageCard";
import api from "../../api";

//interface para os tipos do inputs do form
interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmationPassword: string;
}
//componente funcional do form de registro
const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  // estados para controle da mensagem de feedback
  const [mensagem, setMensagem] = useState({ sucesso: false, texto: "" });
  const [mensagemCount, setMensagemCount] = useState(0);

  // Instanciação do hook useNavigate para permitir a navegação entre as páginas.
  const navigate = useNavigate();

  const onsubmit = async (data: RegisterFormValues) => {
    // Redefina a mensagem
    setMensagem({ sucesso: false, texto: "" });
    // Incrementa o contador de mensagens forçando ela a aparecer
    setMensagemCount(mensagemCount + 1);
    //requisisçao post para fazer cadastro no banco de dados
    try {
      await api.post("/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      // mensagem de sucesso caso tudo ocorra bem
      setMensagem({
        sucesso: true,
        texto: "Registro bem-sucedido!, Você sera redirecionado",
      });
      //aguarda 2 segundo e navega para pagina de login
      setTimeout(() => {
        navigate("/");
      }, 2000); //time de 2s
    } catch (error) {
      //se hover erro manda a mensagem generica
      setMensagem({
        sucesso: false,
        texto: "Erro ao tentar cadastrar, tente novamente",
      });
    }
  };
  //ja que estou usando o hookform tenho que dizer que quero monitorar o campo de senha para poder comparar com a confirmaçao antes do envio do from
  const password = watch("password");
  //retorno do componente do formulario
  return (
    //formulario de registro
    <form onSubmit={handleSubmit(onsubmit)}>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Digite seu nome"
          // registra o campo no formulario e tras o erro quando o campo nao e preenchido
          {...register("name", { required: "O nome é obrigatório" })}
          className="px-4 py-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blaze-orange-500 bg-gray-100"
        />
        {errors.name && (
          <span className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </span>
        )}

        <input
          type="email"
          placeholder="Digite o seu email"
          // registra o campo no formulario e tras o erro quando o campo nao e preenchido
          {...register("email", { required: "O email é obrigatório" })}
          className="px-4 py-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blaze-orange-500 bg-gray-100"
        />
        {errors.email && (
          <span className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </span>
        )}

        <input
          type="password"
          placeholder="Digite sua senha"
          // registra o campo no formulario e tras o erro quando o campo nao e preenchido ou tem tamanho menor que 6
          {...register("password", {
            required: "A senha é obrigatória",
            minLength: {
              value: 6,
              message: "A senha deve ter pelo menos 6 caracteres",
            },
          })}
          className="px-4 py-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blaze-orange-500 bg-gray-100"
        />
        {errors.password && (
          <span className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </span>
        )}

        <input
          type="password"
          placeholder="Confirme sua senha"
          // registra o campo no formulario e tras o erro quando o campo nao e preenchido ou a senha nao esta coincidindo
          {...register("confirmationPassword", {
            required: "Confirme sua senha",
            validate: (value) =>
              value === password || "As senhas não coincidem",
          })}
          className="px-4 py-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blaze-orange-500 bg-gray-100"
        />
        {errors.confirmationPassword && (
          <span className="text-red-500 text-sm mt-1">
            {errors.confirmationPassword.message}
          </span>
        )}

        <button
          type="submit"
          className="px-4 py-4 text-xl bg-blaze-orange-600 text-white rounded-md transition-colors duration-300 ease-in-out hover:bg-blaze-orange-700"
        >
          Registrar
        </button>
      </div>
      {/* mensagem de feedback */}
      <MensagemCard
        sucesso={mensagem.sucesso}
        mensagem={mensagem.texto}
        key={mensagemCount}
      />
    </form>
  );
};

export default RegisterForm;
