// src/pages/Teoria/Teoria.jsx
// Teoria com abas por camada + aba de tabela de instruções por ISA

import { useState } from 'react'
import { BookOpen, ChevronRight, Table } from 'lucide-react'
import { ISA, ISA_LIST } from '../../data/isa.js'

// ── Conteúdo teórico por camada ───────────────────────────────────
const TEORIA = [
  {
    id: 'alto-nivel', label: 'Alto Nível', color: '#a855f7',
    resumo: 'Linguagens de alto nível (C, Python) abstraem os detalhes do hardware. O compilador/interpretador traduz para instruções de máquina.',
    topicos: [
      { titulo: 'Compilador vs Interpretador', texto: 'O compilador (GCC, Clang) traduz todo o código para binário de uma vez. O interpretador (Python) executa linha a linha. Ambos geram instruções de máquina no final — a diferença é quando.' },
      { titulo: 'Tipos e Representação', texto: 'int = 32 bits com sinal · unsigned = 32 bits sem sinal · short = 16 bits · char = 8 bits. A largura do tipo define como o dado é representado em binário e quais flags podem ser afetados nas operações.' },
      { titulo: 'Chamada de Função', texto: 'Argumentos passados por registradores (RAX, RDI no x86-64) ou pela pilha. Valor de retorno: RAX (x86-64), R0 (ARM), a0 (RISC-V). O compilador define isso via ABI (Application Binary Interface).' },
    ],
    dica: 'Ao escolher int vs unsigned int, você decide se o compilador usará instruções com sinal (IMUL, IDIV) ou sem sinal (MUL, DIV) — isso afeta diretamente os flags OF e CF.',
    ref: 'Zhirkov Cap. 1–2 · Weber Cap. 3',
  },
  {
    id: 'assembly', label: 'Assembly', color: '#3b82f6',
    resumo: 'Assembly é a representação textual das instruções de máquina. Cada mnemonico corresponde a um opcode binário. A ISA define o conjunto disponível.',
    topicos: [
      { titulo: 'Registradores', texto: 'Memória ultra-rápida dentro da CPU. x86-64: RAX, RBX, RCX… (64-bit) · ARM: R0-R15 · RISC-V: x0-x31 (x0 = sempre zero). O compilador faz o mapeamento variável → registrador automaticamente.' },
      { titulo: 'Tipos de Instrução', texto: 'R-type (dois registradores): ADD R1, R2, R3 · I-type (imediato): ADDI R1, R2, 10 · Load/Store: LW / SW · Branch: BEQ, BNE, JMP. Cada tipo tem formato binário diferente na memória.' },
      { titulo: 'CISC vs RISC', texto: 'CISC (x86): instruções complexas de tamanho variável (1–15 bytes). RISC (ARM, RISC-V, MIPS): instruções simples de tamanho fixo (4 bytes). RISC executa 1 instrução/ciclo — ideal para pipeline.' },
    ],
    dica: 'No RISC-V, NÃO existem flags de hardware. Comparações são feitas diretamente nos branches: BEQ rs1, rs2, label. Isso simplifica o hardware mas muda como você escreve condicionais.',
    ref: 'Zhirkov Cap. 2–4 · Weber Cap. 4',
  },
  {
    id: 'binario', label: 'Binário + Flags', color: '#22c55e',
    resumo: 'Internamente tudo é binário. A ULA executa operações e atualiza flags que indicam características do resultado — overflow, zero, sinal, carry.',
    topicos: [
      { titulo: 'Complemento de 2', texto: 'Representação padrão de inteiros com sinal. Para negar: inverter todos os bits e somar 1. Permite que a mesma instrução ADD funcione para positivos e negativos sem circuito separado na ULA.' },
      { titulo: 'Flags: CF, OF, ZF, SF', texto: 'CF (Carry): vai-um do MSB — overflow sem sinal. OF (Overflow): resultado com sinal incorreto. ZF (Zero): resultado = 0. SF (Sign): resultado negativo (MSB=1). PF: paridade do byte baixo.' },
      { titulo: 'SEXT e ZEXT', texto: 'Ao ampliar um tipo estreito: SEXT (Sign Extension) replica o bit de sinal — para tipos com sinal. ZEXT (Zero Extension) preenche com zeros — para tipos sem sinal. x86-64: MOVSX / MOVZX. RISC-V: LB vs LBU.' },
    ],
    dica: 'CF ≠ OF. CF é para aritmética unsigned. OF é para signed. Exemplo: 200 + 56 em 8-bit → CF=1 (estouro unsigned), OF=0 (válido como unsigned).',
    ref: 'Weber Cap. 2 · Patterson & Hennessy Ap. B',
  },
  {
    id: 'portas', label: 'Portas Lógicas', color: '#eab308',
    resumo: 'A ULA é construída com portas lógicas: AND, OR, XOR, NOT. A adição usa Full Adders encadeados (Ripple-Carry Adder).',
    topicos: [
      { titulo: 'Full Adder (1 bit)', texto: 'S = A ⊕ B ⊕ Cin  e  Cout = (A · B) | ((A ⊕ B) · Cin). Total: 2×XOR + 2×AND + 1×OR = 5 portas por bit. Para N bits: 5N portas lógicas.' },
      { titulo: 'Ripple-Carry Adder', texto: 'N Full Adders encadeados — o Cout de cada bit alimenta o Cin do próximo. Simples mas lento para N grande (carry se propaga em cascata). Solução moderna: Carry-Lookahead Adder.' },
      { titulo: 'Subtração via Complemento de 2', texto: 'A − B = A + NOT(B) + 1. Na ULA: inverte B bit a bit e seta Cin=1 no primeiro Full Adder. Nenhum circuito extra necessário — a mesma ULA faz adição e subtração.' },
    ],
    dica: 'O Full Adder é o componente fundamental da CPU. Somar dois números de 64 bits requer 64 Full Adders = 320 portas lógicas, executando em paralelo em nanosegundos.',
    ref: 'Weber Cap. 3 · Patterson & Hennessy B.5',
  },
  {
    id: 'sinais', label: 'Sinais Elétricos', color: '#f97316',
    resumo: 'Bit 0 = tensão LOW (~0V), Bit 1 = tensão HIGH (~3.3V) em CMOS moderno. Transistores implementam as portas lógicas.',
    topicos: [
      { titulo: 'Níveis Lógicos CMOS 3.3V', texto: 'LOW (lógico 0): 0V a 0.8V — transistor NMOS desligado. HIGH (lógico 1): 2.0V a 3.3V — transistor PMOS ligado (VDD). Limiar lógico: ~1.5V. Margem de ruído: ~0.7V.' },
      { titulo: 'Clock e Sincronização', texto: 'Todas as operações são sincronizadas pelo clock. Em 1 ciclo, sinais se propagam pelos transistores e estabilizam antes da próxima borda de subida. A frequência máxima é limitada pelo caminho crítico.' },
      { titulo: 'Fan-out e Propagação', texto: 'Fan-out: quantas entradas uma saída pode acionar. Fan-in: quantas entradas uma porta aceita. Valores altos aumentam a capacitância parasita e diminuem a frequência máxima do clock.' },
    ],
    dica: 'A propagação do carry no Ripple-Carry Adder é o gargalo elétrico: para 64 bits, o sinal elétrico atravessa 64 Full Adders em série antes de estabilizar — por isso CPUs modernas usam Carry-Lookahead.',
    ref: 'Weber Cap. 1 · Tanenbaum Cap. 3',
  },
  {
    id: 'pipeline', label: 'Pipeline', color: '#06b6d4',
    resumo: 'Pipeline divide a execução em estágios independentes (IF→ID→EX→MEM→WB), executando múltiplas instruções simultaneamente.',
    topicos: [
      { titulo: 'Os 5 Estágios', texto: 'IF (Instruction Fetch): busca na memória. ID (Decode): decodifica e lê registradores. EX (Execute): ULA executa. MEM (Memory): acessa RAM. WB (Write Back): escreve resultado no registrador.' },
      { titulo: 'Hazards e Soluções', texto: 'Data hazard: instrução usa registrador não escrito → Forwarding resolve na maioria. Load-Use: 1 stall obrigatório mesmo com forwarding. Control hazard: branch → 2 stalls sem predição de desvio.' },
      { titulo: 'CPI — Cycles Per Instruction', texto: 'CPI ideal = 1.0 (uma instrução por ciclo). Stalls aumentam o CPI. Com forwarding: só Load-Use (+1) e Control (+2). Sem forwarding: todo data hazard gera 2 stalls.' },
    ],
    dica: 'Forwarding (data forwarding): o resultado da ULA é repassado diretamente à entrada do EX do próximo ciclo, sem esperar o WB completar. EX→EX resolve distância 1. MEM→EX resolve distância 2.',
    ref: 'Patterson & Hennessy Cap. 4 · Weber Cap. 6',
  },
  {
    id: 'cache', label: 'Cache', color: '#ef4444',
    resumo: 'Cache é memória ultra-rápida entre CPU e RAM. Explora localidade temporal e espacial para reduzir latência.',
    topicos: [
      { titulo: 'Tag, Índice, Offset', texto: 'O endereço é dividido em 3 partes: Tag (identifica qual bloco da RAM), Index (qual conjunto/linha da cache), Offset (byte dentro do bloco). Tamanho do bloco determina o offset.' },
      { titulo: 'Mapeamento Direto vs Associativo', texto: 'Direto (1-way): cada bloco RAM mapeia em exatamente 1 linha — simples, mas sofre thrashing. 2-way: 2 opções por conjunto. 4-way: 4 opções. Política LRU descarta a linha usada há mais tempo.' },
      { titulo: 'AMAT', texto: 'Average Memory Access Time = HitTime + MissRate × MissPenalty. Exemplo: HitTime=1, MissPenalty=10 ciclos. Com 20% miss: AMAT = 1 + 0.2×10 = 3 ciclos.' },
    ],
    dica: 'Thrashing: dois endereços mapeiam na mesma linha (cache direta) e se alternam → 100% miss. Solução: cache 2-way ou 4-way, que permite duas ou quatro opções por índice.',
    ref: 'Patterson & Hennessy Cap. 5',
  },
]

