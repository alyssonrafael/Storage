import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { decodeToken } from "../utils/tokenUtils";
import ConfirmationModal from "../EditConfirmationModal";
import MensagemCard from "../MessageCard";
import api from "../../api";

// Interface que define a estrutura dos dados do formulário
interface FormData {
  name: string;
  email: string;
  confirmEmail: string;
  currentPassword: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

// Componente funcional para edição da conta do usuário
const EditAccountForm: React.FC = () => {
  // Desestruturação dos métodos e estados do hook useForm
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  // Estados para armazenar o ID do usuário, estado do modal e mensagens
  const [userId, setUserId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<"save" | "cancel">("cancel");
  const [mensagem, setMensagem] = useState({ sucesso: false, texto: "" });
  const [mensagemCount, setMensagemCount] = useState(0);

  // Efeito colateral para buscar dados do usuário ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        api
          .get(`/user/${decoded.userId}`, config)
          .then((response) => {
            const user = response.data;
            setUserId(user.id);
            setValue("name", user.name);
            setValue("email", user.email);
            setValue("confirmEmail", user.email);
          })
          .catch((error) => console.error("Erro ao buscar usuário:", error));
      }
    }
  }, [setValue]);

  // Função chamada ao enviar o formulário
  const onSubmit: SubmitHandler<FormData> = () => {
    setModalAction("save");
    setIsModalOpen(true);
  };

  // Função chamada ao confirmar o salvamento das alterações
  const handleConfirmSave = async () => {
    setIsModalOpen(false);
    setMensagem({ sucesso: false, texto: "" });
    setMensagemCount(mensagemCount + 1);

    const data = getValues();
    const token = localStorage.getItem("token");

    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        // Envia uma requisição PUT para atualizar o usuário
        await api.put(
          `/users/${userId}`,
          {
            name: data.name,
            email: data.email,
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
          config
        );

        setMensagem({ sucesso: true, texto: "Conta atualizada com sucesso" });
        reset({
          name: getValues("name"),
          email: getValues("email"),
          confirmEmail: getValues("email"),
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          console.error("Erro ao atualizar conta:", axiosError);

          if (axiosError.response) {
            const { response } = axiosError;
            if (response && response.data) {
              const message =
                (response.data as { message?: string }).message ||
                "Erro ao atualizar conta. Por favor, tente novamente.";
              setMensagem({ sucesso: false, texto: `${message}` });
            } else {
              setMensagem({
                sucesso: false,
                texto: "Erro ao atualizar conta. Por favor, tente novamente",
              });
            }
          } else {
            setMensagem({
              sucesso: false,
              texto: "Erro ao atualizar conta. Por favor, tente novamente",
            });
          }
        } else {
          setMensagem({
            sucesso: false,
            texto: "Erro inesperado. Por favor, tente novamente.",
          });
        }
      }
    } else {
      setMensagem({
        sucesso: false,
        texto: "Token não encontrado. Por favor, faça login novamente.",
      });
    }
  };

  // Função chamada ao clicar em cancelar
  const handleCancel = () => {
    setModalAction("cancel");
    setIsModalOpen(true);
  };

  // Função chamada ao confirmar o cancelamento das alterações
  const confirmCancel = () => {
    setMensagem({ sucesso: false, texto: "" });
    setMensagemCount(mensagemCount + 1);
    reset({
      name: getValues("name"),
      email: getValues("email"),
      confirmEmail: getValues("email"),
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setIsModalOpen(false);
    setMensagem({ sucesso: true, texto: "Alterações descartadas" });
  };

  // Função chamada para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-blaze-orange-500">
        Editar Conta
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Campos do formulário */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Nome
          </label>
          <input
            type="text"
            {...register("name", { required: "Nome é obrigatório" })}
            className="p-2 w-full border text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white rounded-lg"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="flex space-x-2">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email é obrigatório",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email inválido",
                },
              })}
              className="p-2 w-full border text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Confirmar Email
            </label>
            <input
              type="email"
              {...register("confirmEmail", {
                required: "Confirmação de email é obrigatória",
                validate: (value) =>
                  value === getValues("email") || "Emails não coincidem",
              })}
              className="p-2 w-full border text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white rounded-lg"
            />
            {errors.confirmEmail && (
              <p className="text-red-500 text-sm">
                {errors.confirmEmail.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Nova Senha
            </label>
            <input
              placeholder="(opcional)"
              type="password"
              {...register("newPassword")}
              className="p-2 w-full border text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Confirmar senha
            </label>
            <input
              type="password"
              {...register("confirmNewPassword", {
                validate: (value) =>
                  value === getValues("newPassword") || "Senhas não coincidem",
              })}
              className="p-2 w-full border text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white rounded-lg"
            />
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Senha Atual
          </label>
          <input
            type="password"
            {...register("currentPassword", {
              required: "Senha atual é obrigatória",
            })}
            className="p-2 w-full border text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white rounded-lg"
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blaze-orange-500 text-white rounded-lg hover:bg-blaze-orange-600 transition duration-300"
          >
            {isSubmitting ? "Enviando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            Cancelar
          </button>
        </div>
      </form>

      <MensagemCard
        sucesso={mensagem.sucesso}
        mensagem={mensagem.texto}
        key={mensagemCount}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={modalAction === "save" ? handleConfirmSave : confirmCancel}
        message={
          modalAction === "save"
            ? "Tem certeza de que deseja salvar as alterações?"
            : "Tem certeza de que deseja cancelar as alterações?"
        }
      />
    </div>
  );
};

export default EditAccountForm;
