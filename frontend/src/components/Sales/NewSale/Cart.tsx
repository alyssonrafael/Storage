// Importa as bibliotecas React e os tipos necessários
import React from "react";
import { SaleProduct, Product } from "../../utils/types";

// Define as propriedades do componente Cart
interface CartProps {
  cart: SaleProduct[]; // Array de produtos no carrinho
  products: Product[]; // Array de todos os produtos disponíveis
  handleRemoveFromCart: (produtoId: number) => void; // Função para remover um produto do carrinho
}

// Define o componente Cart
const Cart: React.FC<CartProps> = ({
  cart,
  products,
  handleRemoveFromCart,
}) => (
  <div className="overflow-x-auto rounded-t-xl lg:h-[25vh] overflow-y-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="bg-blaze-orange-500 border-b text-white md:sticky md:top-0 z-10">
          <th className="py-2 px-4 text-sm font-semibold ">Produto</th>
          <th className="py-2 px-4 text-sm font-semibold ">Quantidade</th>
          <th className="py-2 px-4 text-sm font-semibold ">Valor Unitário</th>
          <th className="py-2 px-4 text-sm font-semibold ">Valor Total</th>
          <th className="py-2 px-4 text-sm font-semibold ">Remover</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item) => {
          // Encontra o produto correspondente no array de produtos
          const product = products.find(
            (product) => product.id === item.produtoId
          );
          // Calcula o valor total para o item no carrinho
          const totalPrice = product ? product.preco * item.quantidade : 0;
          return (
            <tr key={item.produtoId} className="border-b">
              <td className="border-b-2 border-blaze-orange-300 py-2 px-4">
                {product?.nome}
              </td>
              <td className="border-b-2 border-blaze-orange-300 py-2 px-4">
                {item.quantidade}
              </td>
              <td className="border-b-2 border-blaze-orange-300 py-2 px-4">
                {product?.preco.toFixed(2)}
              </td>
              <td className="border-b-2 border-blaze-orange-300 py-2 px-4">
                {totalPrice.toFixed(2)}
              </td>
              <td className="border-b-2 border-blaze-orange-300 py-2 px-4">
                {/* botao que remove o produto do carrinho */}
                <button
                  onClick={() => handleRemoveFromCart(item.produtoId)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  X
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// Exporta o componente Cart como padrão
export default Cart;
