const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//inportaçoes para gerar os relatorios em exel
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const dayjs = require("dayjs");

const getDailySales = async (req, res) => {
  // Inicialização das datas: startOfDay e endOfDay
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // Define a hora para 00:00:00.000

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // Define a hora para 23:59:59.999

  try {
    // Consulta ao banco de dados para contar as vendas do dia
    const vendasDoDia = await prisma.venda.count({
      where: {
        data: {
          gte: startOfDay, // Data maior ou igual a startOfDay
          lte: endOfDay, // Data menor ou igual a endOfDay
        },
        deleted: false, // Vendas não marcadas como excluídas
      },
    });

    res.status(200).json({ vendasDoDia });
  } catch (error) {
    // Tratamento de erros: retorna mensagem de erro
    res.status(500).json({ error: error.message });
  }
};

const getMonthlySales = async (req, res) => {
  // Inicialização do início do mês
  const startOfMonth = new Date();
  startOfMonth.setDate(1); // Define o dia como o primeiro dia do mês atual
  startOfMonth.setHours(0, 0, 0, 0); // Define o horário como 00:00:00.000
  // Inicialização do final do mês
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Avança para o próximo mês
  endOfMonth.setDate(0); // Define o dia como o último dia do mês anterior
  endOfMonth.setHours(23, 59, 59, 999); // Define o horário como 23:59:59.999

  try {
    // Consulta ao banco de dados para contar as vendas do mês
    const vendasDoMes = await prisma.venda.count({
      where: {
        data: {
          gte: startOfMonth, // Data da venda maior ou igual a startOfMonth
          lte: endOfMonth, // Data da venda menor ou igual a endOfMonth
        },
        deleted: false, // Exclui vendas marcadas como excluídas
      },
    });

    res.status(200).json({ vendasDoMes });
  } catch (error) {
    // Tratamento de erros: retorna uma mensagem de erro
    res.status(500).json({ error: error.message });
  }
};

const getAnnualSales = async (req, res) => {
  // Inicialização do início do ano
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  // Define o dia como 1º de janeiro do ano atual
  // Inicialização do final do ano
  const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);
  // Define o dia como 31 de dezembro do ano atual e o horário como 23:59:59.999
  try {
    // Consulta ao banco de dados para contar as vendas do ano
    const vendasDoAno = await prisma.venda.count({
      where: {
        data: {
          gte: startOfYear, // Data da venda maior ou igual ao início do ano
          lte: endOfYear, // Data da venda menor ou igual ao final do ano
        },
        deleted: false, // Exclui vendas marcadas como excluídas
      },
    });

    res.status(200).json({ vendasDoAno });
  } catch (error) {
    // Tratamento de erros: retorna uma mensagem de erro
    res.status(500).json({ error: error.message });
  }
};

const getTopCategoryOfDay = async (req, res) => {
  // Inicialização do início do dia
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // Define o horário como 00:00:00.000

  // Inicialização do final do dia
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999); // Define o horário como 23:59:59.999

  try {
    // Consulta ao banco de dados para obter a categoria com mais vendas no dia
    const topCategory = await prisma.vendaProduto.groupBy({
      by: ["produtoId"],
      _sum: {
        quantidade: true,
      },
      where: {
        venda: {
          data: {
            gte: startOfDay, // Data da venda maior ou igual ao início do dia
            lte: endOfDay, // Data da venda menor ou igual ao final do dia
          },
          deleted: false, // Exclui vendas marcadas como excluídas
        },
      },
      orderBy: {
        _sum: {
          quantidade: "desc", // Ordena pela quantidade de vendas em ordem decrescente
        },
      },
      take: 1,
    });

    if (topCategory.length === 0) {
      // Se não houver vendas, retorna categoria nula e total vendido zero
      return res.status(200).json({ categoria: null, totalVendido: 0 });
    }
    // Obtém informações do produto associado à categoria
    const produto = await prisma.produto.findUnique({
      where: { id: topCategory[0].produtoId },
      include: { categoria: true }, // Inclui informações da categoria
    });
    // Retorna a categoria e o total vendido
    res.status(200).json({
      categoria: produto.categoria.nome,
      totalVendido: topCategory[0]._sum.quantidade,
    });
  } catch (error) {
    // Tratamento de erros: retorna uma mensagem de erro
    res.status(500).json({ error: error.message });
  }
};

