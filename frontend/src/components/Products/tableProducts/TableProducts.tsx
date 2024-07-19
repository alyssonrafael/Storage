import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import ProductTable from "./ProductsTable";
import DeletedProductTable from "./DeletedProductTable";
import EditProductForm from "./EditProductForm";
import MensagemCard from "../../MessageCard";
import { Categoria, ProductForm, ArrayProductData } from "../../utils/types";

const TableProducts: React.FC<{ onProductChange: () => void }> = ({
  onProductChange,
}) => {
  // Estado para armazenar os produtos
  const [data, setData] = useState<ArrayProductData>([]);
  // Estado para armazenar as categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  // Estado para armazenar o ID do produto sendo editado
  const [editProductId, setEditProductId] = useState<number | null>(null);
  // Estado para armazenar erros do servidor
  const [serverError, setServerError] = useState<string>("");
  // Estado para armazenar o termo de pesquisa e categoria selecionada
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">(0);
  // Controle dos estados das mensagens de sucesso e erro
  const [mensagem, setMensagem] = useState({ sucesso: false, texto: "" });
  const [mensagemCount, setMensagemCount] = useState(0);
  //estado para o carregamento dos dados
  const [loading, setLoading] = useState(true);

  // Função do react-hook-form para gerenciamento do formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductForm>();

  useEffect(() => {
    // Função assíncrona para buscar dados dos produtos e categorias
    const fetchData = async () => {
      // Busca os produtos
      try {
        const responseProdutos = await axios.get<ArrayProductData>(
          "http://localhost:3333/api/produtos"
        );
        const sortedProducts = responseProdutos.data.sort(
          (a, b) => a.id - b.id
        ); //ordenaçao com base no id
        setData(sortedProducts);
        // Busca as categorias
        const responseCategorias = await axios.get<Categoria[]>(
          "http://localhost:3333/api/categorias"
        );
        const filteredCategories = responseCategorias.data.filter(
          (category) => !category.deleted
        );//filtra as categorias que nao estao marcadas como deletadas
        setCategorias(filteredCategories);//seta as categorias com as categorias filtradaas
        setLoading(false); //cancela o loading e exibe os dados
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [editProductId, onProductChange]); //esta monitorando o editProductId e onProductChange para sempre atualizar ou cadastrar ele mudar para que a categoria seja corespondente ao que foi alterado e o novo produto apareca na tabela

  // Função para atualizar um produto
  const updateProduct = async (id: number, formData: ProductForm) => {
    // Redefine a mensagem e incrementa o contador de mensagens
    setMensagem({ sucesso: false, texto: "" });
    setMensagemCount(mensagemCount + 1);
    //tenta fazer o put dos novos dados para o produto
    try {
      await axios.put(`http://localhost:3333/api/produto/${id}`, formData);
      //se for bem sucedido retorna o feedback
      setMensagem({ sucesso: true, texto: "Produto atualizado com sucesso" });
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
  // Função para ""deletar"" um produto
  const handleDelete = async (id: number) => {
    // Redefine a mensagem e incrementa o contador de mensagens
    setMensagem({ sucesso: false, texto: "" });
    setMensagemCount(mensagemCount + 1);
    //tenta fazer o put com o campo deleted:true
    try {
      await axios.put(`http://localhost:3333/api/delete-produto/${id}`);
      setData((prevData) =>
        prevData.map((product) =>
          product.id === id ? { ...product, deleted: true } : product
        )
      );
      //se der certo chama a mensagem e a dunçao de productchage
      setMensagem({
        sucesso: true,
        texto: "Produto movido para Produtos deletado.",
      });
      onProductChange();
    } catch (error) {
      // tratamento de erro
      setMensagem({
        sucesso: false,
        texto:
          "erro ao mover para Produtos deletados. tente novamente mais tarde",
      });
    }
  };
  // Função para ""restaurar"" um produto
  const handleRestore = async (id: number) => {
    // Redefine a mensagem e incrementa o contador de mensagens
    setMensagem({ sucesso: false, texto: "" });
    setMensagemCount(mensagemCount + 1);
    //tenta fazer o put com o campo deleted:false
    try {
      await axios.put(`http://localhost:3333/api/restore-produto/${id}`);
      setData((prevData) =>
        prevData.map((product) =>
          product.id === id ? { ...product, deleted: false } : product
        )
      );
      //se der certo chama a mensagem e a dunçao de productchage
      setMensagem({
        sucesso: true,
        texto: "Produto movido para lista utilizavel novamente.",
      });
      onProductChange();
    } catch (error) {
      // tratamento de erro
      setMensagem({
        sucesso: false,
        texto: "Erro ao mover para lista utilizavel tente novamente mais tarde",
      });
    }
  };
  // Função para abrir o formulário de edição com dados do produto
  const openEditForm = (id: number) => {
    // Define o ID do produto que está sendo editado
    setEditProductId(id);
    // Encontra o produto na lista de produtos com base no ID fornecido
    const product = data.find((p) => p.id === id);
    // Se o produto for encontrado, redefine o estado do formulário com os dados do produto
    if (product) {
      // `reset` é uma função do react-hook-form que atualiza os valores do formulário
      // com os dados fornecidos, permitindo que o formulário exiba as informações atuais do produto
      reset(product);
    }
  };
  // Função para fechar o formulário de edição
  const closeEditForm = () => {
    // Limpa o ID do produto que está sendo editado
    setEditProductId(null);
    // Redefine os valores do formulário para o estado inicial (vazio ou padrão)
    reset();
  };

  // Função chamada ao submeter o formulário de edição
  const onSubmit = async (formData: ProductForm) => {
    try {
      // Tenta atualizar o produto com os dados fornecidos no formulário
      await updateProduct(editProductId!, formData);
      // Atualiza a lista de produtos no estado com os dados modificados
      setData((prevData) =>
        prevData.map((product) =>
          product.id === editProductId ? { ...product, ...formData } : product
        )
      );
      // Fecha o formulário de edição após a atualização bem-sucedida
      closeEditForm();
    } catch (error) {
      // Define uma mensagem de erro se a atualização falhar
      setServerError("Erro ao atualizar o produto.");
    }
  };

  // Filtra produtos baseados no termo de pesquisa e na categoria selecionada
  const filteredProducts = data
    // Filtra os produtos que o nome contém o termo de pesquisa, ignorando maiúsculas/minúsculas
    .filter((product) =>
      product.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Filtra os produtos com base na categoria selecionada
    .filter(
      (product) =>
        // Se nenhuma categoria estiver selecionada (0), inclui todos os produtos
        // Caso contrário, inclui apenas os produtos cuja categoriaId corresponde à categoria selecionada
        selectedCategory === 0 || product.categoriaId === selectedCategory
    );
  // Filtra produtos deletados a partir da lista de produtos filtrados
  const deletedProducts = filteredProducts.filter((product) => product.deleted);
  // Filtra produtos ativos (não deletados) a partir da lista de produtos filtrados
  const activeProducts = filteredProducts.filter((product) => !product.deleted);

  if (loading)
    return (
      <p className="text-center text-2xl text-blaze-orange-500">
        Carregando...
      </p>
    ); //se os dados ainda nao estiverem prontos exibe o loading

  return (
    <div className="p-6">
      {/* div com o titulo e os campos de filtro e pesquisa */}
      <div className="md:flex md:justify-between items-center border-b-2">
        <h1 className="text-2xl text-center text-blaze-orange-500">
          Lista de Produtos
        </h1>
        <div className="flex space-x-2 items-center justify-center">
          {/* Campo de pesquisa */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Pesquisar por nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border text-xs md:text-base rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white"
            />
          </div>
          {/* Filtro por categoria */}
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
              className="border text-xs md:text-base rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blaze-orange-400 hover:border-blaze-orange-400 transition duration-300 bg-white"
            >
              <option value={0}>Todas as categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Exibe a tabela de produtos utilizáveis */}
      <ProductTable
        data={activeProducts} // Dados dos produtos a serem exibidos na tabela
        openEditForm={openEditForm} // Função para abrir o formulário de edição ao clicar no lapis de um produto na tabela
        handleDelete={handleDelete} // Função para lidar com a exclusão de um produto ao clicar no lixeiro
      />
      {/* Exibe a tabela de produtos deletados, se houver */}
      {deletedProducts.length > 0 && (
        <DeletedProductTable
          deletedProducts={deletedProducts} // Dados dos produtos deletados a serem exibidos na tabela
          openEditForm={openEditForm} // Função para abrir o formulário de edição ao clicar no lapis de um produto na tabela de deletados
          handleRestore={handleRestore} // Função para lidar com a restauração de um produto deletado ao clicar na seta para cima
        />
      )}

      {/* Exibe o formulário de edição, se estiver aberto */}
      {editProductId !== null && (
        <EditProductForm
          editProductId={editProductId} // ID do produto sendo editado
          categorias={categorias} // Lista de categorias para seleção no formulário
          closeEditForm={closeEditForm} // Função para fechar o formulário de edição
          onSubmit={onSubmit} // Função para lidar com o envio do formulário de edição
          errors={errors} // Erros de validação do formulário
          register={register} // Função para registrar inputs do formulário com react-hook-form
          handleSubmit={handleSubmit} // Função para lidar com o envio do formulário com react-hook-form
          serverError={serverError} // Mensagem de erro do servidor, se houver
        />
      )}
      {/* Exibe o cartão de mensagem */}
      <MensagemCard
        sucesso={mensagem.sucesso}
        mensagem={mensagem.texto}
        key={mensagemCount}
      />
    </div>
  );
};

export default TableProducts;
