// ── engine/pipeline.js ──────────────────────────────────────────
// Motor do pipeline de 5 estágios: IF → ID → EX → MEM → WB
// Detecta hazards, calcula forwarding, monta tabela ciclo a ciclo.

export const STAGES = ['IF', 'ID', 'EX', 'MEM', 'WB']

/** Classifica instrução Assembly em tipo e dependências. */
export function classifyInstr(raw) {
  const s  = raw.trim()
  const up = s.toUpperCase()

  if (!s || s.startsWith(';') || s.startsWith('#') || up === 'NOP')
    return { raw: s, op: 'NOP', itype: 'NOP', reads: [], writes: [], isLoad: false, isStore: false, isBranch: false }

  // R-type: OP RD, RS1, RS2
  let m = up.match(/^(ADD|SUB|AND|OR|XOR|SLL|SRL|SRA|MUL|DIV|ADDU|SUBU|SLT|SLTU)\s+(\w+),\s*(\w+),\s*(\w+)/)
  if (m) return { raw: s, op: m[1], itype: 'R', rd: m[2], rs1: m[3], rs2: m[4], reads: [m[3], m[4]], writes: [m[2]], isLoad: false, isStore: false, isBranch: false }

  // I-type aritmético: OP RD, RS1, IMM
  m = up.match(/^(ADDI|SUBI|ANDI|ORI|XORI|SLTI|ADDIU|SLTIU)\s+(\w+),\s*(\w+),\s*(-?\w+)/)
  if (m) return { raw: s, op: m[1], itype: 'I', rd: m[2], rs1: m[3], imm: m[4], reads: [m[3]], writes: [m[2]], isLoad: false, isStore: false, isBranch: false }

  // Load: LW RD, IMM(RS1)
  m = up.match(/^(LW|LB|LH|LD|LBU|LHU)\s+(\w+),\s*-?\w+\((\w+)\)/)
  if (m) return { raw: s, op: m[1], itype: 'L', rd: m[2], rs1: m[3], reads: [m[3]], writes: [m[2]], isLoad: true, isStore: false, isBranch: false }

  // Load alternativo: LW RD, RS1, IMM
  m = up.match(/^(LW|LB|LH|LD|LBU|LHU)\s+(\w+),\s*(\w+),\s*-?\w+/)
  if (m) return { raw: s, op: m[1], itype: 'L', rd: m[2], rs1: m[3], reads: [m[3]], writes: [m[2]], isLoad: true, isStore: false, isBranch: false }

  // Store: SW RS2, IMM(RS1)
  m = up.match(/^(SW|SB|SH|SD)\s+(\w+),\s*-?\w+\((\w+)\)/)
  if (m) return { raw: s, op: m[1], itype: 'S', reads: [m[2], m[3]], writes: [], isLoad: false, isStore: true, isBranch: false }

  // Branch: BEQ/BNE/... RS1, RS2, LABEL
  m = up.match(/^(BEQ|BNE|BLT|BGE|BGT|BLE|BLTU|BGEU|B\.EQ|B\.NE|B\.GT|B\.LT|JMP|J|B|JAL|JR|JALR)\s+(\w+)(?:,\s*(\w+))?/)
  if (m) {
    const rs = [m[2], m[3]].filter(Boolean)
    return { raw: s, op: m[1], itype: 'B', reads: rs, writes: [], isLoad: false, isStore: false, isBranch: true }
  }

  // MOV/MV
  m = up.match(/^(MOV|MV|MOVE)\s+(\w+),\s*(\w+)/)
  if (m) return { raw: s, op: m[1], itype: 'I', rd: m[2], rs1: m[3], reads: [m[3]], writes: [m[2]], isLoad: false, isStore: false, isBranch: false }

  return { raw: s, op: up.split(/\s/)[0], itype: '?', reads: [], writes: [], isLoad: false, isStore: false, isBranch: false }
}

const ZERO_REGS = new Set(['x0', 'X0', '$zero', 'ZERO', 'XZR', 'R0'])

/** Detecta todos os tipos de hazard entre instruções. */
export function detectHazards(infoList) {
  return infoList.map((curr, i) => {
    const h = { dataHazard: [], loadUse: false, controlHazard: false, stallsFwd: 0, stallsNoFwd: 0 }

    for (let j = Math.max(0, i - 3); j < i; j++) {
      const prev = infoList[j]
      const dist = i - j

      for (const wr of prev.writes ?? []) {
        if (ZERO_REGS.has(wr)) continue
        if ((curr.reads ?? []).includes(wr)) {
          h.dataHazard.push({ from: j, reg: wr, dist })
          if (prev.isLoad && dist === 1) {
            h.loadUse    = true
            h.stallsFwd  = Math.max(h.stallsFwd, 1)
          }
          if (dist === 1) h.stallsNoFwd = Math.max(h.stallsNoFwd, 2)
          else if (dist === 2) h.stallsNoFwd = Math.max(h.stallsNoFwd, 1)
        }
      }
    }

    if (i > 0 && infoList[i - 1].isBranch) {
      h.controlHazard = true
      h.stallsFwd    = Math.max(h.stallsFwd, 2)
      h.stallsNoFwd  = Math.max(h.stallsNoFwd, 2)
    }

    return h
  })
}

/** Monta tabela de execução pipeline ciclo a ciclo. */
export function buildPipelineTable(infoList, hazards, forwarding = true) {
  const n      = infoList.length
  const maxC   = n * 4 + STAGES.length + 10
  const table  = Array.from({ length: n }, () => Array(maxC).fill(''))
  const starts = Array(n).fill(0)

  for (let i = 0; i < n; i++) {
    const h     = hazards[i]
    const extra = forwarding ? h.stallsFwd : h.stallsNoFwd
    starts[i]   = i === 0 ? 0 : starts[i - 1] + 1 + extra

    for (let s = 0; s < extra; s++) {
      const col = starts[i - 1] + 1 + s
      if (col < maxC) table[i][col] = 'stall'
    }

    for (let s = 0; s < STAGES.length; s++) {
      const col = starts[i] + s
      if (col < maxC) table[i][col] = STAGES[s]
    }
  }

  const lastCol = table.reduce((mx, row) => {
    const last = row.map((v, c) => v ? c : 0).reduce((a, b) => Math.max(a, b), 0)
    return Math.max(mx, last)
  }, 0)

  const totalCycles = lastCol + 2
  const trimmed     = table.map(row => row.slice(0, totalCycles))
  const cpi         = n > 0 ? +(totalCycles / n).toFixed(2) : 1.0

  return { table: trimmed, totalCycles, cpi, starts }
}

/** Identifica caminhos de forwarding. */
export function forwardingPaths(infoList, hazards) {
  const paths = []
  hazards.forEach((h, i) => {
    for (const { from, reg, dist } of h.dataHazard) {
      if (h.loadUse && dist === 1) paths.push({ from, to: i, reg, path: 'Load-Use (1 stall)', color: '#ef4444' })
      else if (dist === 1)          paths.push({ from, to: i, reg, path: 'EX→EX Forwarding',  color: '#22c55e' })
      else if (dist === 2)          paths.push({ from, to: i, reg, path: 'MEM→EX Forwarding', color: '#eab308' })
    }
    if (h.controlHazard) paths.push({ from: i - 1, to: i, reg: 'PC', path: 'Control Hazard (2 stalls)', color: '#f97316' })
  })
  return paths
}
