
# Assistente de Manutenção de Ativos - Desafio Relâmpago 3
![Badge](Badge)

Um sistema para gerenciamento de ativos e manutenções, desenvolvido com **TypeScript**, **Express.js** (backend), **React** (frontend) e **PostgreSQL**.

---

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- **Node.js** (v18 ou superior)
- **PostgreSQL** (v15 ou superior)
- **Git** (opcional, para clonar o repositório)

---

## 🚀 Como executar o projeto

### 1. Configuração do Banco de Dados

- Certifique-se que o PostgreSQL está instalado e rodando.
- Crie um banco de dados chamado `Desafio_Relampago_3` (ou outro nome que preferir).
- Configure as credenciais no arquivo `.env` (veja a seção de configuração abaixo).

### 2. Configuração do Ambiente

- Clone este repositório (ou extraia os arquivos se baixou como ZIP).
- Crie um arquivo `.env` na pasta `backend` baseado no `.env.example`:

```env
DB_USER="seu_usuario_postgres"
DB_HOST="localhost"
DB_NAME="Desafio_Relampago_3"
DB_PASSWORD="sua_senha_postgres"
DB_PORT="5432"

JWT_SECRET="uma_chave_secreta_forte_aqui"

NODE_ENV="development"
PORT=3000
```

### 3. Instalação e Execução

#### Backend

Abra um terminal na pasta `backend` e execute:

```bash
npm install          # Instala as dependências
npm run migrate:up   # Cria as tabelas no banco de dados
npm run dev          # Inicia o servidor em modo de desenvolvimento
```

#### Frontend

Abra outro terminal na pasta `frontend` e execute:

```bash
npm install          # Instala as dependências
npm run dev          # Inicia o servidor de desenvolvimento
```

---

## 🛠 Tecnologias Utilizadas

### Backend

- **TypeScript** – Linguagem principal
- **Express.js** – Framework web
- **PostgreSQL** – Banco de dados relacional
- **JWT** – Autenticação de usuários
- **bcryptjs** – Criptografia de senhas

### Frontend

- **React** – Biblioteca para construção de interfaces
- **Material UI** – Componentes UI estilizados
- **Vite** – Build tool e servidor de desenvolvimento
- **Axios** – Cliente HTTP para comunicação com o backend

---

## 📂 Estrutura do Projeto

```
PROJETO_RELAMPAGO/
├── backend/             # Código do servidor
│   ├── src/             # Código fonte TypeScript
│   ├── .env             # Variáveis de ambiente
│   └── package.json     # Dependências e scripts
├── frontend/            # Aplicação React
│   ├── src/             # Código fonte do frontend
│   └── package.json     # Dependências e scripts
└── README.md            # Este arquivo
```

---

## 🚀 Funcionalidades

- ✅ Cadastro e autenticação de usuários
- ✅ CRUD completo de ativos
- ✅ Registro de manutenções realizadas
- ✅ Agendamento de manutenções futuras
- ✅ Painel com visão geral das manutenções pendentes
- ✅ Histórico completo de manutenções por ativo

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Faça um fork do projeto
2. Crie uma branch para sua feature:

```bash
git checkout -b feature/AmazingFeature
```

3. Commit suas mudanças:

```bash
git commit -m 'Add some AmazingFeature'
```

4. Push para a branch:

```bash
git push origin feature/AmazingFeature
```

5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## ✉️ Contato

- **Nome:** Matheus Eduardo Pires de Azevedo
- **Email:** ´tymakay28@gmail.com
- **LinkedIn:** [linkedin.com/in/matheus-de-azevedo-ads](https://www.linkedin.com/in/matheus-de-azevedo-ads/)

---

⚠️ **Observação:** Certifique-se de que o PostgreSQL está rodando antes de iniciar a aplicação. As portas padrão são `3000` para o backend e `5173` para o frontend — ajuste se necessário no seu `.env` e `vite.config.ts`.
