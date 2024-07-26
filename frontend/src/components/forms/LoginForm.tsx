import { useForm } from "react-hook-form"; //utilizando o useform para um form mais linmpo e performatico
import { useNavigate } from "react-router-dom"; //usenavigate para navegar entre paginas
import React, { useState } from "react"; //importaçao hook para estados
import MensagemCard from "../MessageCard"; //inportaçao do componente de mensagem
import api from "../../api";

//interface para os tipos do inputs do form
interface LoginFormValues {
  email: string;
  password: string;
}
//componente funcional loginform o formulario para login
const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  //controle dos estados das mensagens
  const [mensagem, setMensagem] = useState({ sucesso: false, texto: "" });
  const [mensagemCount, setMensagemCount] = useState(0);

  // Instanciação do hook useNavigate para permitir a navegação entre as páginas.
  const navigate = useNavigate();

  const onsubmit = async (data: LoginFormValues) => {
    // Redefina a mensagem
    setMensagem({ sucesso: false, texto: "" });
    // Incrementa o contador de mensagens forçando ela a aparecer
    setMensagemCount(mensagemCount + 1);
    try {
      // Realiza uma requisição POST para a API de login com o email e senha.
      const response = await api.post("/login", {
        email: data.email,
        password: data.password,
      });
      // Desestruturação para obter o token e o (role) do usuário da resposta da API.
      const { token } = response.data;
      // Armazena o token no localStorage do navegador.
      localStorage.setItem("token", token);
      //navega para home se ocorrer tudo certo
      navigate("/home");
    } catch (error) {
      //mensagem de erro se o email ou a senha estiverem incorretos
      setMensagem({ sucesso: false, texto: "Email ou senha incorretos" });
    }
  };

  return (
    //formulario de login
    <form onSubmit={handleSubmit(onsubmit)}>
      <div className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Digite o seu email"
          // registra o campo no formulario e tras o erro quando o campo nao e preenchido
          {...register("email", { required: "O email é obrigatorio" })}
          className="px-4 py-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blaze-orange-500 bg-gray-100"
        />
        {/* feedback de erro para o usuario */}
        {errors.email && (
          <span className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </span>
        )}

        <input
          type="password"
          placeholder="Digite sua senha"
          // registra o campo no formulario e tras o erro quando o campo nao e preenchido
          {...register("password", { required: "A senha é obrigatoria" })}
          className="px-4 py-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blaze-orange-500 bg-gray-100"
        />
        {/* feedback de erro para o usuario */}
        {errors.password && (
          <span className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </span>
        )}
        {/* botao para enviar o form */}
        <button
          type="submit"
          className="px-4 py-4 text-xl bg-blaze-orange-600 text-white rounded-md transition-colors duration-300 ease-in-out hover:bg-blaze-orange-700"
        >
          Login
        </button>
      </div>
      {/* mensagem de feedback geral */}
      <MensagemCard
        sucesso={mensagem.sucesso}
        mensagem={mensagem.texto}
        key={mensagemCount}
      />
    </form>
  );
};

export default LoginForm;
