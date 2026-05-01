# Psicho Hub API

API backend para gerenciamento de usuários e controle de acesso em um sistema de atendimento psicológico. Fornece autenticação via e-mail/senha e criação de três tipos de usuários com regras de permissão por cargo.

## Funcionalidades principais

- Autenticação JWT com `email` e `password`
- Criação de usuário `master`
- Criação de usuário `admin` (somente `master`)
- Criação de usuário `applicator` (somente `admin`)
- Verificação de domínio de e-mail para aplicadores
- Documentação de API disponível em `/docs`

---

## Tecnologias utilizadas

- Node.js
- TypeScript
- Fastify
- JWT
- CORS
- Swagger
- Drizzle ORM
- Zod
- bcryptjs
- pg
- tsx
- tsup
- Biome

---

## Padrões e arquitetura

O projeto segue uma arquitetura em camadas com separação clara entre:

- config — configuração de ambiente
- core — validações, erros e esquemas compartilhados
- database — configuração do banco de dados e repositórios
- dtos — schemas de validação de entrada/saída
- http — servidor, rotas, middlewares e tratamento de erros
- services — regras de negócio
- schema.ts — definição do modelo Relacional

Essa organização se aproxima de um padrão de arquitetura em camadas / clean architecture, onde rotas orquestram serviços e serviços usam repositórios.

---

## Pré-requisitos

- Node.js compatível com `typescript` e `tsx` (recomendado Node 20+)
- PostgreSQL
- `DATABASE_URL` configurada para conexão com o banco

---

## Instalação e configuração

1. Clone o repositório
2. Instale dependências:
   ```bash
   pnpm install
   ```
3. Crie um arquivo .env ou use .env.example:
   ```env
   PORT=3333
   HOST=0.0.0.0
   JWT_SECRET=my-jwt-secret
   CLIENT_APP_URL=http://localhost:3000
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   ```
4. Execute a aplicação em modo de desenvolvimento:
   ```bash
   pnpm dev
   ```

---

## Scripts disponíveis

- `pnpm dev` — inicia o servidor com `tsx watch` usando .env
- `pnpm lint` — executa `biome check --write ./src`
- `pnpm build` — compila o projeto com `tsup`
- `pnpm start` — executa `node dist/http/server.js`
- `pnpm db:migrate` — executa migrações com `drizzle-kit migrate`
- `pnpm db:generate` — gera artefatos a partir do schema do Drizzle
- `pnpm db:studio` — inicia o Drizzle Studio
- `pnpm db:seed` — roda o seed definido em seed.ts

---

## Banco de dados

- Banco: PostgreSQL
- ORM / Query Builder: Drizzle ORM
- Configuração do Drizzle: drizzle.config.ts
- Schema principal: schema.ts

### Como rodar migrations

```bash
pnpm db:migrate
```

### Como rodar seed

```bash
pnpm db:seed
```

O seed cria um usuário `master`:
- email: `user.master@email.com`
- password: `master.password`

---

## Autenticação

- Método: JWT
- Fluxo:
  1. POST em `/auth` com `email` e `password`
  2. Serviço `AuthService` valida usuário e senha
  3. Token é assinado com payload `{ sub, role }`
  4. Token expira em `7d`

O token é usado em rotas protegidas onde `authMiddleware` valida e extrai o usuário atual.

---

## Endpoints da API

### Autenticação

#### `POST /auth`

- Descrição: Autentica um usuário com e-mail e senha
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "senha123"
  }
  ```
- Resposta 201:
  ```json
  {
    "token": "eyJhbGciOi..."
  }
  ```
- Erros possíveis:
  - `400` — e-mail ou senha inválidos
  - `500` — erro interno do servidor

---

### Criação de usuário master

#### `POST /users/master`

- Descrição: Cria um usuário com papel `master`
- Pré-requisito: usuário autenticado com role `master`
- Headers:
  - `Authorization: Bearer <token>`
- Body:
  ```json
  {
    "name": "Master Name",
    "email": "master@example.com",
    "password": "senha123"
  }
  ```
- Resposta 201: sem corpo
- Erros possíveis:
  - `400` — validação de entrada inválida
  - `401` — token inválido ou ausente
  - `403` — usuário sem permissão
  - `409` — usuário já existe
  - `500` — erro interno do servidor

---

### Criação de usuário admin

#### `POST /users/admin`

- Descrição: Cria um usuário com papel `admin`
- Pré-requisito: usuário autenticado com role `master`
- Headers:
  - `Authorization: Bearer <token>`
- Body:
  ```json
  {
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "senha123",
    "cpf": "12345678901",
    "contactPhone": "11999999999",
    "institution": "Instituição X"
  }
  ```
- Resposta 201: sem corpo
- Erros possíveis:
  - `400` — validação de entrada inválida
  - `401` — token inválido ou ausente
  - `403` — usuário sem permissão
  - `409` — usuário já existe
  - `500` — erro interno do servidor

---

### Criação de usuário applicator

#### `POST /users/applicator`

- Descrição: Cria um usuário com papel `applicator`
- Pré-requisito: usuário autenticado com role `admin`
- Headers:
  - `Authorization: Bearer <token>`
- Body:
  ```json
  {
    "name": "Applicator Name",
    "email": "applicator@instituicao.com",
    "password": "senha123",
    "cpf": "12345678901",
    "contactPhone": "11999999999",
    "academicBackground": "Psicologia"
  }
  ```
- Resposta 201: sem corpo
- Erros possíveis:
  - `400` — validação de entrada inválida ou domínio de e-mail diferente da instituição do admin
  - `401` — token inválido ou ausente
  - `403` — usuário sem permissão
  - `409` — usuário já existe
  - `500` — erro interno do servidor

---

## Regras de negócio

- `master` pode criar `admin` e `master`
- `admin` pode criar `applicator`
- `applicator` não possui rota de criação de usuários
- `email` deve ser único
- `password` mínimo de 6 caracteres
- `cpf` deve ter 11 dígitos
- `contactPhone` deve ter 11 dígitos
- Para criar `applicator`, o domínio do e-mail deve ser igual ao domínio do e-mail do `admin`
- Senhas são armazenadas como hash bcrypt (salt 10)

---

## Boas práticas e convenções

- Validação de entrada com `zod`
- Erros controlados usando classes de erro customizadas
- Tratamento centralizado de erros em error-handler.ts
- Tipagem explícita com TypeScript
- API documentada via Swagger e Scalar API Reference em `/docs`
- Lint com `biome`

---

## Licença

- `ISC` (conforme package.json)

---

## Observações

- A API documentada está disponível em `http://localhost:<PORT>/docs` após iniciar o servidor.