# Contribuindo para o Array Lab

Obrigado por contribuir! Este documento descreve um fluxo de trabalho simples para tornar contribuições fáceis de revisar e aceitar.

## Como contribuir

1. Abra uma *issue* para discutir mudanças grandes antes de começar a implementar.
2. Faça um fork e crie uma branch com nome descritivo: `feature/descricao-curta` ou `fix/descricao-curta`.
3. Faça commits pequenos e com mensagens claras (use o formato: `tipo: descrição curta`, ex: `feat: adicionar suporte a dtype float16`).
4. Abra um Pull Request apontando para `main` e descreva:
   - O que foi feito
   - Como testar / reproduzir
   - Qualquer decisão de design importante

## Requisitos e verificação local

- Instale dependências com `npm install`.
- Rode a aplicação localmente: `npm run dev`.
- Antes de enviar, verifique formatação e lint (se aplicável):

```bash
npm run lint || echo "Adicionar script de lint se necessário"
npm run build
```

## Revisão de PR

- PRs devem ser pequenos e fáceis de revisar.
- Incluir screenshots/gifs para mudanças visuais.
- Testes manuais: verificar casos de edge para `numpyEngine` (reshape, slice, view vs copy).

## Código e estilo

- Código em TypeScript; mantenha os tipos claros e os componentes pequenos.
- Separe lógica de visualização (`components/`) da lógica de simulação (`utils/`).

## Código de Conduta

Seja respeitoso e cordial. Atitudes hostis não serão toleradas. Ao contribuir, você concorda em seguir o código de conduta do projeto.

---

Se quiser, posso adicionar templates de *issue* e *pull request* (GitHub) e um script de verificação (lint/test) no `package.json`.