const getTopCategoryOfMonth = async (req, res) => {
  // Inicialização do início do mês
  const startOfMonth = new Date();
  startOfMonth.setDate(1); // Define o dia como o primeiro dia do mês atual
  startOfMonth.setHours(0, 0, 0, 0); // Define o horário como 00:00:00.000
  // Inicialização do final do mês
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Avança para o próximo mês
  endOfMonth.setDate(0); // Define o dia como o último dia do mês anterior
  endOfMonth.setHours(23, 59, 59, 999); // Define o horário como 23:59:59.999

  try {
    // Consulta ao banco de dados para obter a categoria com mais vendas no mês
    const topCategory = await prisma.vendaProduto.groupBy({
      by: ["produtoId"],
      _sum: {
        quantidade: true,
      },
      where: {
        venda: {
          data: {
            gte: startOfMonth, // Data da venda maior ou igual ao início do mês
            lte: endOfMonth, // Data da venda menor ou igual ao final do mês
          },
          deleted: false, // Exclui vendas marcadas como excluídas
        },
      },
      orderBy: {
        _sum: {
          quantidade: "desc", // Ordena pela quantidade de vendas em ordem decrescente
        },
      },
      take: 1,
    });

    if (topCategory.length === 0) {
      // Se não houver vendas, retorna categoria nula e total vendido zero
      return res.status(200).json({ categoria: null, totalVendido: 0 });
    }
    // Obtém informações do produto associado à categoria
    const produto = await prisma.produto.findUnique({
      where: { id: topCategory[0].produtoId },
      include: { categoria: true }, // Inclui informações da categoria
    });
    // Retorna a categoria e o total vendido
    res.status(200).json({
      categoria: produto.categoria.nome,
      totalVendido: topCategory[0]._sum.quantidade,
    });
  } catch (error) {
    // Tratamento de erros: retorna uma mensagem de erro
    res.status(500).json({ error: error.message });
  }
};

const getTopCategoryOfYear = async (req, res) => {
  // Inicialização do início do ano
  const startOfYear = new Date();
  startOfYear.setMonth(0, 1); // Define o mês como janeiro e o dia como 1
  startOfYear.setHours(0, 0, 0, 0); // Define o horário como 00:00:00.000

  // Inicialização do final do ano
  const endOfYear = new Date(startOfYear);
  endOfYear.setFullYear(startOfYear.getFullYear() + 1); // Avança para o próximo ano
  endOfYear.setMonth(0, 0); // Define o mês como janeiro e o dia como 0 (último dia de dezembro)
  endOfYear.setHours(23, 59, 59, 999); // Define o horário como 23:59:59.999

  try {
    // Consulta ao banco de dados para obter a categoria com mais vendas no ano
    const topCategory = await prisma.vendaProduto.groupBy({
      by: ["produtoId"],
      _sum: {
        quantidade: true,
      },
      where: {
        venda: {
          data: {
            gte: startOfYear, // Data da venda maior ou igual ao início do ano
            lte: endOfYear, // Data da venda menor ou igual ao final do ano
          },
          deleted: false, // Exclui vendas marcadas como excluídas
        },
      },
      orderBy: {
        _sum: {
          quantidade: "desc", // Ordena pela quantidade de vendas em ordem decrescente
        },
      },
      take: 1,
    });

    if (topCategory.length === 0) {
      // Se não houver vendas, retorna categoria nula e total vendido zero
      return res.status(200).json({ categoria: null, totalVendido: 0 });
    }
    // Obtém informações do produto associado à categoria
    const produto = await prisma.produto.findUnique({
      where: { id: topCategory[0].produtoId },
      include: { categoria: true }, // Inclui informações da categoria
    });
    // Retorna a categoria e o total vendido
    res.status(200).json({
      categoria: produto.categoria.nome,
      totalVendido: topCategory[0]._sum.quantidade,
    });
  } catch (error) {
    // Tratamento de erros: retorna uma mensagem de erro
    res.status(500).json({ error: error.message });
  }
};

