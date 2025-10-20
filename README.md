# Task Manager (NestJS + React)

## 🌟 Visão Geral do Projeto

Este é um projeto de gerenciamento de tarefas (To-Do List) desenvolvido como um desafio técnico Full-Stack. A aplicação oferece um ambiente seguro para que o usuário se registre, autentique-se via JWT e gerencie suas tarefas pessoais em um CRUD completo.

O foco principal é a **qualidade do código (SOLID/DRY)**, a **arquitetura limpa (Clean Architecture)** e a **containerização completa** para um ambiente de desenvolvimento robusto e portátil.

---

## ✨ Funcionalidades em Destaque

### 🔐 Autenticação e Segurança

* **Registro e Login:** Fluxo completo e seguro de cadastro/autenticação.
* **Token JWT:** Utilização de JSON Web Tokens (JWT) via Passport.js para proteger todas as rotas de API e componentes de frontend.
* **UX Aprimorada:** Modais de confirmação de logout e deleção.

### 📝 Gerenciamento de Tarefas (CRUD Completo)

* **Criação:** Título e descrição opcionais.
* **Listagem:** Exibe apenas as tarefas pertencentes ao usuário autenticado.
* **Edição (Update):** Modal dedicado para atualizar título, descrição e **status** (`Pendente`, `Em Andamento`, `Finalizada`).
* **Remoção Lógica (Soft Delete):** A tarefa é marcada com a data de exclusão (`deleted_at`), mantendo a integridade dos dados no histórico.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Ferramenta | Descrição |
| :--- | :--- | :--- |
| **Backend** | **Nest.js** | Framework Node.js para APIs robustas e escaláveis, seguindo padrões modulares. |
| **Persistência** | **PostgreSQL** | Banco de dados relacional profissional. |
| **ORM/DB** | **TypeORM** | Mapeamento Objeto-Relacional, com suporte a **Migrations** e **Soft Delete**. |
| **Frontend** | **React** (Vite) | Biblioteca para a interface do usuário, com alta performance e Hot-Reload. |
| **Estilo** | **Tailwind CSS** | Framework CSS utility-first para design moderno e responsivo. |
| **Formulários** | **React Hook Form & Zod** | Validação robusta e tipada de formulários. |
| **Arquitetura** | **Custom Hooks** | Uso de `useTasks` e `useLogin` para aplicar **SRP/DRY** na gestão de estado do frontend. |
| **DevOps** | **Docker & Docker Compose** | Containerização completa para garantir ambiente de desenvolvimento idêntico à produção. |
| **Testes** | **Jest & RTL** | Cobertura unitária completa para Services/Controllers (Backend) e Componentes/Hooks (Frontend). |

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

Certifique-se de ter instalado em seu sistema:

1.  **[Docker]**
2.  **Docker Compose** (geralmente incluído no Docker Desktop)

### 1. Clonar o Repositório

```bash
git clone [github.com/Herbaszl/task-manager](https://github.com/Herbaszl/task-manager)
cd task-manager
```

### 2. Configurar Variáveis de Ambiente (backend/.env)
O backend precisa de um arquivo .env para credenciais e segredo JWT.

Navegue até a pasta backend: cd backend

Crie o arquivo .env e adicione o seguinte conteúdo:

```bash
# backend/.env

# Credenciais do Banco de Dados (consistentes com docker-compose.yml)
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin
DB_DATABASE=task_manager

# Segredo para assinatura dos tokens JWT (MUITO IMPORTANTE: Use um valor seguro)
JWT_SECRET=StringSecretaEBemBemLongaHaHa!12345
```
 Volte para a raíz 
```bash
cd ...
```

### 3. Construir e Iniciar os Contêineres

Na raiz do projeto (task-manager), execute o comando de orquestração:

```bash
docker-compose up --build -d
```
⏳ Nota: A primeira execução pode demorar, pois o Docker constrói e instala todas as dependências do zero.

### 4. Iniciar as Migrations
Com os serviços ativos, popule o banco de dados com as tabelas necessárias:

```bash
docker-compose exec backend npm run migration:run
```

---

## 💻 Acesso ao Aplicativo
| Serviço | Endereço | Credencial Padrão (Para Logar) |
| :--- | :--- | :--- |
| Frontend (React) | `http://localhost:5173` | Faça o Registro/Login primeiro |
| Backend (API NestJS) | `http://localhost:3000` | — |
| PgAdmin 4 (Gerenciamento) | `http://localhost:8080` | Host: `postgres_db`, User: `admin@admin.com`, Pass: `admin` |

---


## 🧪 Executando os Testes Unitários

Para comprovar a qualidade do código (critério SOLID/DRY), execute os testes dentro dos contêineres:
### Testes do Backend (TasksService, AuthController, etc.)

```bash
docker-compose exec backend npm run test
```

### Testes do Frontend (RTL: Formulários e Hooks)

```bash
docker-compose exec frontend yarn jest
# OU para ver a cobertura:
# docker-compose exec frontend yarn jest --coverage
```


