    import React from "react";
    import {
      Page,
      Text,
      View,
      Document,
      StyleSheet,
      Image,
    } from "@react-pdf/renderer"; //utiliza essa biblioteca para criar documentos pdf
    import { Sale } from "../utils/types"; // Importe Sale para usar como tipo de data

    import logo from "/Storage.png"; // logo do storage

    //estilos do pdf
    const styles = StyleSheet.create({
      page: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        padding: 20,
      },
      section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
      },
      titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20, 
      },
      titleText: {
        fontSize: 20, 
        fontWeight: "bold",
        marginLeft: 10,
      },
      titleLogo: {
        width: 40, 
        height: 40,
        marginRight: 10, 
      },
      subtitle: {
        fontSize: 14,
        marginBottom: 10,
        fontWeight: "bold",
      },
      item: {
        marginBottom: 10, 
      },
    });
   //componente funcional que recebe o data como props
    const SalesPDF: React.FC<{ data: Sale }> = ({ data }) => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {/* Título com logo e nome */}
            <View style={styles.titleContainer}>
              <Image style={styles.titleLogo} source={logo} />
              <Text style={styles.titleText}>
                Storage - Detalhes da Venda -{" "}
                {new Date(data.data).toLocaleDateString()}
              </Text>
            </View>

            {/* Detalhes da Venda */}
            <Text style={styles.subtitle}>Detalhes da Compra:</Text>
            <Text style={styles.item}>Código da Venda: {data.id}</Text>
            <Text style={styles.item}>Vendedor: {data.user.name}</Text>
            <Text style={styles.item}>
              Tipo de Pagamento: {data.formaDePagamento}
            </Text>
            <Text style={styles.item}>Observação: {data.observacao}</Text>

            {/* Lista de Produtos */}
            <Text style={styles.subtitle}>Produtos -------</Text>
            {data.produtos.map((produto) => (
              <View key={produto.id} style={styles.item}>
                <Text>{produto.produto.nome}</Text>
                <Text>Quantidade: {produto.quantidade}</Text>
                <Text>Preço Unitário: R${produto.produto.preco.toFixed(2)}</Text>
              </View>
            ))}

            {/* Desconto e Valor Total da Venda */}
            <Text style={styles.item}>Desconto: R${data.desconto}</Text>
            <Text style={styles.item}>
              Valor Total da Venda: R${data.total.toFixed(2)}
            </Text>
          </View>
        </Page>
      </Document>
    );

    export default SalesPDF;
