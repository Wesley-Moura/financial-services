## Instruções

Este projeto foi feito utilizando as seguintes tecnologias:

- [NodeJS](https://github.com/nodejs)
- [Express](https://github.com/expressjs/express)
- [Typescript](https://www.typescriptlang.org/)
- [Typeorm](https://github.com/typeorm/typeorm)
- [Postgres](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Jest](https://github.com/facebook/jest)
- [ESLint](https://github.com/eslint/eslint)
- [Prettier](https://github.com/prettier/prettier)

Para executar a aplicação

```bash
# Acesse a pasta do projeto e baixe as dependências
$ yarn
```

```bash
# Será necessário utilizar uma imagem do postgres com o docker, para isso execute o seguinte comando no docker
$ docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

```bash
# Crie um banco de dados para rodar a aplicação com o nome
$ financialservices
```

```bash
# Execute as migrations do projeto
$ yarn typeorm migration:run -d src/shared/infra/typeorm
```

```bash
# Execute a aplicação
$ yarn dev
```

```bash
# Para rodar os testes na aplicação primeiro crie um banco de dados com o nome
$ financialservices_test

# Para executar os testes na aplicação
$ yarn test
```

A pasta coverage -> lcov-report -> index.html pode ser vista o coverage report dos testes da aplicação

# :computer: Autor

<table>
  <tr>
    <td align="center">
      <a href="https://www.linkedin.com/in/wesley-de-lacerda-moura-652477121/">
        <br />
        <sub>
          <b>Linkedin</b>
        </sub>
       </a>
       <br />
       <a href="https://github.com/Wesley-Moura/" title="GitHub">Wesley-Moura</a>
       <br />
    </td>
  </tr>
</table>