import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import MensagemCard from "../../MessageCard";
import api from "../../../api";

// interface com os valores que o formulario ira receer
interface CategorieFormValues {
  nome: string;
}
// componente funcional do formulario de cadastro de categoria
const FormNewCategorie: React.FC<{ onProductChange: () => void }> = ({
  onProductChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategorieFormValues>();

  // estados para controle da mensagem de feedback
  const [mensagem, setMensagem] = useState({ sucesso: false, texto: "" });
  const [mensagemCount, setMensagemCount] = useState(0);

  //funçao para enviar o formulario
  const onSubmit = async (data: CategorieFormValues) => {
    // Redefina a mensagem
    setMensagem({ sucesso: false, texto: "" });
    // Incrementa o contador de mensagens forçando ela a aparecer
    setMensagemCount(mensagemCount + 1);

    // Requisição post para fazer cadastro no banco de dados
    try {
      await api.post("/categoria", data);
      // Mensagem de sucesso caso tudo ocorra bem
      setMensagem({
        sucesso: true,
        texto: "Nova categoria Cadastrada",
      });
      // Limpa os campos do formulário após o registro bem-sucedido
      reset();
      //passa a funçao que vem por props para consstencia entre as tabelas
      onProductChange();
    } catch (error) {
      //se nao cai no tratamento de errro
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 409) {
          setMensagem({
            sucesso: false,
            texto: "Conflito de nomes, tente outro nome",
          });
        }
        if (axiosError.response?.status === 500) {
          setMensagem({ sucesso: false, texto: "Erro ao criar categoria" });
        }
      }
      throw new Error("Erro ao criar categoria");
    }
  };

  return (
    <div>
      {/* formulario de cadastro de categorias */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg mx-auto pb-4 px-2 flex text-left space-x-4"
      >
        <div>
          {/* Tratamento de erros no formulário */}
          {errors.nome ? (
            <span className="text-red-500 text-xs italic mb-2">
              {errors.nome.message}
            </span>
          ) : (
            <span className="text-sm">Nome</span>
          )}
          <input
            type="text"
            placeholder="Digite o nome"
            {...register("nome", { required: "O nome é obrigatório" })}
            className="appearance-none block w-full h-8 text-gray-700 border leading-tight border-gray-200 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white"
          />
        </div>
        <div className="flex-none pt-6">
          <button
            type="submit"
            className="bg-blaze-orange-600 h-8 p-1 font-medium text-white rounded focus:outline-none focus:shadow-outline hover:bg-blaze-orange-700 transition duration-300 w-full"
          >
            + Nova categoria
          </button>
        </div>
      </form>
      {/* Mensagem de feedback */}
      <MensagemCard
        sucesso={mensagem.sucesso}
        mensagem={mensagem.texto}
        key={mensagemCount}
      />
    </div>
  );
};

export default FormNewCategorie;