const getTotalSalesOfDay = async (req, res) => {
  // Inicialização do início do dia
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // Define o horário como 00:00:00.000

  // Inicialização do final do dia
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999); // Define o horário como 23:59:59.999

  try {
    // Consulta ao banco de dados para obter o total de vendas no dia
    const totalSales = await prisma.venda.aggregate({
      _sum: {
        total: true, // Soma dos valores totais das vendas
      },
      where: {
        data: {
          gte: startOfDay, // Data da venda maior ou igual ao início do dia
          lte: endOfDay, // Data da venda menor ou igual ao final do dia
        },
        deleted: false, // Exclui vendas marcadas como excluídas
      },
    });

    res.status(200).json({ totalSales: totalSales._sum.total || 0 });
    // Retorna o total de vendas ou 0 se não houver vendas no período
  } catch (error) {
    // Tratamento de erros: retorna uma mensagem de erro
    res.status(500).json({ error: error.message });
  }
};

const getTotalSalesOfMonth = async (req, res) => {
  // Inicialização do início do mês
  const startOfMonth = new Date();
  startOfMonth.setDate(1); // Define o dia como o primeiro dia do mês atual
  startOfMonth.setHours(0, 0, 0, 0); // Define o horário como 00:00:00.000
  // Inicialização do final do mês
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Avança para o próximo mês
  endOfMonth.setDate(0); // Define o dia como o último dia do mês anterior
  endOfMonth.setHours(23, 59, 59, 999); // Define o horário como 23:59:59.999

  try {
    // Consulta ao banco de dados para obter o total de vendas no mês
    const totalSales = await prisma.venda.aggregate({
      _sum: {
        total: true, // Soma dos valores totais das vendas
      },
      where: {
        data: {
          gte: startOfMonth, // Data da venda maior ou igual ao início do mês
          lte: endOfMonth, // Data da venda menor ou igual ao final do mês
        },
        deleted: false, // Exclui vendas marcadas como excluídas
      },
    });

    res.status(200).json({ totalSales: totalSales._sum.total || 0 });
    // Retorna o total de vendas ou 0 se não houver vendas no período
  } catch (error) {
    // Tratamento de erros: retorna uma mensagem de erro
    res.status(500).json({ error: error.message });
  }
};

const getTotalSalesOfYear = async (req, res) => {
  // Inicialização do início do ano
  const startOfYear = new Date();
  startOfYear.setMonth(0, 1); // Define o mês como janeiro e o dia como 1
  startOfYear.setHours(0, 0, 0, 0); // Define o horário como 00:00:00.000

  // Inicialização do final do ano
  const endOfYear = new Date(startOfYear);
  endOfYear.setFullYear(startOfYear.getFullYear() + 1); // Avança para o próximo ano
  endOfYear.setMonth(0, 0); // Define o mês como janeiro e o dia como 0 (último dia de dezembro)
  endOfYear.setHours(23, 59, 59, 999); // Define o horário como 23:59:59.999

  try {
    // Consulta ao banco de dados para obter o total de vendas no ano
    const totalSales = await prisma.venda.aggregate({
      _sum: {
        total: true, // Soma dos valores totais das vendas
      },
      where: {
        data: {
          gte: startOfYear, // Data da venda maior ou igual ao início do ano
          lte: endOfYear, // Data da venda menor ou igual ao final do ano
        },
        deleted: false, // Exclui vendas marcadas como excluídas
      },
    });

    res.status(200).json({ totalSales: totalSales._sum.total || 0 });
    // Retorna o total de vendas ou 0 se não houver vendas no período
  } catch (error) {
    // Tratamento de erros: retorna uma mensagem de erro
    res.status(500).json({ error: error.message });
  }
};

