<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<p align="center">
  <!-- CI badge: substitua <owner>/<repo> pelo caminho real -->
  
</p>

# Array Lab — NumPy Array Simulator

**Visualize como o NumPy gerencia memória, strides e shapes — diretamente no navegador.**

> Aplicação educativa em React + TypeScript que emula o comportamento de arrays NumPy (engine em JavaScript) para mostrar como dados são organizados e acessados na memória.

---

## ✅ Destaques

- Visualização sincronizada da vista N‑D e da memória física
- Controle de `strides`, `dtype` e ordem (C / F)
- Simulações interativas de reshape, slice, views vs copies
- Interface responsiva com componentes modulares (TypeScript + Vite)

---

## 🔧 Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS (estilos utilitários)
- Engine de simulação: `utils/numpyEngine.ts`

---

## 🚀 Executando localmente

**Pré-requisitos:** Node.js (>= 16) e npm

1. Instale dependências:

```bash
npm install
```

2. (Opcional) Para integrações com AI Studio ou recursos experimentais, adicione variáveis de ambiente em `.env.local`. Exemplo:

```env
GEMINI_API_KEY=your_api_key_here
```

3. Rode em modo desenvolvimento:

```bash
npm run dev
```

4. Build de produção:

```bash
npm run build
npm run preview
```

> Visualize o app em: http://localhost:5173 (a porta pode variar)

---

## 🧭 Estrutura do projeto (resumo)

- `components/` — componentes UI principais
  - `LandingPage.tsx` — página inicial promocional
  - `Simulator.tsx` — área principal de simulação
  - `ArrayVisualizer.tsx`, `MemoryVisualizer.tsx` — visualizadores sincronizados
- `utils/numpyEngine.ts` — motor que emula operações de NumPy (reshape, strides, slicing)
- `index.tsx`, `App.tsx` — bootstrapping da aplicação
- `types.ts` — tipos TypeScript compartilhados

---

## 🛠️ Dicas para desenvolvedores

- Siga o padrão `components` + `utils` para separar UI da lógica de simulação.
- Limites visuais são intencionais (ex: shapes pequenos) para performance e didática — preserve-os ao adicionar features.
- Ao modificar `numpyEngine.ts`, adicione testes manuais na UI e verifique comportamentos de view vs copy.

---

## ♻️ Contribuições

Contribuições são bem-vindas! Abra uma issue para discutir ideias e envie PRs com mudanças pequenas e bem documentadas.

---

## 📄 Licença

MIT

---

## 🔗 Links úteis

- Visualizar no AI Studio: https://ai.studio/apps/drive/1QEBSv0_SNX3ZltRXHMaOJMdq97QvkXnr

Se quiser, posso também adicionar um `CONTRIBUTING.md`, exemplos de uso ou badges de CI. Quer que eu inclua algo mais no README? ✨