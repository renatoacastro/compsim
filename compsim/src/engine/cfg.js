// ── engine/cfg.js ────────────────────────────────────────────────
// Parser de código Python ou C → lista de blocos básicos com conexões.
// Usado para gerar o CFG (Grafo de Fluxo de Controle).
//
// Tipos de bloco:
//   entry, exit, condition, body, init, update
//
// Conexões:
//   nextTo   — fluxo sequencial
//   trueTo   — branch verdadeiro
//   falseTo  — branch falso
//   (back-edge = trueTo/falseTo para bloco com id menor)

export function parseCFG(code, lang = 'Python') {
  const blocks = []
  let bid      = 0

  function newBlock(type, lines = []) {
    const b = { id: bid++, type, lines, nextTo: null, trueTo: null, falseTo: null }
    blocks.push(b)
    return b
  }

  function collectBodyPy(lines, i) {
    const body = []
    while (i < lines.length) {
      const ln = lines[i]
      if (ln.startsWith('    ') || ln.startsWith('\t')) { body.push(ln.trim()); i++ }
      else break
    }
    return [body, i]
  }

  function collectBodyC(lines, i) {
    const body = []
    let depth  = 0
    while (i < lines.length) {
      const s = lines[i].trim()
      if (s.includes('{')) depth += (s.match(/\{/g) || []).length
      if (s.includes('}')) {
        depth -= (s.match(/\}/g) || []).length
        if (depth <= 0) { i++; break }
      }
      if (s !== '{') body.push(s)
      i++
    }
    return [body, i]
  }

  const entry = newBlock('entry', ['INÍCIO'])
  let prev    = entry
  const src   = code.split('\n')
  let i       = 0

  while (i < src.length) {
    const raw  = src[i]
    const line = raw.trim()
    if (!line) { i++; continue }

    // ── if / elif ────────────────────────────────────────────────
    const mIf = lang === 'Python'
      ? line.match(/^(?:if|elif)\s+(.+?)\s*:$/)
      : line.match(/^(?:else\s+)?if\s*\((.+?)\)\s*\{?$/)

    if (mIf) {
      const cond  = mIf[1].trim()
      const condB = newBlock('condition', ['SE ' + cond + '?'])
      if (prev) prev.nextTo = condB.id
      i++
      let bodyLines, elseLines
      if (lang === 'Python')  [bodyLines, i] = collectBodyPy(src, i)
      else                    [bodyLines, i] = collectBodyC(src, i)
      const bodyB = newBlock('body', bodyLines.length ? bodyLines : ['(corpo then)'])
      condB.trueTo = bodyB.id

      // check else
      const elLine = src[i]?.trim()
      const isElse = lang === 'Python'
        ? elLine === 'else:'
        : /^else\s*\{?$/.test(elLine || '')

      if (isElse) {
        i++
        if (lang === 'Python') [elseLines, i] = collectBodyPy(src, i)
        else                   [elseLines, i] = collectBodyC(src, i)
        const elseB  = newBlock('body', elseLines.length ? elseLines : ['(corpo else)'])
        const mergeB = newBlock('body', ['(continua)'])
        condB.falseTo  = elseB.id
        bodyB.nextTo   = mergeB.id
        elseB.nextTo   = mergeB.id
        prev = mergeB
      } else {
        const mergeB = newBlock('body', ['(continua)'])
        condB.falseTo = mergeB.id
        bodyB.nextTo  = mergeB.id
        prev = mergeB
      }
      continue
    }

    // ── else isolado ─────────────────────────────────────────────
    if ((lang === 'Python' && line === 'else:') ||
        (lang === 'C' && /^else\s*\{?$/.test(line))) { i++; continue }

    // ── for ──────────────────────────────────────────────────────
    const mFor = lang === 'Python'
      ? line.match(/^for\s+(\w+)\s+in\s+range\((.+?)\)/)
      : line.match(/^for\s*\(([^;]+);([^;]+);([^)]+)\)/)

    if (mFor) {
      let initLbl, condLbl, updtLbl
      if (lang === 'Python') {
        const v    = mFor[1]
        const args = mFor[2].split(',').map(s => s.trim())
        const start = args.length > 1 ? args[0] : '0'
        const end   = args.length > 1 ? args[1] : args[0]
        const step  = args[2] || '1'
        initLbl = `INIT: ${v} = ${start}`
        condLbl = `COND: ${v} < ${end}?`
        updtLbl = `UPDATE: ${v} += ${step}`
      } else {
        initLbl = 'INIT: '  + mFor[1].trim()
        condLbl = 'COND: '  + mFor[2].trim() + '?'
        updtLbl = 'UPDATE: '+ mFor[3].trim()
      }

      const initB  = newBlock('init',      [initLbl])
      const condB  = newBlock('condition', [condLbl])
      if (prev) prev.nextTo = initB.id
      initB.nextTo = condB.id
      i++
      let bodyLines
      if (lang === 'Python') [bodyLines, i] = collectBodyPy(src, i)
      else                   [bodyLines, i] = collectBodyC(src, i)
      const bodyB  = newBlock('body',   bodyLines.length ? bodyLines : ['(corpo)'])
      const updtB  = newBlock('update', [updtLbl])
      const exitB  = newBlock('body',   ['(após for)'])
      condB.trueTo  = bodyB.id
      condB.falseTo = exitB.id
      bodyB.nextTo  = updtB.id
      updtB.nextTo  = condB.id   // back-edge
      prev = exitB
      continue
    }

    // ── while ─────────────────────────────────────────────────────
    const mWh = lang === 'Python'
      ? line.match(/^while\s+(.+?)\s*:$/)
      : line.match(/^while\s*\((.+?)\)\s*\{?$/)

    if (mWh) {
      const cond  = mWh[1].trim()
      const condB = newBlock('condition', ['COND: ' + cond + '?'])
      if (prev) prev.nextTo = condB.id
      i++
      let bodyLines
      if (lang === 'Python') [bodyLines, i] = collectBodyPy(src, i)
      else                   [bodyLines, i] = collectBodyC(src, i)
      const bodyB = newBlock('body', bodyLines.length ? bodyLines : ['(corpo)'])
      const exitB = newBlock('body', ['(após while)'])
      condB.trueTo  = bodyB.id
      condB.falseTo = exitB.id
      bodyB.nextTo  = condB.id  // back-edge
      prev = exitB
      continue
    }

    // ── do-while (C only) ─────────────────────────────────────────
    if (lang === 'C' && /^do\s*\{?$/.test(line)) {
      const bodyLines = []
      let doCondStr   = 'cond'
      i++
      while (i < src.length) {
        const s = src[i].trim()
        const mw = s.match(/^}\s*while\s*\((.+?)\)/)
        if (mw) { doCondStr = mw[1].trim(); i++; break }
        bodyLines.push(s); i++
      }
      const bodyB = newBlock('body',      bodyLines.length ? bodyLines : ['(corpo)'])
      const condB = newBlock('condition', ['COND: ' + doCondStr + '?'])
      const exitB = newBlock('body',      ['(após do-while)'])
      if (prev) prev.nextTo = bodyB.id
      bodyB.nextTo  = condB.id
      condB.trueTo  = bodyB.id  // back-edge
      condB.falseTo = exitB.id
      prev = exitB
      continue
    }

    // ── instrução comum ───────────────────────────────────────────
    const stmtB = newBlock('body', [line.replace(/;$/, '')])
    if (prev) prev.nextTo = stmtB.id
    prev = stmtB
    i++
  }

  const fin = newBlock('exit', ['FIM'])
  if (prev) prev.nextTo = fin.id
  return blocks
}

/**
 * Gera Assembly simplificado para estruturas de controle.
 * Retorna { lines, instrCount }.
 */
export function generateFlowAsm(code, lang, isaKey) {
  // Importado dinamicamente para evitar dependência circular
  const lines   = []
  const ISA_MAP = {
    'x86-64': { cmp: 'CMP', jmpF: { '>': 'JLE', '<': 'JGE', '>=': 'JL', '<=': 'JG', '==': 'JNE', '!=': 'JE' }, jmp: 'JMP', inc: 'INC', loop: ['RCX','RAX','RBX'], note: 'RFLAGS' },
    'ARM32':  { cmp: 'CMP', jmpF: { '>': 'BLE', '<': 'BGE', '>=': 'BLT', '<=': 'BGT', '==': 'BNE', '!=': 'BEQ' }, jmp: 'B', inc: 'ADD Rd,Rd,#1', loop: ['R4','R5','R6'], note: 'CPSR' },
    'ARM64':  { cmp: 'CMP', jmpF: { '>': 'B.LE', '<': 'B.GE', '>=': 'B.LT', '<=': 'B.GT', '==': 'B.NE', '!=': 'B.EQ' }, jmp: 'B', inc: 'ADD X,X,#1', loop: ['X19','X20','X21'], note: 'PSTATE' },
    'RISC-V': { cmp: null,  jmpF: { '>': 'BLE', '<': 'BGE', '>=': 'BLT', '<=': 'BGT', '==': 'BNE', '!=': 'BEQ' }, jmp: 'J', inc: 'ADDI t,t,1', loop: ['t0','t1','t2'], note: 'sem flags HW' },
    'MIPS':   { cmp: null,  jmpF: { '>': 'BLE', '<': 'BGE', '>=': 'BLT', '<=': 'BGT', '==': 'BNE', '!=': 'BEQ' }, jmp: 'J', inc: 'ADDIU $t,$t,1', loop: ['$t0','$t1','$t2'], note: 'sem EFLAGS' },
  }

  const cfg   = ISA_MAP[isaKey] || ISA_MAP['x86-64']
  const [r0, r1, r2] = cfg.loop

  lines.push(`; ── Assembly — ${isaKey} ── Flags: ${cfg.note}`)
  lines.push('')

  for (const rawLine of code.split('\n')) {
    const line = rawLine.trim().replace(/;$/, '')
    if (!line) { lines.push(''); continue }
    if (line.startsWith('#') || line.startsWith('//')) { lines.push('; ' + line.replace(/^[#/]+\s*/, '')); continue }

    // if cond
    const mIf = lang === 'Python'
      ? line.match(/^(?:if|elif)\s+(.+?)\s*:$/)
      : line.match(/^(?:else\s+)?if\s*\((.+?)\)/)
    if (mIf) {
      const cond = mIf[1].trim()
      lines.push(`; [if] ${line}`)
      const mc = cond.match(/(\w+)\s*(==|!=|>|<|>=|<=)\s*(\w+)/)
      if (mc) {
        const [, , op] = mc
        const jf = cfg.jmpF[op] || 'JNE'
        if (cfg.cmp) lines.push(`    ${cfg.cmp.padEnd(6)} ${r0}, ${r1}`)
        lines.push(`    ${jf.padEnd(6)} .Lelse             ; se NÃO (${cond}), pula`)
        lines.push('    ; ↓ bloco then')
      }
      continue
    }

    // else
    if ((lang === 'Python' && line === 'else:') || (lang === 'C' && /^else\s*\{?/.test(line))) {
      lines.push(`    ${cfg.jmp.padEnd(6)} .Lend_if`)
      if (isaKey === 'MIPS') lines.push('    NOP              ; delay slot')
      lines.push('.Lelse:')
      continue
    }

    // for
    const mFor = lang === 'Python'
      ? line.match(/^for\s+(\w+)\s+in\s+range\((.+?)\)/)
      : line.match(/^for\s*\(([^;]+);([^;]+);([^)]+)\)/)
    if (mFor) {
      lines.push(`; [for] ${line}`)
      if (lang === 'Python') {
        const v    = mFor[1]
        const args = mFor[2].split(',').map(s => s.trim())
        const start = args.length > 1 ? args[0] : '0'
        const end   = args.length > 1 ? args[1] : args[0]
        lines.push(`    ; INIT: ${v} = ${start}`)
        lines.push(isaKey === 'RISC-V' ? `    LI    ${r0}, ${start}` : `    MOV   ${r0}, ${start}`)
        lines.push(`.Lfor_cond:                ; CONDIÇÃO: ${v} < ${end}`)
        if (cfg.cmp) lines.push(`    ${cfg.cmp.padEnd(6)} ${r0}, ${end}`)
        const jge = cfg.jmpF['>='] || 'JGE'
        lines.push(`    ${jge.padEnd(6)} .Lfor_end          ; sai se ${v} >= ${end}`)
        lines.push('    ; ↓ CORPO')
      } else {
        lines.push(`    ; INIT: ${mFor[1].trim()}`)
        lines.push('.Lfor_cond:')
        lines.push(`    ; COND: ${mFor[2].trim()}`)
        lines.push('    ; ↓ CORPO')
      }
      continue
    }

    // while
    const mWh = lang === 'Python'
      ? line.match(/^while\s+(.+?)\s*:$/)
      : line.match(/^while\s*\((.+?)\)/)
    if (mWh) {
      const cond = mWh[1].trim()
      lines.push(`; [while] ${line}`)
      lines.push(`.Lwhile_cond:              ; CONDIÇÃO: ${cond}`)
      const mc = cond.match(/(\w+)\s*(==|!=|>|<|>=|<=)\s*(\w+)/)
      if (mc) {
        const jf = cfg.jmpF[mc[2]] || 'JE'
        if (cfg.cmp) lines.push(`    ${cfg.cmp.padEnd(6)} ${r0}, ${r1}`)
        lines.push(`    ${jf.padEnd(6)} .Lwhile_end        ; sai se NÃO (${cond})`)
      }
      lines.push('    ; ↓ CORPO')
      continue
    }

    // do (C)
    if (lang === 'C' && /^do\s*\{?$/.test(line)) {
      lines.push('; [do-while]')
      lines.push('.Ldo_body:                 ; CORPO (executa ao menos 1x)')
      continue
    }
    const mDoEnd = line.match(/^}\s*while\s*\((.+?)\)/)
    if (mDoEnd) {
      const cond = mDoEnd[1].trim()
      lines.push(`    ; UPDATE — testa: ${cond}`)
      lines.push(`    ${cfg.jmp.padEnd(6)} .Ldo_body          ; repete se verdadeiro`)
      if (isaKey === 'MIPS') lines.push('    NOP')
      lines.push('.Ldo_end:')
      continue
    }

    // indentado = corpo de laço/if
    const indent = rawLine.match(/^(\s+)/)
    if (indent) {
      lines.push(`    ; CORPO: ${line}`)
      if (/\+=\s*1|--$|^\w+\+\+/.test(line)) {
        lines.push(`    ${cfg.inc.replace('Rd', r0).replace('$t', r0).replace('X', r0)}`)
        lines.push(`    ${cfg.jmp.padEnd(6)} .Lfor_cond`)
        if (isaKey === 'MIPS') lines.push('    NOP')
        lines.push('.Lfor_end:')
      } else if (/-=\s*1|^\w+--/.test(line)) {
        lines.push(`    ; DEC ${r0}`)
        lines.push(`    ${cfg.jmp.padEnd(6)} .Lwhile_cond`)
        if (isaKey === 'MIPS') lines.push('    NOP')
        lines.push('.Lwhile_end:')
      }
    } else {
      lines.push(`; ${line}`)
      lines.push('.Lend_if:')
    }
  }

  lines.push('')
  lines.push(`; ── Instruções de desvio (${isaKey}) ──`)
  for (const [op, instr] of Object.entries(cfg.jmpF)) {
    lines.push(`;   ${op.padEnd(3)} → ${instr}`)
  }

  const instrCount = lines.filter(l => {
    const s = l.trim()
    return s && !s.startsWith(';') && !s.startsWith('.')
  }).length

  return { lines, instrCount }
}
