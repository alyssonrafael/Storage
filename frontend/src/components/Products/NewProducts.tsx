import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import MensagemCard from "../MessageCard";
import { Categoria } from "../utils/types";
//interface com os valores necessarios para criar um novo produto
interface ProductsFormValues {
  nome: string;
  preco: number;
  quantidade: number;
  categoriaId: number;
}
//componente funcional NewProducts que recebe como props uma funçao
const NewProducts: React.FC<{ onProductChange: () => void }> = ({
  onProductChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductsFormValues>();

  // estados para controle da mensagem de feedback
  const [mensagem, setMensagem] = useState({ sucesso: false, texto: "" });
  const [mensagemCount, setMensagemCount] = useState(0);
  //estado que salva as categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  //use efect para salvar as categorias no estado
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3333/api/categorias"
        );
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
      }
    };

    fetchCategorias();
  }, []); //montado apenas uma vez

  const onSubmit = async (data: ProductsFormValues) => {
    //funçao para enviar o formulario
    // Redefina a mensagem
    setMensagem({ sucesso: false, texto: "" });
    // Incrementa o contador de mensagens forçando ela a aparecer
    setMensagemCount(mensagemCount + 1);

    // Adiciona o campo 'disponivel' com valor 'true' aos dados enviados pois se o novo produto e criado ele ja vai ser disponivel
    const dataComDisponibilidade = { ...data, disponivel: true };

    // Requisição post para fazer cadastro no banco de dados
    try {
      await axios.post(
        "http://localhost:3333/api/produto",
        dataComDisponibilidade
      );

      // Mensagem de sucesso caso tudo ocorra bem
      setMensagem({
        sucesso: true,
        texto: "Novo Produto Cadastrado",
      });

      // Limpa os campos do formulário após o registro bem-sucedido
      reset();
      //passa a funçao que vem por props para que a tabela mude e respectivamente o numero do subtitulo
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
          setMensagem({ sucesso: false, texto: "Erro ao atualizar o produto" });
        }
      }
      throw new Error("Erro ao atualizar o produto");
    }
  };

  return (
    // retorno do componente com o formulario de cadastro de produto
    <div className="bg-white shadow-2xl rounded-2xl max-h-min">
      <h1 className="text-xl text-blaze-orange-500 font-semibold text-center">
        Adicionar Novo Produto
      </h1>
      <div>
        {/* formulario para cadastro de novos produtos */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg mx-auto mt-4 pb-4 px-2"
        >
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              {/* tratamento de erros no formlario */}
              {errors.nome ? (
                <p className="text-red-500 text-xs italic">
                  {errors.nome.message}
                </p>
              ) : (
                <span className="text-sm">Nome</span>
              )}
              {/* primeiro campo de entrada  */}
              <input
                type="text"
                placeholder="Digite o nome"
                {...register("nome", { required: "O nome é obrigatório" })}
                className="appearance-none block w-full text-gray-700 border  leading-tight border-gray-200 rounded py-3 px-4 mb-3 focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white"
              />
            </div>
            <div>
              {errors.preco ? (
                <p className="text-red-500 text-xs italic">
                  {errors.preco.message}
                </p>
              ) : (
                <span className="text-sm">Preço</span>
              )}
              <input
                type="number"
                step="0.01"
                placeholder="Digite o valor"
                {...register("preco", {
                  required: "O preço é obrigatório",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "O preço não pode ser menor ou igual a 0",
                  },
                })}
                className="appearance-none block w-full text-gray-700 border  leading-tight border-gray-200 rounded py-3 px-4 mb-3 focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white "
              />
            </div>
            <div>
              {errors.quantidade ? (
                <p className="text-red-500 text-xs italic">
                  {errors.quantidade.message}
                </p>
              ) : (
                <span className="text-sm">Quantidade</span>
              )}
              <input
                type="number"
                placeholder="Digite a quantidade"
                {...register("quantidade", {
                  required: "A quantidade é obrigatória",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "A quantidade não pode ser menor ou igual a 0",
                  },
                })}
                className="appearance-none block w-full text-gray-700 border  leading-tight border-gray-200 rounded py-3 px-4 mb-3 focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white "
              />
            </div>
            <div>
              {errors.categoriaId ? (
                <p className="text-red-500 text-xs italic">
                  {errors.categoriaId.message}
                </p>
              ) : (
                <span className="text-sm">Categoria</span>
              )}
              {/* select com as categorias disponiveis */}
              <select
                {...register("categoriaId", {
                  required: "A categoria é obrigatória",
                  valueAsNumber: true,
                })}
                className="appearance-none block w-full text-gray-700 border leading-tight border-gray-200 rounded py-3 px-4 mb-3 focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white "
              >
                <option value="">Selecione a categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className=" bg-blaze-orange-600 text-white font-bold py-1 px-5 rounded focus:outline-none focus:shadow-outline hover:bg-blaze-orange-700"
            >
              <div className="flex space-x-4 justify-center items-center">
                <p className="font-extrabold ">+</p>
                <h1 className="font-semibold">Novo Produto</h1>
              </div>
            </button>
          </div>
          {/* mensagem de feedback */}
          <MensagemCard
            sucesso={mensagem.sucesso}
            mensagem={mensagem.texto}
            key={mensagemCount}
          />
        </form>
      </div>
    </div>
  );
};

export default NewProducts;
