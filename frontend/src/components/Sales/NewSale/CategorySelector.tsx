import React from "react";
import { Categoria } from "../../utils/types";

// Define as propriedades esperadas pelo componente CategorySelector
interface CategorySelectorProps {
  categorias: Categoria[]; // Array de categorias
  selectedCategory: string; // Categoria selecionada atualmente
  onCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Função chamada quando a categoria é alterada
}

// Define o componente CategorySelector como um componente funcional
const CategorySelector: React.FC<CategorySelectorProps> = ({
  categorias,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="text-left space-y-2 max-h-min">
      <label className="text-sm block">Categoria</label>
      <select
        value={selectedCategory}
        onChange={onCategoryChange}
        className="border border-black/20 rounded-lg max-w-60 h-8 lg:text-xs"
      >
        <option value="">Todas</option>
        {categorias.map(
          (
            categoria //mapeia todas as categoria
          ) => (
            <option key={categoria.id} value={categoria.id.toString()}>
              {categoria.nome}
            </option>
          )
        )}
      </select>
    </div>
  );
};

// Exporta o componente CategorySelector como padrão
export default CategorySelector;
