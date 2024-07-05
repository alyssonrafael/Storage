const express = require("express");
const {
  newCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  restoreCategory,
} = require("../controllers/categoriaController");
// Criação de um novo roteador Express
const router = express.Router();
// rota para criar categoria
router.post("/categoria", newCategory);
// rota para listar categorias
router.get("/categorias", getCategories);
// rota para listar categoria
router.get("/categoria/:id", getCategoryById);
// rota para atualizar categoria
router.put("/categoria/:id", updateCategory);
// rota para marcar categoria como deletada
router.put("/delete-categoria/:id", deleteCategory);
//rota pra resturar categoria
router.put("/restore-categoria/:id", restoreCategory);

module.exports = router;
