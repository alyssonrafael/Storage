const express = require("express");
const { newProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/produtoController');
// Criação de um novo roteador Express
const router = express.Router();
//rota para cadastrar produto
router.post('/produto', newProduct);
//rota para listar produtos
router.get('/produtos', getProducts);
// rota para listar produto com base no id
router.get('/produto/:id', getProductById);
//rota para atualizar informaçoes do produto
router.put('/produto/:id', updateProduct);
//rota que marca produto como deletado
router.put('/delete-produto/:id', deleteProduct);

module.exports = router;