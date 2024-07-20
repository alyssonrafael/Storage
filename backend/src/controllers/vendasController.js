const { PrismaClient } = require("@prisma/client"); //orm para interaçao com o banco de dados
const prisma = new PrismaClient();

//funçoes mais complexas optei por comentar melhor
//criar nova venda
const newVenda = async (req, res) => {
  // Desestrutura os parâmetros do corpo da requisição
  const { userId, produtos, desconto, observacao, formaDePagamento } = req.body;

  try {
    // Inicia uma transação Prisma para garantir atomicidade
    const result = await prisma.$transaction(async (prisma) => {
      // Calcula o total da venda e atualiza o estoque
      let total = 0; // Inicializa o total da venda

      // Itera sobre os produtos da venda
      for (const prod of produtos) {
        // Encontra o produto pelo ID
        const produto = await prisma.produto.findUnique({
          where: { id: prod.produtoId },
        });
        // Se o produto não for encontrado, lança um erro
        if (!produto) {
          throw new Error(`Produto com ID ${prod.produtoId} não encontrado`);
        }
        // Se a quantidade em estoque for insuficiente, lança um erro
        if (produto.quantidade < prod.quantidade) {
          throw new Error(
            `Estoque insuficiente para o produto com ID ${prod.produtoId}`
          );
        }
        // Calcula o total da venda
        total += produto.preco * prod.quantidade;

        // Atualiza a quantidade no estoque
        const novaQuantidade = produto.quantidade - prod.quantidade;
        await prisma.produto.update({
            where: { id: prod.produtoId },
            data: { 
                quantidade: novaQuantidade,
                disponivel: novaQuantidade > 0 // Marca como indisponível se a quantidade for 0
            },
        });
      }
      // Verifica se o desconto é maior que o total dos produtos
      if (desconto > total) {
        throw new Error("Desconto não pode ser maior que o total dos produtos");
      }
      // Subtrai o desconto do total
      total -= desconto;

      // Cria a venda
      const venda = await prisma.venda.create({
        data: {
          userId, // ID do usuário que fez a venda
          total, // Total da venda
          desconto, // Desconto aplicado
          observacao, // Observações sobre a venda
          formaDePagamento, // Forma de pagamento usada
          produtos: {
            create: produtos.map((prod) => ({
              produtoId: prod.produtoId,
              quantidade: prod.quantidade,
            })),
          },
        },
        include: { produtos: true }, // Inclui os produtos na resposta
      });

      return venda;
    });

    res.status(201).json(result); // Responde com o resultado da venda criada
  } catch (error) {
    res.status(500).json({ error: error.message }); // Captura e responde com qualquer erro que ocorra
  }
};

const getVendas = async (req, res) => {
  try {
    // Recupera todas as vendas não deletadas
    const vendas = await prisma.venda.findMany({
      where: { deleted: false },
      orderBy: { createdAt: 'desc' },
      include: {
        produtos: true, // Inclui os produtos em cada venda
        user: true, // Inclui o usuário que fez cada venda
      },
    });

    res.status(200).json(vendas); // Responde com a lista de vendas
  } catch (error) {
    res.status(500).json({ error: error.message }); // Captura e responde com qualquer erro que ocorra
  }
};

const getVendaById = async (req, res) => {
  const { id } = req.params; // Obtém o ID da venda dos parâmetros da rota
  try {
    // Recupera a venda pelo ID, desde que não esteja deletada
    const venda = await prisma.venda.findUnique({
      where: { id: parseInt(id), deleted: false },
      include: {
        produtos: true, // Inclui os produtos na venda
        user: true, // Inclui o usuário que fez a venda
      },
    });

    if (!venda) {
      // Se a venda não for encontrada, responde com erro 404
      return res.status(404).json({ error: "Venda não encontrada" });
    }

    res.status(200).json(venda); // Responde com os dados da venda encontrada
  } catch (error) {
    res.status(500).json({ error: error.message }); // Captura e responde com qualquer erro que ocorra
  }
};

const deleteVenda = async (req, res) => {
    const { id } = req.params;

    try {
        const venda = await prisma.venda.findUnique({
            where: { id: parseInt(id) },
            include: { produtos: true },
        });

        if (!venda) {
            return res.status(404).json({ error: "Venda não encontrada" });
        }

        // Retorna os produtos ao estoque
        for (const vendaProduto of venda.produtos) {
            const produto = await prisma.produto.findUnique({
                where: { id: vendaProduto.produtoId },
            });
            const novaQuantidade = produto.quantidade + vendaProduto.quantidade;
            await prisma.produto.update({
                where: { id: vendaProduto.produtoId },
                data: { 
                    quantidade: novaQuantidade,
                    disponivel: novaQuantidade > 0 // Marca como disponível se a quantidade for maior que 0
                },            });
        }

        // Deleta a venda e os registros em VendaProduto
        await prisma.vendaProduto.deleteMany({
            where: { vendaId: parseInt(id) },
        });

        await prisma.venda.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Venda deletada com sucesso e produtos retornados ao estoque" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Venda não encontrada" });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = { newVenda, getVendas, getVendaById, deleteVenda };