const getProductsSoldByCategory = async (req, res) => {
  try {
    // Consulta ao banco de dados para obter a quantidade total de cada produto vendido
    const productsSold = await prisma.vendaProduto.groupBy({
      by: ["produtoId"],
      _sum: {
        quantidade: true,
      },
      where: {
        venda: {
          deleted: false, // Exclui vendas marcadas como excluídas
        },
      },
    });
    // Consulta ao banco de dados para obter informações dos produtos, incluindo a categoria
    const products = await prisma.produto.findMany({
      where: {
        id: {
          in: productsSold.map((prod) => prod.produtoId),
        },
      },
      include: {
        categoria: true, // Inclui informações da categoria
      },
    });
    // Calcula as vendas por categoria
    const categorySales = products.reduce((acc, product) => {
      //usa o reduce para interar sobre os itens do array produto
      const soldQuantity = productsSold.find(
        //intera no objeto no array no qual o produtoid corresponda ao id do produto atual
        (sold) => sold.produtoId === product.id
      )._sum.quantidade; //obtem a quantidade vendida do produto
      const categoryName = product.categoria.nome; //armazena o nome da categoria associada ao produto
      //e um acomulador que se nao ouver a categoria ele a cria e coloca a quantidade se ja hover ele soma a quantidade encontrada ao valor ja existente
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += soldQuantity;

      return acc; // pro fim ele retorna esse array com a categoria e a quantidade de vendas
    }, {});

    res.status(200).json(categorySales);
  } catch (error) {
    // Tratamento de erros: retorna uma mensagem de erro
    res.status(500).json({ error: error.message });
  }
};

// Função para garantir que o diretório existe
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

const getProductsReport = async (req, res) => {
  const { categoriaId, disponivel } = req.query; //recebe por parametro o id da categoria e o bollean disponivel
  try {
    // Preparando os filtros para a consulta
    const filters = {};

    if (categoriaId) {
      filters.categoriaId = parseInt(categoriaId); // Convertendo para número inteiro
    }

    if (disponivel !== undefined) {
      filters.disponivel = disponivel === "true"; // Convertendo string 'true'/'false' para booleano
    }

    // Consultando os produtos com base nos filtros
    const produtos = await prisma.produto.findMany({
      where: {
        ...filters,
        deleted: false, //apenas produtos nao deletados
      },
      include: {
        categoria: true, // Incluindo a informação da categoria
      },
    });

    // Geração do arquivo Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório de Produtos");

    //montagem da tabela (titulos)
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nome", key: "nome", width: 30 },
      { header: "Categoria", key: "categoria", width: 30 },
      { header: "Disponível", key: "disponivel", width: 15 },
      { header: "Preço", key: "preco", width: 15 },
      { header: "Quantidade em Estoque", key: "quantidade", width: 20 },
    ];
    //adicionando linhas a tabela
    produtos.forEach((produto) => {
      worksheet.addRow({
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria.nome,
        disponivel: produto.disponivel ? "Sim" : "Não",
        preco: produto.preco.toFixed(2),
        quantidade: produto.quantidade,
      });
    });

    const filePath = path.join(__dirname, "temp", "relatorio-produtos.xlsx");
    ensureDirectoryExistence(filePath); // Garante que o diretório existe
    await workbook.xlsx.writeFile(filePath);

    // Enviar o arquivo para download
    res.download(filePath, "relatorio-produtos.xlsx", (err) => {
      if (err) {
        console.error("Erro ao baixar o arquivo:", err);
        res.status(500).send("Erro ao baixar o arquivo.");
      } else {
        fs.unlinkSync(filePath); // Remove o arquivo após o download
      }
    });
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).json({ error: error.message }); // Retorna erro se ocorrer uma exceção
  }
};

