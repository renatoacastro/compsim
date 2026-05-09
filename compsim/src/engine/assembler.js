// ── engine/assembler.js ─────────────────────────────────────────
// Converte código Python ou C simplificado para Assembly.
// Não conhece React — retorna strings e objetos puros.

import { ISA } from '../data/isa.js'

const SKIP_WORDS = new Set([
  'if','else','elif','for','while','do','print','return',
  'int','long','short','char','unsigned','signed','void',
  'main','printf','scanf','true','false','True','False',
  'def','class','import','from','in','range','and','or','not',
])

function makeAlloc(cfg) {
  const regMap = {}
  let idx = 0
  const regs = cfg.regs.filter(r => !r.includes('SP') && !r.includes('PC') && !r.includes('LR'))

  function alloc(v) {
    if (!v || SKIP_WORDS.has(v) || !v.match(/^[a-zA-Z_]\w*$/)) return regs[0]
    if (!regMap[v]) {
      regMap[v] = regs[idx % Math.max(1, regs.length - 2)]
      idx++
    }
    return regMap[v]
  }

  return { regMap, alloc }
}

function isNum(s) { return /^-?\d+$/.test(String(s).trim()) }

/**
 * Gera Assembly para uma ISA específica a partir de código Python ou C.
 * @param {string} code     Código de entrada
 * @param {string} lang     'Python' | 'C' | 'Assembly'
 * @param {string} isaKey   Chave da ISA (ex: 'x86-64')
 * @returns {{ lines: string[], regMap: object, instrCount: number }}
 */
