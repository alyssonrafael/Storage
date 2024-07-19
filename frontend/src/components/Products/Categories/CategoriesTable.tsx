import DeletedCategoriesTable from "./DeletedCategoriesTable";
import FormNewCategorie from "./FormNewCategorie";
import TableCategories from "./TableCategories";

// componente funcional da seçao de gerenciamento das categorias
const Categories: React.FC<{ onProductChange: () => void }> = ({
  onProductChange,
}) => {
  return (
    <div className="bg-white shadow-2xl rounded-2xl max-h-min items-center text-center">
      {/* titulo */}
      <h1 className="text-xl text-blaze-orange-500 font-semibold text-center">
        Gerenciar categorias
      </h1>
      {/* componente para criaçao de nova categoria */}
      <div>
        <FormNewCategorie onProductChange={onProductChange}/>
      </div>
      {/* tabelas de categorias disponiveis e deletadas "indisponiveis" */}
      <div className="h-[60vh] lg:h-[20vh] overflow-y-auto  shadow-2xl rounded-2xl px-2">
        <TableCategories onProductChange={onProductChange}/>
        <DeletedCategoriesTable onProductChange={onProductChange}/>
      </div>
    </div>
  );
}

export default Categories;
