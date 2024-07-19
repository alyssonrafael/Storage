const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const newCategory = async (req, res) => {
  // Extrai os dados do corpo da requisição
  const { nome } = req.body;
  try {
    // Verifica se já existe alguma categoria com o nome desejado
    const existingCategory = await prisma.categoria.findFirst({
      where: { nome },
    });
    // Se já existir uma categoria com o mesmo nome, retorna o status 409
    if (existingCategory) {
      return res
        .status(409)
        .json({ error: "Categoria com esse nome já existe" });
    }
    // Se não existir, cria a categoria
    const categoria = await prisma.categoria.create({
      data: { nome },
    });
    // Responde com a categoria criada e status 201 (Created)
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message }); // Ajustar o status para 500 (Internal Server Error)
  }
};
// retorna todas as categorias
const getCategories = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        id: 'asc', // Ordena em ordem crescente.
      },
    });
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//  retorna a categoria com base no id
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
    });
    // se nao encontrar o id retona nao encontrado
    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// atualizar categoria
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    // Verifica se já existe uma categoria com o mesmo nome
    const existingCategory = await prisma.categoria.findFirst({
      where: {
        nome,
        NOT: {
          id: parseInt(id),
        },
      },
    });
    // se ja existir uma com o nome nao deixa criar
    if (existingCategory) {
      return res
        .status(409)
        .json({ error: "Categoria com esse nome já existe" });
    }
    // se nao atualiza
    const categoria = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: { nome },
    });

    res.status(200).json(categoria);
  } catch (error) {
    if (error.code === "P2025") {
      //codigo retornado do prisma dizendo que nao foi encontrado
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    res.status(500).json({ error: error.message });
  }
};
// exclusao de categoria (marcar como deletada)
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // Atualiza a categoria no banco de dados para marcar como deletada
    const categoria = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: {
        deleted: true, // Marca a categoria como deletada
      },
    });

    res.status(200).json(categoria);
  } catch (error) {
    if (error.code === "P2025") {
      //codigo retornado do prisma dizendo que nao foi encontrado
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    res.status(500).json({ error: error.message });
  }
};
// restaurar categoria marcando o campo deleted como false
const restoreCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // Atualiza a categoria no banco de dados para restaurar
    const categoria = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: {
        deleted: false, // Restaura a categoria marcada como deletada
      },
    });

    res.status(200).json(categoria);
  } catch (error) {
    if (error.code === "P2025") {
      //codigo retornado do prisma dizendo que nao foi encontrado
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Função para verificar se uma categoria tem produtos associados
const checkCategoryProducts = async (req, res) => {
  const { id } = req.params; // Obtém o ID da categoria dos parâmetros da requisição
  try {
    // Verifica se existem produtos associados à categoria
    const count = await prisma.produto.count({
      where: {
        categoriaId: Number(id),
      },
    });
    // Retorna o numero de produtos associados e 0 caso contrário
    res.status(200).json({ hasProducts: count > 0 ? count : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  newCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  restoreCategory,
  checkCategoryProducts,
};
