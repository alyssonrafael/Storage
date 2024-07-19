import React from "react";
import { FieldErrors, SubmitHandler, UseFormRegister } from "react-hook-form";
import { Categoria, ProductForm } from "../../utils/types";

// Define as propriedades esperadas pelo componente EditProductForm
interface EditProductFormProps {
  editProductId: number | null; // ID do produto que está sendo editado; pode ser null se nenhum produto estiver sendo editado
  categorias: Categoria[]; // Lista de categorias para seleção no formulário
  closeEditForm: () => void; // Função para fechar o formulário de edição
  onSubmit: SubmitHandler<ProductForm>; // Função para lidar com o envio do formulário
  errors: FieldErrors<ProductForm>; // Erros de validação do formulário
  register: UseFormRegister<ProductForm>; // Função do react-hook-form para registrar campos do formulário
  handleSubmit: (
    callback: SubmitHandler<ProductForm>
  ) => (event?: React.BaseSyntheticEvent) => Promise<void>;
  /*`handleSubmit` retorna uma função para manipular o envio do formulário,
  validando os dados e chamando o `callback` com os dados válidos.*/
  serverError: string; // Mensagem de erro do servidor, se houver
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  categorias,
  closeEditForm,
  onSubmit,
  errors,
  register,
  handleSubmit,
  serverError,
}) => {
  return (
    // box do modal
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"> {/* ajuste do z index*/}
      {/* Container para o formulário */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-96 mx-4 md:mx-0">
        <h2 className="text-xl font-medium mb-4 text-blaze-orange-500">
          Editar Produto
        </h2>
        {/* Formulário de edição */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo para nome do produto */}
          <div className="mb-4">
            <label className="block text-gray-700">Nome</label>
            <input
              {...register("nome", { required: "O nome é obrigatório" })} // Registro do campo nome com validação obrigatória
              className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 transition duration-300"
            />
            {/* Mensagem de erro se houver */}
            {errors.nome && (
              <span className="text-red-500 text-sm mt-1">
                {errors.nome.message}
              </span>
            )}
          </div>
          {/* Campo para quantidade do produto */}
          <div className="mb-4">
            <label className="block text-gray-700">Quantidade</label>
            <input
              {...register("quantidade", {
                required: "A quantidade é obrigatória", // Validação obrigatória
                min: {
                  value: 0,
                  message: "A quantidade não pode ser menor que 0", // Validação de mínimo
                },
              })}
              type="number"
              className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 transition duration-300"
            />
            {/* Mensagem de erro se houver */}
            {errors.quantidade && (
              <span className="text-red-500 text-sm mt-1">
                {errors.quantidade.message}
              </span>
            )}
          </div>
          {/* Campo para seleção da categoria */}
          <div className="mb-4">
            <label className="block text-gray-700">Categoria</label>
            <select
              {...register("categoriaId", { required: true })} // Registro do campo categoria com validação obrigatória
              className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white"
            >
              {/* Opções de categorias */}
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
            {/* Mensagem de erro se houver */}
            {errors.categoria && (
              <span className="text-red-500 text-sm mt-1">
                {errors.categoria.message}
              </span>
            )}
          </div>
          {/* Campo para disponibilidade do produto */}
          <div className="mb-4 flex items-center space-x-4">
            <label className="block text-gray-700">Disponível</label>
            <input
              {...register("disponivel")}
              type="checkbox"
              className="h-4 w-4 text-blaze-orange-400 transition duration-300"
            />
          </div>
          {/* Botões de ação do formulário */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeEditForm} // Função para fechar o formulário e cancelar a ediçao
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2 hover:bg-gray-400 transition duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit" //submete o formulario e atualiza aa categoria ao fazer isso
              className="px-4 py-2 bg-blaze-orange-500 text-white rounded hover:bg-blaze-orange-600 transition duration-300"
            >
              Salvar
            </button>
          </div>
          {/* Mensagem de erro do servidor, se houver */}
          {serverError && (
            <p className="text-red-500 text-center mt-4">{serverError}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
