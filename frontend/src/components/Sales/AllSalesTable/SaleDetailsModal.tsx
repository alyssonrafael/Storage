import React from "react";
import { Sale, Product } from "../../utils/types";

// interface das props do componente
interface SaleDetailsModalProps {
  sale: Sale;
  products: Product[];
  onClose: () => void;
}
// componente funcional com o modal com detalhes da venda
const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({ sale, products, onClose }) => {
  // recebe o id do produto e faz uma busca para encontrar os detalhes se nao encontrar retorna o produto nao encontrado
  const getProductDetails = (productId: number) => {
    const product = products.find((product) => product.id === productId);
    return product
      ? { nome: product.nome, preco: product.preco }
      : { nome: "Produto não encontrado", preco: 0 };
  };

  return (
    //retorno do modal com os detalhes da venda e dos produtos comprados
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">
          Detalhes da Venda - {sale.id}
        </h2>
        <p>Data de venda: {new Date(sale.data).toLocaleDateString("pt-BR")}</p>
        <p>Vendedor: {sale.user.name}</p>
        <p>Forma de Pagamento: {sale.formaDePagamento}</p>
        <p>Total: R${(sale.total + sale.desconto).toFixed(2)}</p>
        <p>Descontos: R${sale.desconto.toFixed(2)}</p>
        <hr />
        <p className="text-blaze-orange-500">Subtotal: R${sale.total.toFixed(2)}</p>
        <h1>Itens:</h1>
        {/* define um tamanho especifico e gera um scroll para que o modal nao fique desproporcional e a visualizaçao dos produdos nao seja afetada */}
        <div className="max-h-[35vh] overflow-y-auto">
          {sale.produtos.map((produto) => {//faz um map nos produtos que a venda tem pata obter seu id e poder fazer a comparaçao e trazer os detalhes
            const { nome, preco } = getProductDetails(produto.produtoId);
            return (
              <div key={produto.id} className="border-b py-2">
                <p>Nome do Produto: {nome}</p>
                <p>Quantidade: {produto.quantidade}</p>
                <p>Valor Unitário: R${preco.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blaze-orange-500 text-white rounded"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default SaleDetailsModal;
