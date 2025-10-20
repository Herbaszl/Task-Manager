**Task Manager** 

Aplicação completa de gerenciamento de tarefas (To-Do List) desenvolvida como um desafio técnico full-stack. Permite que usuários se registrem, façam login de forma segura e gerenciem suas próprias tarefas.

**✨Funcionalidades Principais**

Autenticação de Usuário:

Registo de novos usuários (nome, email, senha).

Login seguro utilizando email e senha.

Proteção de rotas da API e do frontend utilizando JWT (JSON Web Tokens).

Gerenciamento de Tarefas (CRUD):

Criação de novas tarefas com título e descrição opcional.

Listagem apenas das tarefas pertencentes ao usuário autenticado.

Atualização de título, descrição ou status ('Pendente', 'Em Progresso', 'Feita') de tarefas existentes.

Remoção de tarefas (Soft Delete: a tarefa é marcada como removida, mas não apagada fisicamente).

Interface Intuitiva: Frontend construído com React e estilizado com Tailwind CSS para uma experiência limpa e responsiva.

Ambiente Containerizado: Aplicação totalmente configurada para rodar com Docker e Docker Compose, facilitando a configuração e execução em ambiente de desenvolvimento.

**🛠️ Tecnologias Utilizadas**

**Backend:**

Framework: Nest.js

Linguagem: TypeScript

Banco de Dados: PostgreSQL

ORM: TypeORM

Autenticação: JWT (Passport.js)

Validação: class-validator, class-transformer

**Frontend:**

Framework: React (com Vite)

Linguagem: TypeScript

Estilização: Tailwind CSS (v3)

Gerenciamento de Estado: React Context API

Roteamento: React Router DOM

Formulários: React Hook Form & Zod

Requisições HTTP: Axios

DevOps & Banco de Dados:

Containerização: Docker, Docker Compose

Gerenciador de BD (Opcional): PgAdmin 4 (incluído no Docker Compose)

Testes:

Backend: Jest

Frontend: Jest, React Testing Library, User Event



**🚀 Como Executar o Projeto Localmente (Ambiente de Desenvolvimento)**

Pré-requisitos

Docker: Instruções de Instalação

Docker Compose: Geralmente incluído na instalação do Docker Desktop.

1. Clonar o Repositório

git clone github.com/Herbaszl
cd task-manager


2. Configurar Variáveis de Ambiente (Backend)

O backend precisa de um arquivo .env para as credenciais do banco de dados e o segredo do JWT.

Navegue até a pasta backend: cd backend

Crie um arquivo chamado .env.

Adicione o seguinte conteúdo, substituindo o JWT_SECRET por uma string aleatória e segura:

# backend/.env

# Credenciais do Banco de Dados (devem coincidir com docker-compose.yml)
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin
DB_DATABASE=task_manager

# Segredo para assinatura dos tokens JWT (IMPORTANTE: Use um valor seguro)
JWT_SECRET=SuaStringSecretaMuitoLongaEAleatoriaAqui!12345


Volte para a pasta raiz do projeto: cd ..

Nota: O DB_HOST=localhost é usado pelo script de migração que roda a partir da sua máquina. O Docker Compose sobrescreverá esta variável para DB_HOST=postgres_db para a comunicação entre os contêineres backend e postgres_db.

3. Construir e Iniciar os Contêineres

Na raiz do projeto (task-manager), execute o seguinte comando:

docker-compose up --build -d


--build: Garante que as imagens Docker para o backend e frontend sejam (re)construídas.

-d: Executa os contêineres em segundo plano (detached mode).

Atenção: A primeira execução deste comando pode demorar alguns minutos, pois ele precisa descarregar e instalar todas as dependências. As execuções seguintes serão muito mais rápidas graças ao cache do Docker.

Aguarde alguns momentos para que todos os serviços iniciem. Você pode verificar o status com docker ps.

4. Executar as Migrations do Banco de Dados

Com os contêineres rodando, crie as tabelas no banco de dados executando as migrations do TypeORM:

docker-compose exec backend npm run migration:run


**✅ Aplicação Pronta!**

Após os passos acima, a aplicação estará acessível nos seguintes endereços:

Frontend (React App - Dev Mode): http://localhost:5173 (Com Hot-Reload)

Backend (API NestJS - Dev Mode): http://localhost:3000 (Com Hot-Reload)

PgAdmin (Gerenciador de BD): http://localhost:8080

Login: admin@admin.com

Senha: admin

Para conectar ao banco dentro do PgAdmin:

Host: postgres_db

Porta: 5432

Usuário: admin

Senha: admin

Database: task_manager

**🧪 Executando os Testes**

Os testes unitários podem ser executados dentro dos contêineres Docker para garantir consistência.

Testes do Backend

# Executar todos os testes
docker-compose exec backend npm run test


Testes do Frontend

# Executar todos os testes
docker-compose exec frontend yarn jest

# Executar testes e ver cobertura
docker-compose exec frontend yarn jest --coverage



