const express = require("express");
const { newCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require("../controllers/categoriaController")
// Criação de um novo roteador Express
const router = express.Router();
// rota para criar categoria
router.post("/categoria", newCategory);
// rota para listar categorias
router.get('/categorias', getCategories);
// rota para listar categoria
router.get('/categoria/:id', getCategoryById);
// rota para atualizar categoria
router.put('/categoria/:id', updateCategory);
// rota para deletar categoria
router.delete('/categoria/:id', deleteCategory);

module.exports = router;