export function generateAssembly(code, lang, isaKey) {
  const cfg = ISA[isaKey]
  if (!cfg) return { lines: ['; ISA não encontrada'], regMap: {}, instrCount: 0 }
  if (lang === 'Assembly') {
    const lines = [
      `; Assembly de referência — ISA: ${cfg.name}`,
      `; Flags HW  : ${cfg.flags.join(', ')}`,
      `; Reg. flags: ${cfg.flagReg}`,
      '',
      ...code.split('\n'),
    ]
    return { lines, regMap: {}, instrCount: code.split('\n').filter(l => l.trim() && !l.trim().startsWith(';')).length }
  }

  const { regMap, alloc } = makeAlloc(cfg)
  const out = [
    `; ┌─── Assembly — ISA: ${cfg.name}`,
    `; │ ${cfg.bits}-bit · ${cfg.endian} · ${cfg.type}`,
    `; │ Flags HW  : ${cfg.flags.join(', ')}`,
    `; │ Reg. flags: ${cfg.flagReg}`,
    `; └─────────────────────────────────────`,
    '',
  ]

  const srcLines = code.split('\n')

  for (const raw of srcLines) {
    const line = raw.trim()
    if (!line) { out.push(''); continue }

    // Comentário
    if (line.startsWith('#') || line.startsWith('//')) {
      out.push(`; ${line.replace(/^[#/]+\s*/, '')}`)
      continue
    }

    // ── Atribuição var = expr ──────────────────────────────────
    const mAssign = lang === 'Python'
      ? line.match(/^(\w+)\s*=\s*(.+)$/)
      : line.replace(/;$/, '').match(/^(?:int|long|short|char|unsigned\s+\w+|signed\s+\w+|\w+)\s+(\w+)\s*=\s*(.+)$/)

    if (mAssign) {
      const dest = mAssign[1]
      const expr = mAssign[2].trim()
      const dr   = alloc(dest)

      out.push(`; [${lang === 'Python' ? 'py' : 'C'}] ${line.replace(/;$/, '')}`)

      // SEXT/ZEXT warning para C
      if (lang === 'C') {
        if (/\bshort\b/.test(raw) && !/unsigned/.test(raw))
          out.push(`; *** SEXT necessário → ${cfg.sext}`)
        else if (/unsigned\s+char|unsigned\s+short/.test(raw))
          out.push(`; *** ZEXT necessário → ${cfg.zext}`)
      }

      const madd = expr.match(/^(\w+)\s*\+\s*(\w+)$/)
      const msub = expr.match(/^(\w+)\s*-\s*(\w+)$/)
      const mmul = expr.match(/^(\w+)\s*\*\s*(\w+)$/)
      const mdiv = expr.match(/^(\w+)\s*\/\/?\s*(\w+)$/)

      if (isNum(expr)) {
        if (isaKey === 'RISC-V') out.push(`    ADDI  ${dr}, x0, ${expr}    ; ${dest} = ${expr}`)
        else                     out.push(`    ${cfg.mov.padEnd(5)} ${dr}, ${expr}      ; ${dest} = ${expr}`)

      } else if (madd) {
        const [a, b] = [alloc(madd[1]), alloc(madd[2])]
        out.push(`    ${cfg.add.padEnd(5)} ${dr}, ${a}, ${b}  ; ${dest} = ${madd[1]} + ${madd[2]}`)
        out.push(`    ; ↳ Flags: ${cfg.flags.slice(0, 4).join(' | ')}`)

      } else if (msub) {
        const [a, b] = [alloc(msub[1]), alloc(msub[2])]
        out.push(`    ${cfg.sub.padEnd(5)} ${dr}, ${a}, ${b}  ; ${dest} = ${msub[1]} - ${msub[2]}`)
        out.push(`    ; ↳ Flags: ${cfg.flags.slice(0, 4).join(' | ')}`)

      } else if (mmul) {
        const [a, b] = [alloc(mmul[1]), alloc(mmul[2])]
        if (isaKey === 'RISC-V') out.push(`    MUL   ${dr}, ${a}, ${b}   ; ext M`)
        else if (isaKey === 'MIPS') {
          out.push(`    MULT  ${a}, ${b}          ; HI:LO = produto`)
          out.push(`    MFLO  ${dr}               ; ${dest} = LO`)
        } else out.push(`    IMUL  ${dr}, ${a}, ${b}`)

      } else if (mdiv) {
        const [a, b] = [alloc(mdiv[1]), alloc(mdiv[2])]
        if (isaKey === 'RISC-V')  out.push(`    DIV   ${dr}, ${a}, ${b}`)
        else if (isaKey === 'MIPS') {
          out.push(`    DIV   ${a}, ${b}          ; HI=resto LO=quociente`)
          out.push(`    MFLO  ${dr}`)
        } else {
          out.push(`    ; MOV   RAX, ${a}`)
          out.push(`    ; CQO              ; sign-extend RDX:RAX`)
          out.push(`    ; IDIV  ${b}       ; ${dest} = RAX`)
        }
      } else {
        const sr = alloc(expr)
        out.push(`    ${cfg.mov.padEnd(5)} ${dr}, ${sr}`)
      }
      continue
    }

    // ── print / printf ─────────────────────────────────────────
    const mPrint = line.match(/print\((.+)\)/) || line.match(/printf\s*\((.+)\)/)
    if (mPrint) {
      const arg = mPrint[1].trim().replace(/^["']|["']$/g, '')
      const reg = alloc(arg)
      out.push(`; print(${arg})`)
      if (isaKey === 'x86-64') {
        out.push(`    MOV   RDI, ${reg}     ; 1º argumento = ${arg}`)
        out.push(`    CALL  printf`)
      } else if (isaKey === 'RISC-V') {
        out.push(`    MV    a0, ${reg}      ; arg = ${arg}`)
        out.push(`    LI    a7, 1          ; syscall write`)
        out.push(`    ECALL`)
      } else if (isaKey === 'MIPS') {
        out.push(`    MOVE  $a0, ${reg}    ; arg = ${arg}`)
        out.push(`    LI    $v0, 1        ; syscall print_int`)
        out.push(`    SYSCALL`)
      } else {
        out.push(`    MOV   R0, ${reg}     ; arg = ${arg}`)
        out.push(`    BL    printf`)
      }
      continue
    }

    // ── if / elif ──────────────────────────────────────────────
    const mIf = line.match(/^(?:if|elif)\s+(.+?)\s*:?\s*$/) ||
                line.match(/^(?:else\s+)?if\s*\((.+?)\)\s*\{?\s*$/)
    if (mIf) {
      const cond = mIf[1]
      out.push(`; if ${cond}`)
      const mc = cond.match(/(\w+)\s*(==|!=|>|<|>=|<=)\s*(\w+)/)
      if (mc) {
        const [, a, op, b] = mc
        const ar = alloc(a), br = alloc(b)
        const jFalse = cfg.jmpFalse[op] || 'JNE'
        const fhint  = { '==':'ZF=1', '!=':'ZF=0', '>':'ZF=0 e CF=0', '<':'CF=1', '>=':'CF=0', '<=':'CF=1 ou ZF=1' }

        if (isaKey === 'RISC-V') {
          out.push(`    ${jFalse.padEnd(6)} ${ar}, ${br}, .Lelse    ; se NÃO (${a}${op}${b}), pula`)
        } else if (isaKey === 'MIPS') {
          out.push(`    SUB   $t0, ${ar}, ${br}`)
          out.push(`    ${jFalse.padEnd(6)} $t0, $zero, .Lelse`)
          out.push(`    NOP                        ; delay slot`)
        } else {
          out.push(`    ${cfg.cmp || 'CMP'}   ${ar}, ${br}`)
          out.push(`    ${jFalse.padEnd(6)} .Lelse               ; se NÃO (${a}${op}${b}), pula`)
        }
        out.push(`    ; ↳ flag testado: ${fhint[op] || 'ZF'}`)
        out.push(`    ; ↓ bloco then`)
      }
      continue
    }

    // ── else ───────────────────────────────────────────────────
    if (/^else\s*:?\s*$/.test(line) || /^else\s*\{/.test(line)) {
      out.push(`    ${cfg.jmpUncond.padEnd(6)} .Lend_if          ; salta o else`)
      if (isaKey === 'MIPS') out.push(`    NOP`)
      out.push(`.Lelse:`)
      out.push(`    ; ↓ bloco else`)
      continue
    }

    // ── return ─────────────────────────────────────────────────
    const mRet = line.replace(/;$/, '').match(/^return\s+(\w+)/)
    if (mRet) {
      const reg = alloc(mRet[1])
      out.push(`; return ${mRet[1]}`)
      if (isaKey === 'x86-64') { out.push(`    MOV   RAX, ${reg}   ; retorno em RAX`); out.push(`    RET`) }
      else if (isaKey === 'RISC-V') { out.push(`    MV    a0, ${reg}    ; retorno em a0`); out.push(`    RET`) }
      else if (isaKey === 'MIPS') { out.push(`    MOVE  $v0, ${reg}  ; retorno em $v0`); out.push(`    JR    $ra`) }
      else { out.push(`    MOV   R0, ${reg}   ; retorno em R0`); out.push(`    BX    LR`) }
      continue
    }

    out.push(`; ${line.replace(/;$/, '')}`)
  }

  out.push('')
  out.push('; ── Mapa: variável → registrador ──')
  for (const [v, r] of Object.entries(regMap)) {
    out.push(`;   ${v.padEnd(14)} → ${r}`)
  }

  const instrCount = out.filter(l => {
    const s = l.trim()
    return s && !s.startsWith(';') && !s.startsWith('.')
  }).length

  return { lines: out, regMap, instrCount }
}
