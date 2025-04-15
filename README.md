<h1 align="center">
     Desafio de seleção da Knex
</h1>

<h3 align="center">
    API para gerenciar doações para os animais da UEPB.
</h3>

<h4 align="center">
    🚧   Em desenvolvimento... 🚀 🚧
</h4>

Tabela de conteúdos
=================
<!--ts-->
   * [Sobre o projeto](#-sobre-o-projeto)
   * [Como executar o projeto](#-como-executar-o-projeto)
     * [Pré-requisitos](#pré-requisitos)
     * [Rodando o Backend (servidor)](#user-content--rodando-o-backend-servidor)
   * [Tecnologias](#-tecnologias)
     * [Server](#user-content-server--nodejs----typescript)
<!--te-->


## 💻 Sobre o projeto

API REST para gerenciar doações aos cães que habitam o campus universitário. O sistema deve gerenciar doadores, doações e pagamentos via PIX, mantendo um histórico das transações.


---


## 🚀 Como executar o projeto


### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) e [Docker](https://www.docker.com)
Alem disso tambem é necessario configurar o arquivo .env.

#### 🎲 Rodando a API

```bash

# Clone este repositório

# Acesse a pasta do projeto

# Instale as dependências
$ npm install

# Inicie o Docker

# Construa a imagem
$ docker-compose build

# Gere as tabelas com o migrations
$ npx prisma migrate dev

# Inicie o docker compose
$ docker-compose up -d

# Execute a aplicação em modo de desenvolvimento
$ npm run start:dev

# O servidor inciará na porta:3000 - acesse http://localhost:3000.


```

---
## 🚀 Scripts
```bash

# Inicia server.ts
$ npm run start

# Execute a aplicação em modo de desenvolvimento
$ npm run start:dev

# Build da aplicação
$ npm run build

# Corrige erros do eslint e preetier (visual do codigo e possiveis erros de digitação)
$ npm run lint -- --fix

```

---

## 🛠 Exemplo .env
```bash

DATABASE_URL="postgresql://postgres:1234@localhost:5432/knex-challenge?schema=public"

```

---

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

#### **Server**  ([NodeJS](https://nodejs.org/en/)  +  [TypeScript](https://www.typescriptlang.org/))

-   **[Express](https://expressjs.com/)**
-   **[ts-node](https://github.com/TypeStrong/ts-node)**
-   **[dotENV](https://github.com/motdotla/dotenv)**
-   **[eslint](https://github.com/hapijs/joi)**
-   **[Preetier](https://github.com/hapijs/joi)**
-   **[tsx](https://github.com/hapijs/joi)**
-   **[tsup](https://github.com/hapijs/joi)**

#### **Utilitários**

-   Editor:  **[Visual Studio Code](https://code.visualstudio.com/)**
-   Markdown:  **[StackEdit](https://stackedit.io/)**,  **[Markdown Emoji](https://gist.github.com/rxaviers/7360908)**
-   Commit Conventional:  **[Commitlint](https://github.com/conventional-changelog/commitlint)**


---
