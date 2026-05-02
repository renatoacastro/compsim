# CompSim — Simulador de Arquitetura de Computadores

**Autor:** Renato A. Castro  
**Disciplina:** Arquitetura de Computadores  
**URL:** https://renatoacastro.github.io/compsim

---

## Sobre

Simulador didático das camadas de abstração de computadores:

```
[Python / C] → [Assembly] → [ISA] → [Binário + Flags] → [Portas Lógicas] → [Sinais Elétricos]
```

Cobre os laboratórios de Arquitetura de Computadores (Práticas I e II).

---

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com diagrama de abstração |
| `/teoria` | Revisão teórica por camada |
| `/simulador1` | Lab 1: Alto Nível → Assembly → Binário → ULA → Sinais |
| `/simulador2` | Lab 2: Controle de Fluxo · Pipeline · Cache |
| `/atividade` | Avaliação por grupo com senha |

---

## Setup local

```bash
# 1. Clone o repositório
git clone https://github.com/renatoacastro/compsim.git
cd compsim

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Acesse em http://localhost:5173/compsim/
```

---

## Deploy no GitHub Pages

O deploy é automático ao fazer push para a branch `main`.  
Configurado via `.github/workflows/deploy.yml`.

Para o primeiro deploy manual:
```bash
git add .
git commit -m "feat: initial setup"
git push origin main
```

Após o push, acesse:
`Settings → Pages → Source: GitHub Actions`

---

## Estrutura

```
src/
├── engine/        # Lógica pura (sem UI): assembler, binary, pipeline, cache
├── data/          # Dados estáticos: ISAs, teoria, enunciados
├── components/    # Componentes React reutilizáveis
├── pages/         # Uma pasta por rota/página
└── hooks/         # Hooks React (tema, estado)
```

---

## ISAs suportadas

- **x86-64** (Intel/AMD) — CISC, EFLAGS
- **ARM 32-bit** — RISC, CPSR
- **ARM64 / AArch64** — RISC 64-bit, PSTATE
- **RISC-V RV32I** — ISA aberta, sem flags HW
- **MIPS 32-bit** — RISC clássico, delay slots

---

## Tecnologias

- React 18 + Vite
- React Router v6
- Tailwind CSS v3
- D3.js (diagramas)
- Lucide React (ícones)
- GitHub Pages (hospedagem)
