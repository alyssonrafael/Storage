import { useState } from "react";
import SubTitle from "../components/Products/SubTitle";
import TableProducts from "../components/Products/tableProducts/TableProducts";
import NewProducts from "../components/Products/NewProducts";
import Categories from "../components/Products/Categories/CategoriesTable";

const Products: React.FC = () => {
  // Estado para controlar a mudança de produtos
  const [productChange, setProductChange] = useState(false);

  // Função para lidar com a mudança de e categorias, usado nos useefect para que os componetes sejam atualizados quando o onProductChange muda para mander a consistencia de dados das 3 seçoes
  const handleProductChange = () => {
    setProductChange(!productChange);
  };

  return (
    <div className="
    grid lg:grid-cols-10 lg:gap-2
    md:gap-7
    grid-cols-5 gap-3
    ">
      {/* Seção do título e subtítulo */}
      <div className="col-span-5 lg:col-span-10 mb-4">
        <h1 className="text-xl md:text-3xl mb-2">Produtos e categorias</h1>
        {/* Componente SubTitle que exibe o número de produtos recebe o estado da mudança de produto produtos */}
        <SubTitle productChange={productChange} />
      </div>
      {/* Seção da tabela de produtos */}
      <div className="col-span-5 lg:col-span-6 row-span-2 h-[70vh] overflow-y-auto shadow-2xl rounded-2xl">
        {/* Componente TableProducts que exibe a tabela de produtos */}
        <TableProducts onProductChange={handleProductChange} />
      </div>
      {/* Seção de cadastro de produto, recebe a props para remontar a tabela e o numero de produtos  */}
      <div className="col-span-5 lg:col-span-4 lg:mr-2 "><NewProducts onProductChange={handleProductChange}/></div>
      {/* Seção de cadastro de categoria, recebe a props para consistencia dos eementos */}
      <div className=" col-span-5 lg:col-span-4 lg:mr-2 "><Categories onProductChange={handleProductChange}/></div>
    </div>
  );
};

export default Products;
