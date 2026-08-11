# alterdata-web

Frontend (Next.js 16 + App Router) do sistema de gestão do escritório — login e telas web que
consomem a [alterdata-api](../alterdata-api). É a interface que o time (escritório + home office)
acessa pelo navegador.

## Setup

```bash
npm install
cp .env.local.example .env.local
# edite .env.local se a alterdata-api não estiver em http://localhost:3000/api
npm run dev
```

Sobe em `http://localhost:3001` (a `alterdata-api` já usa a porta 3000).

## Como funciona a autenticação

- Login é uma Server Action ([`src/app/login/actions.ts`](src/app/login/actions.ts)) que chama
  `POST /auth/login` na API e guarda o JWT retornado num cookie **httpOnly** (`session_token`,
  ver [`src/lib/session.ts`](src/lib/session.ts)) — o token nunca fica acessível a JavaScript no
  navegador (mitiga XSS).
- [`proxy.ts`](proxy.ts) (arquivo de proxy do Next 16 — sucessor do antigo `middleware.ts`)
  redireciona para `/login` qualquer rota quando o cookie de sessão não existe.
- Todas as chamadas à API acontecem no servidor (Server Components/Actions via
  [`src/lib/api.ts`](src/lib/api.ts)), que anexa `Authorization: Bearer <token>` automaticamente.
  Isso significa que o token também nunca trafega para o navegador em nenhuma resposta JSON.
- Se o token expirar (JWT), a API responde 401 e a página redireciona para `/login` — o proxy só
  checa se o cookie *existe*, não se o token ainda é válido.

## Estrutura

```
proxy.ts                    # protege rotas (redireciona para /login sem sessão)
src/
  lib/
    session.ts               # get/set/clear do cookie httpOnly
    api.ts                    # fetch autenticado para a alterdata-api + loginRequest
    auth-actions.ts           # Server Action de logout
    types.ts                  # tipos compartilhados (User, Cliente)
  components/
    LogoutButton.tsx
  app/
    login/
      page.tsx                # tela de login (Server Component, lê ?redirectTo=)
      LoginForm.tsx            # form (Client Component, useActionState)
      actions.ts               # Server Action de login
    page.tsx                   # dashboard: usuário logado + lista de clientes
```

## Próximos passos

- Telas de CRUD completo do módulo Clientes (criar/editar contato, endereço, contrato, tags).
- Gestão de usuários internos (`/usuarios-internos` na API) para papel ADMIN convidar a equipe.
- Deploy: Vercel é o caminho mais direto para este projeto (framework-native); configurar
  `API_URL` apontando para a `alterdata-api` já hospedada (Railway/Render).
