import React from "react";
import { ProductData } from "../../utils/types";
import { FaPen, FaRegTrashCan } from "react-icons/fa6";

interface ProductTableProps {
  data: ProductData[]; // Propriedade que recebe a lista de produtos
  openEditForm: (id: number) => void; // Função para abrir o formulário de edição de um produto
  handleDelete: (id: number) => void; // Função para deletar um produto
}

const ProductTable: React.FC<ProductTableProps> = ({
  data,
  openEditForm,
  handleDelete,
}) => {
  return (
    <>
      {/* Título da tabela de produtos utilizáveis */}
      {/* Tabela de produtos */}
      <h2 className="text-xl md:sticky md:top-0  bg-white text-green-500 font-medium mb-6">
        Produtos utilizaveis
      </h2>
      <table className="min-w-full rounded-lg shadow-md mb-8">
        <thead className=" bg-white sticky top-0 md:top-7 text-xs md:text-sm lg:text-base">
          <tr>
            <th className="py-2 px-4">id/nome</th>
            <th className="py-2 px-4">categoria</th>
            <th className="py-2 px-4">disponíveis</th>
            <th className="py-2 px-4">Valor</th>
            <th className="py-2 px-4">status</th>
            <th className="py-2 px-4">ações</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-center text-xs md:text-sm lg:text-base">
          {/* Mapeamento dos produtos filtrados que não estão deletados */}
          {data
            .filter((product) => !product.deleted)
            .map((Product) => (
              <tr key={Product.id}>
                <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
                  {Product.id}/{Product.nome}
                </td>
                <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
                  {Product.categoria.nome}
                </td>
                <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
                  {Product.quantidade}
                </td>
                <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
                  R${Product.preco}
                </td>
                <td
                  className={`border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4 ${
                    Product.disponivel ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {Product.disponivel ? "Disponível" : "Indisponível"}
                </td>
                <td className="border-b-2 text-blaze-orange-500 border-blaze-orange-300 py-2 px-4">
                  {/* Botões de ação para editar e deletar o produto */}
                  <div className="flex space-x-4">
                    <FaPen
                      className="text-yellow-500 cursor-pointer"
                      onClick={() => openEditForm(Product.id)}
                    />
                    <FaRegTrashCan
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(Product.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default ProductTable;
