export const decodeToken = (token: string) => {
    try {
      // Decodifica o token JWT dividido em partes
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload; // Retorna o payload decodificado (dados do usuário)
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return null; // Retorna nulo em caso de erro na decodificação
    }
  };
  