const getSalesReport = async (req, res) => {
  const { startDate, endDate, formaDePagamento } = req.query; // Extrai parâmetros da query string

  try {
    // Converta startDate e endDate para o início e fim do dia, respectivamente
    const start = startDate
      ? dayjs(startDate).startOf("day").toDate()
      : undefined;
    const end = endDate ? dayjs(endDate).endOf("day").toDate() : undefined;

    // Consultando as vendas com base nos filtros
    const vendas = await prisma.venda.findMany({
      where: {
        data: {
          gte: start, // Maior ou igual a startDate
          lte: end, // Menor ou igual a endDate
        },
        deleted: false, // Exclui vendas marcadas como deletadas
        formaDePagamento: formaDePagamento || undefined, // Filtro opcional por forma de pagamento
      },
      include: {
        produtos: {
          include: {
            produto: true, // Inclui detalhes do produto
          },
        },
        user: true, // Inclui detalhes do usuário
      },
    });

    // Verifica se o formato solicitado é Excel
    if (req.query.formato === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Relatório de Vendas");

      // Definindo as colunas da planilha
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Data", key: "data", width: 20 },
        { header: "Total", key: "total", width: 15 },
        { header: "Desconto", key: "desconto", width: 15 },
        { header: "Usuário", key: "user", width: 20 },
        { header: "Forma de Pagamento", key: "formaDePagamento", width: 20 },
        {
          header: "Total Produtos Vendidos",
          key: "totalProductsSold",
          width: 25,
        },
        { header: "Observação", key: "observacao", width: 30 },
        { header: "Detalhes dos Produtos", key: "productsDetails", width: 50 },
      ];

      // Adicionando os dados das vendas à planilha
      vendas.forEach((venda) => {
        // Calcula o total de produtos vendidos
        const totalProductsSold = venda.produtos.reduce(
          (sum, vendaProduto) => sum + vendaProduto.quantidade,
          0
        );

        // Detalhes dos produtos vendidos formatados como string
        const productsDetailsStr = venda.produtos
          .map((vendaProduto) => {
            const produto = vendaProduto.produto;
            return `Produto ID: ${produto.id}, Nome: ${
              produto.nome
            }, Quantidade: ${
              vendaProduto.quantidade
            }, Preço: R$${produto.preco.toFixed(2)}, Total: R$${(
              vendaProduto.quantidade * produto.preco
            ).toFixed(2)}`;
          })
          .join("; ");

        // Adiciona uma linha à planilha
        worksheet.addRow({
          id: venda.id,
          data: dayjs(venda.data).format("YYYY-MM-DD"), // Formata a data para 'YYYY-MM-DD'
          total: venda.total.toFixed(2),
          desconto: venda.desconto.toFixed(2),
          user: venda.user.name,
          formaDePagamento: venda.formaDePagamento,
          totalProductsSold,
          observacao: venda.observacao || "Nenhuma observação",
          productsDetails: productsDetailsStr || "Nenhum detalhe disponível",
        });
      });

      // Define o caminho do arquivo
      const filePath = path.join(__dirname, "relatorio-vendas.xlsx");
      await workbook.xlsx.writeFile(filePath); // Salva o arquivo Excel

      // Envia o arquivo para download
      res.download(filePath, "relatorio-vendas.xlsx", (err) => {
        if (err) {
          console.error("Erro ao baixar o arquivo:", err);
          res.status(500).send("Erro ao baixar o arquivo.");
        } else {
          fs.unlinkSync(filePath); // Remove o arquivo após o download
        }
      });
    } else {
      res.status(400).send("Formato não suportado."); // Responde com erro se o formato não for suportado
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna erro se ocorrer uma exceção
  }
};

const getUltimasVendas = async (req, res) => {
  try {
    // Busca as últimas 4 vendas no banco de dados
    const vendas = await prisma.venda.findMany({
      where: { deleted: false }, // Filtra apenas vendas não deletadas
      orderBy: { createdAt: "desc" }, // Ordena por data de criação decrescente
      take: 5, // Limita o resultado a 5 registros
      include: {
        produtos: {
          // Inclui os produtos associados à venda
          include: {
            produto: true, // Inclui os detalhes do produto associado
          },
        },
        user: true, // Inclui os detalhes do usuário que realizou a venda
      },
    });

    // contagem de produtos vendidos a cada venda
    const vendasComContagem = vendas.map((venda) => ({
      ...venda,
      totalProdutos: venda.produtos.reduce(
        (total, prod) => total + prod.quantidade,
        0
      ),
    }));

    // Retorna as vendas encontradas em formato JSON com a contagem de produtos vendidos
    res.status(200).json(vendasComContagem);
  } catch (error) {
    // Retorna um erro 500 caso ocorra algum problema na consulta ao banco de dados
    res.status(500).json({ error: error.message });
  }
};

