# FitProManager

Um sistema de gerenciamento para profissionais de fitness, ajudando a organizar clientes, treinos, finanças e mais.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

*   Node.js (versão 18 ou superior recomendada)
*   npm (gerenciador de pacotes do Node.js)

## Configuração do Projeto

Siga os passos abaixo para configurar o projeto localmente:

1.  **Obtenha os arquivos do projeto:**

    Se você clonou via Git, use o comando apropriado. Se obteve os arquivos de outra forma, apenas navegue até a pasta raiz do projeto.

2.  **Instale as dependências:**

    Navegue até o diretório raiz do projeto no terminal e execute:

    ```bash
    npm install
    ```

3.  **Configuração do Supabase:**

    Este projeto utiliza o Supabase como backend. Você precisará configurar seu próprio projeto Supabase.

    *   Crie um novo projeto no [Supabase](https://supabase.com/).
    *   Obtenha a URL do projeto e a chave `anon` nas configurações do seu projeto Supabase (Settings &gt; API).

    Crie um arquivo chamado `.env` na raiz do projeto (se ele ainda não existir) e adicione as seguintes variáveis, substituindo os valores pelos do seu projeto Supabase:

    ```env
    VITE_SUPABASE_URL=SUA_URL_DO_SUPABASE
    VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_DO_SUPABASE
    ```

    **Importante:** Não compartilhe seu arquivo `.env` ou suas chaves do Supabase publicamente.

4.  **Configuração do Banco de Dados (Supabase Migrations):**

    O esquema do banco de dados necessário para o projeto está definido em arquivos de migração SQL.

    *   Os arquivos de migração estão localizados na pasta `/supabase/migrations`.
    *   Você precisará aplicar essas migrações ao seu banco de dados Supabase. A forma mais recomendada é usar a CLI do Supabase (`supabase cli`). Consulte a documentação oficial do Supabase para instruções sobre como usar a CLI para aplicar migrações.

    *(Nota: Certifique-se de que as tabelas e políticas de Row Level Security (RLS) definidas nas migrações estejam corretamente aplicadas no seu projeto Supabase.)*

## Rodando o Projeto

Após configurar o Supabase e instalar as dependências, você pode iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173` (ou outra porta, se 5173 estiver ocupada).

## Estrutura do Projeto

*   `src/`: Código fonte da aplicação React.
*   `src/components/`: Componentes reutilizáveis.
*   `src/contexts/`: Contextos React (ex: `AuthContext`).
*   `src/lib/`: Funções utilitárias e configuração (ex: `supabase.ts`).
*   `src/pages/`: Páginas principais da aplicação (rotas).
*   `supabase/migrations/`: Arquivos de migração SQL para o banco de dados Supabase.
*   `.env`: Arquivo para variáveis de ambiente (não incluído no controle de versão).
*   `package.json`: Dependências e scripts do projeto.

## Contribuindo

*(Se aplicável, adicione informações sobre como outras pessoas podem contribuir para o projeto.)*

## Licença

*(Se aplicável, adicione informações sobre a licença do projeto.)*
