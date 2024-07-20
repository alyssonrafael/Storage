import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer"; // Importa os componentes necessários da biblioteca @react-pdf/renderer para criar o PDF
import { Sale, Product } from "../utils/types"; // Importa os tipos Sale e Product
import logo from "/Storage.png"; // Importa o logo do storage

// Define os estilos para o PDF usando o StyleSheet do @react-pdf/renderer
const styles = StyleSheet.create({
  page: {
    flexDirection: "row", // Layout de página em linha (horizontal)
    backgroundColor: "#FFF", // Cor de fundo branca
    padding: 20, // Espaçamento interno da página
  },
  section: {
    margin: 10, // Margem ao redor da seção
    padding: 10, // Espaçamento interno da seção
    flexGrow: 1, // Permite que a seção cresça para preencher o espaço disponível
  },
  titleContainer: {
    flexDirection: "row", // Layout de título em linha (horizontal)
    alignItems: "center", // Alinha itens verticalmente ao centro
    marginBottom: 20, // Margem inferior para separar o título do conteúdo
  },
  titleText: {
    fontSize: 20, // Tamanho da fonte para o título
    fontWeight: "bold", // Fonte em negrito
    marginLeft: 10, // Margem esquerda para separar o texto do logo
  },
  titleLogo: {
    width: 40, // Largura do logo
    height: 40, // Altura do logo
    marginRight: 10, // Margem direita para separar o logo do texto
  },
  subtitle: {
    fontSize: 14, // Tamanho da fonte para subtítulos
    marginBottom: 10, // Margem inferior para separar subtítulos do conteúdo
    fontWeight: "bold", // Fonte em negrito
  },
  item: {
    marginBottom: 10, // Margem inferior para itens na lista
  },
  bold: {
    fontWeight: "bold", // Fonte em negrito (não usada no código, mas pode ser útil para futuros ajustes)
  },
});

// Define as propriedades esperadas pelo componente AllSalesPDF
interface AllSalesPDFProps {
  sale: Sale; // Dados da venda
  products: Product[]; // Lista de produtos
}

// Componente para gerar o PDF com os detalhes da venda
const AllSalesPDF: React.FC<AllSalesPDFProps> = ({ sale, products }) => {
  // Função para obter detalhes do produto com base no ID do produto
  const getProductDetails = (productId: number) => {
    const product = products.find((product) => product.id === productId);
    return product
      ? { nome: product.nome, preco: product.preco }
      : { nome: "Produto não encontrado", preco: 0 };
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {/* Título com logo e nome */}
          <View style={styles.titleContainer}>
            <Image style={styles.titleLogo} source={logo} />
            <Text style={styles.titleText}>
              Storage - Detalhes da Venda -{" "}
              {new Date(sale.data).toLocaleDateString("pt-BR")}
            </Text>
          </View>
          {/* Detalhes da venda */}
          <Text style={styles.subtitle}>Detalhes da Compra: </Text>
          <Text style={styles.item}>Código da Venda: {sale.id}</Text>
          <Text style={styles.item}>Vendedor {sale.user.name}</Text>
          <Text style={styles.item}>
            Forma de Pagamento: {sale.formaDePagamento}
          </Text>
          <Text style={styles.item}>Observação: {sale.observacao}</Text>

          {/* Lista de Produtos */}
          <Text style={styles.subtitle}>Produtos ------</Text>
          {sale.produtos.map((produto) => {
            const { nome, preco } = getProductDetails(produto.produtoId);
            return (
              <View key={produto.id} style={styles.item}>
                <View style={styles.item}>
                  <Text style={styles.item}>{nome}</Text>
                  <Text style={styles.item}>
                    Quantidade: {produto.quantidade}
                  </Text>
                  <Text style={styles.item}>
                    Preço Unitário: R${preco.toFixed(2)}
                  </Text>
                </View>
              </View>
            );
          })}
          <Text style={styles.item}>------------------------</Text>
          {/* Desconto e valor total */}
          <Text style={styles.item}>
            Total R${(sale.total + sale.desconto).toFixed(2)}
          </Text>
          <Text style={styles.item}>Desconto: R${sale.desconto}</Text>
          <Text style={styles.item}>
            Subtotal da Venda: R${sale.total.toFixed(2)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default AllSalesPDF;