const getVendasTendencia = async (req, res) => {
  try {
    // Calcula a data de 6 meses atrás a partir da data atual
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Obtém todas as vendas que não foram deletadas e que ocorreram desde 6 meses atrás
    const vendas = await prisma.venda.findMany({
      where: {
        deleted: false, // Filtra para incluir apenas vendas que não foram deletadas
        createdAt: {
          gte: sixMonthsAgo, // Inclui apenas vendas a partir da data calculada
        },
      },
      select: {
        createdAt: true, // Seleciona a data da venda
        total: true, // Seleciona o valor total da venda
      },
    });

    // Agrupa as vendas por mês e ano
    const vendasPorMes = vendas.reduce((acc, venda) => {
      const date = new Date(venda.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Ajusta o mês para 1-12 (1 = Janeiro, 2 = Fevereiro, etc.)
      const key = `${year}-${month.toString().padStart(2, "0")}`; // Cria uma chave no formato YYYY-MM

      // Inicializa a chave no acumulador se ainda não existir
      if (!acc[key]) {
        acc[key] = 0;
      }

      // Certifica-se de que o valor total é um número e não é nulo
      const valorTotal = venda.total !== null ? Number(venda.total) : 0;
      acc[key] += valorTotal; // Soma o valor total da venda ao acumulador para o mês específico
      return acc;
    }, {});

    // Ordena as chaves (meses) em ordem cronológica
    const sortedKeys = Object.keys(vendasPorMes).sort();
    // Formata as categorias como MM-YYYY para exibição no gráfico
    const categories = sortedKeys.map((key) => {
      const [year, month] = key.split("-");
      return `${month}-${year}`; // Formato MM-YYYY
    });
    // Formata os valores para 2 casas decimais
    const values = sortedKeys.map((key) => vendasPorMes[key].toFixed(2));

    // Limita a quantidade de meses retornados para os últimos 6 meses
    const maxMonths = 6;
    const recentMonths = sortedKeys.slice(-maxMonths); // Obtém os últimos 6 meses
    // Formata as categorias dos últimos 6 meses
    const recentCategories = recentMonths.map((key) => {
      const [year, month] = key.split("-");
      return `${month}-${year}`; // Formato MM-YYYY
    });
    // Formata os valores dos últimos 6 meses para 2 casas decimais
    const recentValues = recentMonths.map((key) =>
      vendasPorMes[key].toFixed(2)
    );
    // Retorna as categorias e valores no formato JSON
    res
      .status(200)
      .json({ categories: recentCategories, values: recentValues });
  } catch (error) {
    // Em caso de erro, retorna o erro com status 500
    res.status(500).json({ error: error.message });
  }
};

const getSalesByPaymentMethod = async (req, res) => {
  try {
    // Busca todas as vendas que não foram deletadas do banco de dados,
    // incluindo o método de pagamento para cada venda.
    const vendas = await prisma.venda.findMany({
      where: { deleted: false }, // Filtra apenas vendas não deletadas
      select: {
        formaDePagamento: true, // Seleciona o campo que indica o método de pagamento
      },
    });
    // Agrupa e conta o número de vendas para cada método de pagamento
    const vendasPorMetodo = vendas.reduce((acc, venda) => {
      const metodo = venda.formaDePagamento; // Obtém o método de pagamento da venda
      if (!acc[metodo]) {
        acc[metodo] = 0; // Inicializa o contador para o método de pagamento, se não existir
      }
      acc[metodo] += 1; // Incrementa o contador de vendas para o método de pagamento
      return acc;
    }, {});
    // Ordena os métodos de pagamento e cria os arrays de categorias e valores
    const categories = Object.keys(vendasPorMetodo); // Obtém os nomes dos métodos de pagamento
    const values = Object.values(vendasPorMetodo); // Obtém as contagens de vendas para cada método
    // Retorna os métodos de pagamento e suas respectivas contagens no formato JSON
    res.status(200).json({ categories, values });
  } catch (error) {
    // Em caso de erro, retorna a mensagem de erro com status 500
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDailySales,
  getMonthlySales,
  getAnnualSales,
  getTopCategoryOfDay,
  getTopCategoryOfMonth,
  getTopCategoryOfYear,
  getTotalSalesOfDay,
  getTotalSalesOfMonth,
  getTotalSalesOfYear,
  getProductsSoldByCategory,
  getProductsReport,
  getSalesReport,
  getUltimasVendas,
  getVendasTendencia,
  getSalesByPaymentMethod,
};
