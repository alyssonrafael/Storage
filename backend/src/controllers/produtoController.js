const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// cadastrar novo produto
const newProduct = async (req, res) => {
  const { nome, preco, quantidade, disponivel, categoriaId } = req.body;
  // verifica se ja existe produto com o nome desejado
  try {
    const existingProduct = await prisma.produto.findFirst({
      where: { nome },
    });
    // se ja existir retorna o erro
    if (existingProduct) {
      return res.status(409).json({ error: "Produto com esse nome já existe" });
    }
    // se nao cria
    const produto = await prisma.produto.create({
      data: {
        nome,
        preco,
        quantidade,
        disponivel,
        categoriaId,
      },
    });

    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// listar todos os produtos
const getProducts = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        categoria: {
          select: { nome: true },
        },
      },
    });
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// listar produto com base no id
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: {
          select: { nome: true },
        },
      },
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// atualizar produto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nome, preco, quantidade, disponivel, categoriaId } = req.body;
  // verifica se o nome do produto a ser alterado ja existe e ignora o nome do protudo que esta sendo atualizaddo um vez que
  //nao necessatiamente o nome tambem deve ser atualizaddo todas as vezes que o prodduto tambem for
  try {
    const existingProduct = await prisma.produto.findFirst({
      where: {
        nome,
        NOT: {
          id: parseInt(id),
        },
      },
    });
    //se ja existir ele retorna o erro
    if (existingProduct) {
      return res.status(409).json({ error: "Produto com esse nome já existe" });
    }
    //se nao ele faz a atualizaçao com os novos parametros
    const produto = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        preco: parseFloat(preco), // Certificando que preco é float
        quantidade: parseInt(quantidade), // Certificando que quantidade é inteiro
        disponivel,
        categoriaId: parseInt(categoriaId), // Certificando que categoriaId é inteiro
      },
    });

    res.status(200).json(produto);
  } catch (error) {
    // verificaçao com o codigo do prisma para resultado nao encontrado
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    //caso ocorra algum outro erro cai na mensagem generica
    res.status(500).json({ error: error.message });
  }
};

// marcar produto como deletado
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Atualiza o produto no banco de dados para marcar como deletado
    const produto = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: {
        deleted: true, // Marca o produto como deletado
      },
    });

    res.status(200).json(produto);
  } catch (error) {
    //se o codigo do prisma for esse ele retorna como nao encontrado
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.status(500).json({ error: error.message });
  }
};

// restaurar produto mudando o campo deleted para false
const restoreProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Atualiza a categoria no banco de dados para restaurar
    const categoria = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: {
        deleted: false, // Restaura a categoria marcada como deletada
      },
    });

    res.status(200).json(categoria);
  } catch (error) {
    // verificaçao com o codigo do prisma para resultado nao encontrado
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.status(500).json({ error: error.message });
  }
};

//funçao que conta a quantidade de produtos
const countProdutos = async (req, res) => {
  try {
    const totalProdutos = await prisma.produto.count({
      where: {deleted: false}} // so os produtos que nao estao marcados com deleted
    );
    res.status(200).json({ totalProdutos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  newProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
  countProdutos,
};
