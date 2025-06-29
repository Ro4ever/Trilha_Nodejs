# Plataforma de Feedback

Uma aplicação web desenvolvida com **Next.js** para coleta e gestão de feedbacks de usuários. Permite que usuários enviem suas opiniões de forma simples e rápida, enquanto os administradores podem visualizar, organizar e tratar esses dados.

## Tecnologias Utilizadas

- **Next.js** — Framework React para produção
- **React** — Biblioteca de interfaces modernas
- **TypeScript** — Tipagem estática para maior confiabilidade
- **Tailwind CSS** — Utilitário CSS para estilização rápida
- **PostCSS** — Processador de CSS moderno
- **ESLint** — Padronização e análise de código
- **Autoprefixer** — Compatibilidade automática com navegadores

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/Ro4ever/plataforma-feedback.git
cd plataforma-feedback
````

2. Instale as dependências:

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```
# Exemplo de variáveis:
NEXT_PUBLIC_API_URL=https://sua-api.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=UA-XXXXXXX-X
```

> Substitua os valores pelas suas configurações reais.

## Executando o Projeto

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Outros scripts disponíveis:

* `npm run build` — Gera build de produção
* `npm start` — Inicia servidor com build
* `npm run lint` — Verifica erros de lint

## Estrutura do Projeto

```
plataforma-feedback/
├── .env                   # Variáveis de ambiente
├── package.json           # Dependências e scripts
├── node_modules/          # Módulos instalados
├── public/                # Arquivos públicos e estáticos
├── styles/                # Estilização global (Tailwind, etc.)
├── pages/                 # Rotas da aplicação (Next.js)
├── components/            # Componentes reutilizáveis
├── lib/                   # Funções auxiliares / configs
└── README.md              # Este arquivo
```

## Dependências

Inclui algumas das principais:

* `next`
* `react`
* `react-dom`
* `typescript`
* `tailwindcss`
* `postcss`
* `autoprefixer`

## Dependências de Desenvolvimento

* `eslint`
* `eslint-config-next`

## Prints

![Captura de tela 2025-06-29 001735](https://github.com/user-attachments/assets/784620ee-cf69-48db-951d-01d174126dab)
![Captura de tela 2025-06-29 001619](https://github.com/user-attachments/assets/a5734ea3-175d-496e-9561-e14a58f05930)
![Captura de tela 2025-06-29 001702](https://github.com/user-attachments/assets/3866bdf1-e8f9-441b-bbf7-16c49bb8186b)