// ── Categorias de instrução para agrupamento ──────────────────────
const CAT_ORDER = ['Transferência','Pseudo','Aritmética','Lógica','Deslocamento','Comparação','Branch','Salto','Chamada','Memória','Sistema']

// ── Aba: Tabela de instruções da ISA ─────────────────────────────
function TabelaISA() {
  const [isaKey, setIsaKey] = useState('x86-64')
  const [catFilter, setCatFilter] = useState('Todas')
  const cfg = ISA[isaKey]
  const instrucoes = cfg.instrucoes || []
  const cats = ['Todas', ...CAT_ORDER.filter(c => instrucoes.some(i => i.cat === c))]
  const filtered = catFilter === 'Todas' ? instrucoes : instrucoes.filter(i => i.cat === catFilter)

  return (
    <div className="flex flex-col gap-5">

      {/* Seletor ISA */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="section-title">ISA</span>
        <div className="flex flex-wrap gap-1.5">
          {ISA_LIST.map(k => (
            <button key={k} onClick={() => { setIsaKey(k); setCatFilter('Todas') }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
                    style={{
                      background:   isaKey === k ? `${ISA[k].color}25` : 'var(--bg-card)',
                      border:       `1px solid ${isaKey === k ? ISA[k].color + '60' : 'var(--bg-border)'}`,
                      color:        isaKey === k ? ISA[k].color : 'var(--text-secondary)',
                      fontWeight:   isaKey === k ? '700' : '400',
                    }}>
              {ISA[k].short}
            </button>
          ))}
        </div>
      </div>

      {/* Info da ISA */}
      <div className="rounded-xl p-4 border text-xs font-mono"
           style={{ background: `${cfg.color}0d`, borderColor: `${cfg.color}30` }}>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5" style={{ color: 'var(--text-secondary)' }}>
          {[
            ['ISA',       cfg.name],
            ['Tipo',      cfg.type],
            ['Bits',      cfg.bits + '-bit'],
            ['Endian',    cfg.endian],
            ['Flags HW',  cfg.flags.join(', ')],
            ['Reg. Flags',cfg.flagReg],
            ['SEXT',      cfg.sext],
            ['ZEXT',      cfg.zext],
          ].map(([k, v]) => (
            <span key={k}>
              <span style={{ color: 'var(--text-muted)' }}>{k}: </span>
              <span style={{ color: cfg.color }}>{v}</span>
            </span>
          ))}
        </div>
        <div className="mt-2 pt-2 text-[11px]"
             style={{ borderTop: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}>
          {cfg.note}
        </div>
      </div>

      {/* Filtro por categoria */}
      <div className="flex flex-wrap gap-1.5">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
                  className="px-3 py-1 rounded-lg text-xs font-mono transition-all"
                  style={{
                    background: catFilter === c ? 'var(--bg-border)'  : 'var(--bg-card)',
                    border:     '1px solid var(--bg-border)',
                    color:      catFilter === c ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: catFilter === c ? '700' : '400',
                  }}>
            {c}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--bg-border)' }}>
        <table className="isa-table">
          <thead>
            <tr>
              <th style={{ color: cfg.color, width: 40 }}>Cat.</th>
              <th style={{ width: 80 }}>Mnemônico</th>
              <th style={{ width: 160 }}>Operandos</th>
              <th>Descrição</th>
              <th style={{ width: 200 }}>Exemplo</th>
              <th style={{ width: 160 }}>Flags afetados</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((instr, i) => (
              <tr key={i}>
                <td>
                  <span className="badge text-[9px]"
                        style={{ background: `${cfg.color}15`, color: cfg.color, borderColor: `${cfg.color}30` }}>
                    {instr.cat}
                  </span>
                </td>
                <td>
                  <span className="font-mono font-bold text-xs" style={{ color: '#63b3ed' }}>
                    {instr.mn}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-[11px]" style={{ color: '#68d391' }}>
                    {instr.ops}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{instr.desc}</td>
                <td>
                  <code className="text-[11px] font-mono px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--bg-card)', color: '#f6ad55' }}>
                    {instr.ex}
                  </code>
                </td>
                <td>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    {instr.flags}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-right font-mono" style={{ color: 'var(--text-muted)' }}>
        {filtered.length} instrução(ões) · {cfg.name}
      </div>
    </div>
  )
}

// ── Página de Teoria ──────────────────────────────────────────────
export default function Teoria() {
  const [active, setActive] = useState('alto-nivel')
  const isTabela = active === 'tabela-isa'
  const tab = TEORIA.find(t => t.id === active)

  // Todas as abas (teoria + tabela)
  const ALL_TABS = [
    ...TEORIA.map(t => ({ id: t.id, label: t.label, color: t.color, icon: null })),
    { id: 'tabela-isa', label: 'Tabela ISA', color: '#94a3b8', icon: Table },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BookOpen size={22} className="text-accent-blue" />
        <div>
          <h1 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Teoria</h1>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Revisão rápida por camada de abstração · Tabela de instruções por ISA
          </p>
        </div>
      </div>

      <div className="flex gap-6">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col gap-1 w-44 flex-shrink-0">
          {ALL_TABS.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)}
                    className="text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2"
                    style={active === t.id
                      ? { background: `${t.color}18`, color: t.color }
                      : { color: 'var(--text-secondary)' }}>
              {t.icon && <t.icon size={12} />}
              {t.label}
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden w-full mb-4 flex gap-1 overflow-x-auto pb-1">
          {ALL_TABS.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                    style={active === t.id
                      ? { background: `${t.color}18`, color: t.color }
                      : { color: 'var(--text-secondary)' }}>
              {t.icon && <t.icon size={11} />}
              {t.label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0 animate-slide-up" key={active}>

          {isTabela ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Table size={16} style={{ color: '#94a3b8' }} />
                <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  Tabela de Instruções por ISA
                </h2>
              </div>
              <TabelaISA />
            </>
          ) : tab ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ background: tab.color }} />
                <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  {tab.label}
                </h2>
              </div>

              <div className="rounded-xl px-5 py-4 mb-6 border text-sm leading-relaxed"
                   style={{ background: `${tab.color}0d`, borderColor: `${tab.color}30`, color: 'var(--text-primary)' }}>
                {tab.resumo}
              </div>

              <div className="flex flex-col gap-4 mb-6">
                {tab.topicos.map((t, i) => (
                  <div key={i} className="card">
                    <div className="flex items-start gap-3">
                      <ChevronRight size={14} className="mt-0.5 flex-shrink-0" style={{ color: tab.color }} />
                      <div>
                        <div className="font-display font-semibold text-sm mb-1.5" style={{ color: 'var(--text-primary)' }}>
                          {t.titulo}
                        </div>
                        <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {t.texto}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl px-5 py-4 mb-4"
                   style={{ border: '1px solid rgba(234,179,8,0.3)', background: 'rgba(234,179,8,0.05)' }}>
                <div className="text-accent-yellow text-xs font-mono font-bold mb-1.5">💡 DICA PRÁTICA</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {tab.dica}
                </div>
              </div>

              <div className="text-xs font-mono text-right" style={{ color: 'var(--text-muted)' }}>
                📚 {tab.ref}
              </div>
            </>
          ) : null}

        </div>
      </div>
    </div>
  )
}
