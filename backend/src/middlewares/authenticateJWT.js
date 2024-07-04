const jwt = require('jsonwebtoken'); //importaçao da biblioteca
const secretKey = process.env.SECRET_KEY; // chave secreta para verificar o token

//middleware para autenticar tokens JWT
const authenticateJWT = (req, res, next) => {
  //tenta extrair o token do cabeçalho da autorizaçao da requisiçao
  const token = req.headers.authorization?.split(" ")[1];
  //se um token for fornecido
  if (token) {
    //faz a verificaçao com a chave
    jwt.verify(token, secretKey, (err, user) => {
      // Se houver um erro na verificação, como um token inválido ou expirado
      if (err) {
        // Responde com o status 403 (Proibido)
        return res.sendStatus(403);
      }
      // Se o token for válido, anexa o usuário decodificado ao objeto de requisição
      req.user = user;
      // Passa o controle para o próximo middleware ou rota
      next();
    });
  } else {
    // Se nenhum token for fornecido, responde com o status 401 (Não Autorizado)
    res.sendStatus(401);
  }
};
//exporta pra ser utilizado em outros locais
module.exports = authenticateJWT;
