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
