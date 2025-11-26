# FambaGo - Plataforma de Mobilidade Urbana (2025)

**FambaGo** é uma plataforma digital inovadora projetada para organizar, monitorar e facilitar o transporte via mototáxis nas regiões de **Inhambane e Maxixe** (Moçambique).

Este projeto utiliza uma arquitetura híbrida moderna, combinando uma interface reativa de alta performance com um backend robusto e modularizado em Python.

## 🌟 Funcionalidades Principais

*   **Multi-perfil (RBAC)**: Login diferenciado para Passageiros, Motoristas, Agentes Municipais e Administradores.
*   **Agendamento de Corridas**: Passageiros podem agendar viagens futuras.
*   **Gamificação para Motoristas**: Sistema de pontos e recompensas para incentivar bom comportamento.
*   **Portal do Agente**: Ferramentas para fiscais municipais registrarem infrações e monitorarem a frota.
*   **Segurança com IA**: Integração com Gemini AI para análises de risco de rotas em tempo real e grounding com Google Maps.
*   **Auditoria & Compliance**: Logs de ações críticas e exportação de dados para governança.

---

## 🏗️ Arquitetura do Sistema

O sistema é dividido em duas partes principais:

### 1. Frontend (React + TypeScript)
Responsável pela interface do usuário, interações e lógica de apresentação.
*   **Framework**: React 18+
*   **Estilização**: Tailwind CSS
*   **Ícones**: Lucide React
*   **Mapas/IA**: Google GenAI SDK

### 2. Backend (Python + Flask)
Responsável pela lógica de negócios, persistência de dados e API.
*   **Framework**: Flask
*   **Banco de Dados**: SQLite (Desenvolvimento) / PostgreSQL (Produção)
*   **ORM**: SQLAlchemy
*   **Estrutura**: Modularizada com Blueprints (`auth`, `rides`, `reports`).

---

## 🚀 Como Inicializar o Projeto

### Pré-requisitos
*   Node.js instalado (v16+)
*   Python instalado (v3.8+)

### Passo 1: Inicializar o Backend

O backend gerencia o banco de dados e as autenticações.

1.  Navegue até a pasta do backend:
    ```bash
    cd backend
    ```

2.  Crie um ambiente virtual (opcional, mas recomendado):
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/Mac
    venv\Scripts\activate     # Windows
    ```

3.  Instale as dependências listadas em `requirements.txt`:
    ```bash
    pip install -r requirements.txt
    ```

4.  Inicie o servidor Flask:
    ```bash
    python app.py
    ```
    *O servidor iniciará na porta `5000` e criará automaticamente o banco de dados `fambago.db` se não existir.*

### Passo 2: Inicializar o Frontend

1.  Na raiz do projeto, instale as dependências:
    ```bash
    npm install
    ```

2.  Inicie a aplicação:
    ```bash
    npm start
    ```
    *Acesse `http://localhost:3000` no seu navegador.*

---

## 📂 Estrutura de Pastas

```
/
├── components/       # Componentes React (Views de cada perfil)
├── services/         # Serviços de API (backend.ts simula conexões no protótipo)
├── backend/          # Código Fonte do Backend Python
│   ├── routes/       # Blueprints de API (auth, rides, reports)
│   ├── app.py        # Ponto de entrada do servidor
│   ├── config.py     # Configurações de ambiente
│   ├── models.py     # Modelos de Banco de Dados
│   └── requirements.txt # Dependências Python
├── types.ts          # Definições de Tipos TypeScript
├── App.tsx           # Componente Principal
└── index.html        # Entry point HTML
```

---

## 👤 Autor

Desenvolvido por **Anselmo Dora Bistiro Gulane**.

© 2025 FambaGo Inc. Todos os direitos reservados.
