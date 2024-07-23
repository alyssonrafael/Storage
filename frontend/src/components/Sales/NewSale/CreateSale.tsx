import React, { useState, useEffect } from "react"; //estado e efeito para o componente
import axios from "axios"; //axios para requisiçoes
import { PiShoppingCartLight, PiCheck } from "react-icons/pi"; //icones do react-icons
import {
  Categoria,
  Product,
  SaleProduct,
  SaleRequest,
} from "../../utils/types"; //importaçao dos tipos
import { decodeToken } from "../../utils/tokenUtils"; //funçao para decodificar o token
import MensagemCard from "../../MessageCard"; //componente MensagemCard para mensagens de feedback
//componentes filhos que fazem toda a sessao de venda
import ProductSelector from "./ProductSeletor";
import QuantityInput from "./QuantityInput";
import Cart from "./Cart";
import DiscountInput from "./DiscountInput";
import PaymentMethodSelector from "./PaymentmethodSelector";
import SaleSummary from "./SaleSummary";
import CategorySelector from "./CategorySelector";

// Componente principal para criação de vendas
const CreateSale: React.FC<{ onSalesChange: () => void }> = ({
  onSalesChange,
}) => {
  // Estado para armazenar os produtos
  const [products, setProducts] = useState<Product[]>([]);
  // Estado para armazenar as categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  // Estado para a categoria selecionada
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  // Estado para o produto selecionado
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // Estado para a quantidade de produtos
  const [quantity, setQuantity] = useState<number>(1);
  // Estado para o carrinho de compras
  const [cart, setCart] = useState<SaleProduct[]>([]);
  // Estado para o desconto aplicado
  const [discount, setDiscount] = useState<number>(0);
  // Estado para a observação da venda
  const [observation, setObservation] = useState<string>("");
  // Estado para o método de pagamento
  const [paymentMethod, setPaymentMethod] = useState<string>("dinheiro");
  // Estado para mensagens de erro
  const [errorMessage, setErrorMessage] = useState<string>("");
  // Estado para o ID do usuário
  const [userId, setUserId] = useState<string>("");
  // Estado para armazenar a mensagem de sucesso ou erro
  const [mensagem, setMensagem] = useState({ sucesso: false, texto: "" });
  // Contador para forçar a atualização do componente de mensagem
  const [mensagemCount, setMensagemCount] = useState(0);

  //efeito para resgatar o token do localstorage e decodificar
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
        axios
          .get(`http://localhost:3333/api/user/${decoded.userId}`, config)
          .then((response) => {
            setUserId(response.data.id);
          })
          .catch((error) => console.error("Erro ao buscar usuário:", error));
      }
    }
  }, []);
  // Hook para buscar os produtos e categorias
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(
          "http://localhost:3333/api/produtos"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get<Categoria[]>(
          "http://localhost:3333/api/categorias"
        );
        // Filtra as categorias para manter apenas aquelas com deleted: false
        const filteredCategorias = response.data.filter(
          //filtra apenas as categoria disponiveis
          (categoria) => !categoria.deleted
        );
        setCategorias(filteredCategorias);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchProducts();
    fetchCategorias();
  }, [onSalesChange]); // monitora o onsaleschange passado no componente pai para manter a integridade dos dados disponiveis de acordo com açoes da outra tabela
  // Função para lidar com a mudança de categoria selecionada
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
    setSelectedProduct(null);
  };
  // Função para adicionar um produto ao carrinho
  const handleAddToCart = () => {
    // Verifica se um produto foi selecionado
    if (!selectedProduct) return;
    // Verifica se o produto está marcado como deletado ou não está disponível para venda
    if (selectedProduct.deleted || !selectedProduct.disponivel) {
      // Define a mensagem de erro informando que o produto não está disponível
      setErrorMessage("Este produto não está disponível para venda.");
      return;
    }
    // Encontra o índice do produto no carrinho, se já existir
    const existingProductIndex = cart.findIndex(
      (item) => item.produtoId === selectedProduct.id
    );
    // Verifica se o produto já está no carrinho
    const productInCart =
      existingProductIndex !== -1 ? cart[existingProductIndex] : null;
    // Calcula a quantidade total do produto no carrinho após adicionar a nova quantidade
    const totalQuantityInCart = productInCart
      ? productInCart.quantidade + (quantity || 1) // Se o produto já estiver no carrinho, soma a quantidade atual com a nova quantidade
      : quantity; // Se o produto não estiver no carrinho, usa a quantidade atual
    // Verifica se a quantidade total no carrinho excede a quantidade disponível em estoque
    if (totalQuantityInCart > selectedProduct.quantidade) {
      // Define a mensagem de erro informando a quantidade disponível em estoque
      setErrorMessage(
        `A quantidade em estoque disponível para o produto ${selectedProduct.nome} é de ${selectedProduct.quantidade} und.`
      );
      return;
    }
    // Se o produto já estiver no carrinho, atualiza a quantidade
    if (existingProductIndex !== -1) {
      // Cria uma cópia do carrinho
      const updatedCart = [...cart];
      // Atualiza a quantidade do produto no carrinho
      updatedCart[existingProductIndex].quantidade += quantity || 1;
      // Define o carrinho atualizado no estado
      setCart(updatedCart);
    } else {
      // Se o produto não estiver no carrinho, adiciona-o ao carrinho
      setCart([
        ...cart,
        {
          produtoId: selectedProduct.id, // ID do produto
          quantidade: quantity || 1, // Quantidade do produto
        },
      ]);
    }
    // Redefine a quantidade para 1
    setQuantity(1);
    // Limpa a mensagem de erro
    setErrorMessage("");
  };
  // Função para remover um produto do carrinho
  const handleRemoveFromCart = (produtoId: number) => {
    // Filtra o carrinho para remover o item com o produtoId especificado
    const updatedCart = cart.filter((item) => item.produtoId !== produtoId);
    // Atualiza o estado do carrinho com o novo carrinho filtrado
    setCart(updatedCart);
  };

  // Função para lidar com a mudança do valor de desconto
  const handleDiscountChange = (value: string) => {
    // Converte o valor de desconto de string para número, ou usa 0 se a conversão falhar
    const numberValue = parseFloat(value) || 0;
    // Calcula o valor total dos produtos no carrinho
    const totalValue = cart.reduce((acc, item) => {
      // Encontra o produto correspondente ao item no carrinho
      const product = products.find((product) => product.id === item.produtoId);
      // Se o produto for encontrado, adiciona o preço total (preço x quantidade) ao acumulador
      return acc + (product ? product.preco * item.quantidade : 0);
    }, 0);
    // Verifica se o valor de desconto é maior que o valor total da compra
    if (numberValue > totalValue) {
      // Define uma mensagem de erro se o desconto for maior que o valor total
      setErrorMessage(
        "O desconto não pode ser maior que o valor total da compra."
      );
      // Reseta o valor do desconto para 0
      setDiscount(0);
      return;
    }
    // Define o valor do desconto
    setDiscount(numberValue);
    // Limpa a mensagem de erro
    setErrorMessage("");
  };

  //função que cria a venda
  const handleCreateSale = async () => {
    // Verifica se o carrinho está vazio
    if (cart.length === 0) {
      setErrorMessage("Adicione pelo menos um produto ao carrinho.");
      return;
    }
    // Redefine a mensagem antes da exclusão
    setMensagem({ sucesso: false, texto: "" });
    // Incrementa o contador de mensagens para forçar a atualização do componente MensagemCard
    setMensagemCount(mensagemCount + 1);
    // Calcula o valor total dos produtos no carrinho
    const totalValue = cart.reduce((acc, item) => {
      const product = products.find((product) => product.id === item.produtoId);
      return acc + (product ? product.preco * item.quantidade : 0);
    }, 0);
    // Verifica se o desconto é válido (não menor que 0 e não maior que o valor total)
    if (discount < 0 || discount > totalValue) {
      setErrorMessage(
        "O desconto não pode ser menor que 0 ou maior que o valor total da compra."
      );
      return;
    }
    // Cria um objeto de solicitação de venda
    const saleRequest: SaleRequest = {
      userId,
      produtos: cart,
      desconto: discount || 0,
      observacao: observation,
      formaDePagamento: paymentMethod,
    };
    // Verifica se as quantidades no carrinho são válidas
    for (const item of cart) {
      const product = products.find((product) => product.id === item.produtoId);
      if (product && item.quantidade > product.quantidade) {
        setErrorMessage(
          `A quantidade disponível para ${product.nome} é ${product.quantidade}.`
        );
        return;
      }
    }
    try {
      // Tenta enviar a solicitação de venda para o servidor
      await axios.post("http://localhost:3333/api/vendas", saleRequest);
      // Reseta os estados do formulário após a venda ser criada com sucesso
      setCart([]);
      setSelectedProduct(null);
      setDiscount(0);
      setObservation("");
      setPaymentMethod("dinheiro");
      setErrorMessage("");
      onSalesChange(); // Atualiza a lista de vendas
      setMensagem({ sucesso: true, texto: "venda realizada com sucesso" }); //mensagem de feedback
    } catch (error) {
      // Define uma mensagem de erro se a criação da venda falhar
      setMensagem({ sucesso: false, texto: "Erro ao criar venda" }); //mensagem de feedback
      setErrorMessage("Erro ao criar venda. Tente novamente.");
    }
  };
  //constante que calcula o valor total do carinho
  const totalValue = cart.reduce((acc, item) => {
    const product = products.find((product) => product.id === item.produtoId);
    return acc + (product ? product.preco * item.quantidade : 0);
  }, 0);
  //constante subtotal para saber o valor total com desconto
  const subtotal = totalValue - discount;

  // Filtra os produtos com base na categoria selecionada
  const filteredProducts = selectedCategory
    ? // Se houver uma categoria selecionada, filtra os produtos para incluir apenas aqueles que pertencem à categoria selecionada
      products.filter(
        (product) => product.categoriaId === parseInt(selectedCategory)
      )
    : // Se nenhuma categoria estiver selecionada, inclui todos os produtos
      products;

  return (
    <div>
      {/* titulo */}
      <h1 className="text-2xl md:text-left text-blaze-orange-500 font-medium mb-4">
        Criar Nova Venda
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      </h1>
      {/* sesao com a seleçao de produto e quantidade */}
      <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0 justify-start items-center">
        {/* componente de seleçao de produtos */}
        <ProductSelector
          products={filteredProducts}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
        {/* componente de seleçao de categoria caso necessario */}
        <CategorySelector
          categorias={categorias}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        {/* componente de quantidade de itens */}
        <QuantityInput quantity={quantity} setQuantity={setQuantity} />
        {/* botao que chama a funçao que adiciona o produto ao carrinho */}
        <button
          onClick={handleAddToCart}
          className="text-white text-2xl md:self-end font-bold bg-blaze-orange-500 rounded-xl w-20 h-9 md:max-w-32"
        >
          +
        </button>
      </div>
      {/* divisor */}
      <hr className="my-6 border border-blaze-orange-300" />
      {/* sessao com o icone do carinho o valor subtotal da venda e o botao para finalizar a venda */}
      <div className="font-bold flex justify-between mb-4">
        <div className="flex">
          <PiShoppingCartLight className="text-5xl " />
          <div className="space-x-4">
            <h1 className="text-xl">Carrinho</h1>
            <p className="text-base">
              <strong className="text-blaze-orange-500">Subtotal: </strong>R$
              {subtotal.toFixed(2)}
            </p>
          </div>
        </div>
        <button
          onClick={handleCreateSale}
          className="text-white bg-blaze-orange-500 md:p-6 p-2 rounded-xl h-10 flex justify-center items-center font-light w-full text-xs md:text-lg md:max-w-56"
        >
          <PiCheck className="text-xl md:text-2xl font-extrabold m-2" />
          Finalizar Venda
        </button>
      </div>
      {/* tabela que mostra os produtos no carrinho */}
      <Cart
        cart={cart}
        products={products}
        handleRemoveFromCart={handleRemoveFromCart}
      />
      {/* divisor */}
      <hr className="my-6 border border-blaze-orange-300 md:hidden block" />
      {/* sessao final com os capos de seleçao para forma de pagamento desconto e observaçao */}
      <div className="flex md:flex-row flex-col md:justify-between items-center my-2">
        <div className="space-y-2">
          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
          <DiscountInput
            discount={discount}
            handleDiscountChange={handleDiscountChange}
          />
        </div>
        <div className="md:text-left space-y-2 mt-4 md:mt-0">
          <label className="text-sm block">Observação:</label>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="border border-black/20 rounded-lg p-2 w-full max-h-16"
            placeholder="alguma observação"
          />
        </div>
        {/* sumario com o total disconto e subtotal */}
        <SaleSummary
          subtotal={subtotal}
          totalValue={totalValue}
          discount={discount}
        />
        {/* botao para finalizar apenas em telas pequenas para facilitar */}
        <button
          onClick={handleCreateSale}
          className="text-white bg-blaze-orange-500 md:hidden md:p-6 p-2 rounded-xl h-10 flex justify-center items-center font-light w-full text-xs md:max-w-56 mt-6 md:mt-0"
        >
          <PiCheck className="text-xl font-extrabold m-2" />
          Finalizar Venda
        </button>
      </div>
      {/* componente de mensagem para feedback */}
      <MensagemCard
        sucesso={mensagem.sucesso}
        mensagem={mensagem.texto}
        key={mensagemCount} // Chave para forçar a atualização do componente MensagemCard
      />
    </div>
  );
};

export default CreateSale;
