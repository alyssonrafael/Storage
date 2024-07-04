const bcrypt = require('bcrypt'); //importa o bcrypt para cripitografias

const hashPassword = async (password) => { //funçao ansicrona que tem password como argumento
    const salt = await bcrypt.genSalt(10);//aqui e gerado um valor aleatorio e define a complexidade dessa aleatoriedade
    return bcrypt.hash(password, salt);//aqui ele devolve a senha encriptografada
}

module.exports = hashPassword;//exportanto a funçao para criptografia de senha