<h1 align="center" style="font-weight: bold;">STORAGE * back-end * 💻</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Badge">
  <img src="https://img.shields.io/badge/Express-005CFE?style=for-the-badge&logo=express&logoColor=white" alt="Express Badge">
  <img src="https://img.shields.io/badge/Javascript-000?style=for-the-badge&logo=javascript" alt="JavaScript Badge">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Badge">
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Badge">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma Badge">
</p>

<p align="center">
 <a href="#started">Primeiros passos</a> • 
  <a href="#routes">API Endpoints</a> •
 <a href="#colab">Autor</a>
</p>

<p align="center">
  <b>A API é um dos pontos se não o ponto mais inportante da minha aplicação, oferecendo endpoints para acessar e manipular dados. Desenvolvida com Node.js e Express, ela utiliza PostgreSQL como banco de dados e Docker para fácil implantação.</b>
</p>

<h2 id="started">🚀 Primeiros passos</h2>

Nesta etapa, vou descrever como você pode executar a API localmente em seu ambiente de desenvolvimento.

<h3>Pré-requisitos</h3>

- [NodeJS](https://nodejs.org/en)
- [Docker ](https://docker.com)
- [Git 2](https://github.com)

<h3>Clonagem do Repositório:</h3>

```bash
git clone https://github.com/alyssonrafael/Storage
```

<h3>Navegando para o Back-end:</h3>

```bash
cd ./Storage/back-end
```

<h3>Instalando as dependencias</h3>
Com o comando você garante a instalação das dependências

```bash
npm install
```

<h3>variáveis de ambiente</h2>

Use o arquivo `.env.exemple` como referência para criar seu arquivo de configuração. Nele é onde estarão os parâmetros para que o Prisma possa se conectar ao seu banco de dados.

```yaml
DATABASE_URL="postgresql://example:1111@localhost:5432/example?schema=public"
```

Garanta que esse são os mesmos parametro passados no arquivo docker compose que servira para iniciar o container com o banco de dados. Você pode personalizar como você quer seu container o nome do banco e senha e garanta que eles sejam passados certos para a URL.

Para iniciar o banco de dados via docker, execute o seguinte comando diretamente no terminal:

```yaml
docker-compose up
```

com isso o docker iniciara seu banco de dados

<h3>Migrações</h3>
Após o banco de dados estar em execução, execute o seguinte comando para aplicar as migrações do Prisma:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

<h3>Starting</h3>

Com tudo isso feito resta apenas iniciar o projeto. com o seguinte comando:

```bash
npm run dev
```

<h2 id="routes">📍 API Endpoints</h2>

Essas são minhas rotas: e possivel copiar o arquivo **Storage.postman_collection.json"**</a> para seu postman para ter acesso a todos os testes de rotas

<h1>Auth</h1>

| Route                                                    | description                                       |
| -------------------------------------------------------- | ------------------------------------------------- |
| <kbd>POST/http://localhost:3333/api/register</kbd>       | cadastra um novo usuario                          |
| <kbd>POST/http://localhost:3333/api/login</kbd>          | Faz a autenticação e gera um token para o usuario |
| <kbd>GET/http://localhost:3333/api/user-dashboard</kbd>  | página para usuario padrão                        |
| <kbd>GET/http://localhost:3333/api/admin-dashboard</kbd> | página para usuario Admin                         |

<h1>User</h1>

| Route                                                     | description                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| <kbd>GET/http://localhost:3333/api/users</kbd>            | Retorna todas os usuarios cadastrados rota restrita ao admin |
| <kbd>PATCH/http://localhost:3333/api/users/:id/role</kbd> | altera a Role do usuario restrito ao admin                   |
| <kbd>PUT/http://localhost:3333/api/users/:id</kbd>        | atualização do nome todos tem acesso                         |
| <kbd>DELETE/http://localhost:3333/api/users/:id</kbd>     | Exclusão de usuario todos tem acesso                         |
| <kbd>GET/http://localhost:3333/api/users/:id</kbd>        | Buscar usuario com base no id                                |

<h1>categoria</h1>

| Route                                                          | description                              |
| -------------------------------------------------------------- | ---------------------------------------- |
| <kbd>GET/http://localhost:3333/api/categorias</kbd>            | Retorna todas as categorias cadastradas  |
| <kbd>POST/http://localhost:3333/api/categoria</kbd>            | responsavel por criar uma nova categoria |
| <kbd>PUT/http://localhost:3333/api/categoria/:id</kbd>         | atualização da categoria                 |
| <kbd>PUT/http://localhost:3333/api/delete-categoria/:id</kbd>  | marcar categoria como excluida           |
| <kbd>PUT/http://localhost:3333/api/restore-categoria/:id</kbd> | marca categoria como nao excluida        |

<h1>Produtos</h1>

| Route                                                        | description                             |
| ------------------------------------------------------------ | --------------------------------------- |
| <kbd>GET/http://localhost:3333/api/produtos</kbd>            | Retorna todos os produtos cadasstrados  |
| <kbd>POST/http://localhost:3333/api/produto</kbd>            | responsavel por criar um novo produto   |
| <kbd>GET/http://localhost:3333/api/produto/:id</kbd>         | lista produto expecifico com base no id |
| <kbd>PUT/http://localhost:3333/api/produto/:id</kbd>         | editar produto                          |
| <kbd>PUT/http://localhost:3333/api/delete-produto/:id</kbd>  | marca produto como excluido             |
| <kbd>PUT/http://localhost:3333/api/restore-produto/:id</kbd> | marca produto como nao excluido         |

<h1>Vendas</h1>

| Route                                                 | description                           |
| ----------------------------------------------------- | ------------------------------------- |
| <kbd>GET/http://localhost:3333/api/vendas</kbd>       | Retorna todas as vendas cadastrados   |
| <kbd>POST/http://localhost:3333/api/vendas</kbd>      | responsavel por criar uma nova venda  |
| <kbd>GET/http://localhost:3333/api/venda/:id</kbd>    | lista venda expecifica com base no id |
| <kbd>DELETE/http://localhost:3333/api/venda/:id</kbd> | deleta venda permanentemente          |

<h1>Relatorios</h1>

| Route                                                                | description                                                                           |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| <kbd>GET/http://localhost:3333/api/vendas-dia</kbd>                  | Retorna todas as vendas do dia                                                        |
| <kbd>GET/http://localhost:3333/apivendas-mes</kbd>                   | Retorna todas as vendas do mes                                                        |
| <kbd>GET/http://localhost:3333/api/vendas-ano</kbd>                  | Retorna todas as vendas do ano                                                        |
| <kbd>GET/http://localhost:3333/api/categoria-top-mes</kbd>           | Retorna a categoria mais vendida do mes                                               |
| <kbd>GET/http://localhost:3333/api/total-vendas-mes</kbd>            | Retorna o total de vendas no mes                                                      |
| <kbd>GET/http://localhost:3333/api/produtos-vendidos-categoria</kbd> | Retorna a quantidade de proddutos vendidos por categoria                              |
| <kbd>GET/http://localhost:3333/api/produtos</kbd>                    | Retorna todos os produtos ou produtos filtrados com base nos parametros da requisiçao |
| <kbd>GET/http://localhost:3333/api/vendas</kbd>                      | Retorna todas as vendas ou as vendas filtrados com base nos parametros da requisiçao  |
| <kbd>GET/http://localhost:3333/api/ultimas-vendas</kbd>              | Retorna uma quantidade limitada de ulltimas vendas                                    |

<h2 id="colab">✒️ Autor</h2>

<table style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="padding: 20px; border: 1px solid #ccc; text-align: center;">
      <a href="https://github.com/alyssonrafael" style="text-decoration: none;">
        <img src="https://avatars.githubusercontent.com/u/128101121?s=400&u=133d3afb5a5d6ef6411bc63742e3202995d3cfad&v=4" width="100px" style="border-radius: 50%;" alt="Alysson Rafael Profile Picture"/><br>
        <b>Alysson Rafael</b>
      </a>
    </td>
    <td style="padding: 20px; border: 1px solid #ccc;">
      Gostaria de agradecer a todos que contribuíram para este projeto! Seja com sugestões, correções de bugs ou simplesmente com palavras de incentivo. Com esse projeto pude me desafiar e aprender muitas coisas novas sobre relacionamentos em banco de dados e como esta construindo uma api que supre todas as necessidades do meu front-end! Foi uma otima experiencia ter construido essa api.🚀
    </td>
  </tr>
</table>
