// ── engine/binary.js ────────────────────────────────────────────
// Lógica pura de representação binária.
// Não conhece React nem UI — só recebe dados e retorna resultados.

/**
 * Converte inteiro para string binária em complemento de 2.
 * @param {number} val  Valor inteiro (pode ser negativo)
 * @param {number} bits Largura em bits (8, 16, 32, 64)
 */
export function toBin(val, bits) {
  if (val < 0) val = val & ((1 << bits) - 1)
  // Para 64-bit usamos BigInt para evitar overflow de JS
  if (bits === 64) {
    let n = BigInt(val) & BigInt('0xFFFFFFFFFFFFFFFF')
    return n.toString(2).padStart(64, '0')
  }
  return (val >>> 0).toString(2).padStart(bits, '0').slice(-bits)
}

/**
 * Formata string binária em grupos de 'g' bits separados por espaço.
 */
export function fmtBin(s, g = 8) {
  return s.match(new RegExp(`.{1,${g}}`, 'g'))?.join(' ') ?? s
}

/**
 * Calcula resultado e todos os flags após operação aritmética.
 *
 * Flags:
 *   CF — Carry Flag    : vai-um do MSB (unsigned overflow / borrow)
 *   OF — Overflow Flag : transbordamento com sinal
 *   ZF — Zero Flag     : resultado = 0
 *   SF — Sign Flag     : MSB = 1 (negativo em complemento de 2)
 *   PF — Parity Flag   : número par de bits 1 no byte baixo
 *
 * @param {number} a    Operando A
 * @param {number} b    Operando B
 * @param {string} op   Operador: '+' | '-'
 * @param {number} bits Largura: 8 | 16 | 32 | 64
 * @returns {{ result: number, flags: object }}
 */
export function computeFlags(a, b, op, bits = 32) {
  // Nota: em JS, 1 << 32 = 1 (wraps) — por isso usamos lookup para 32/64 bits
  const MASKS = { 8: 0xFF, 16: 0xFFFF, 32: 0xFFFFFFFF, 64: 0xFFFFFFFF }
  const mask  = MASKS[bits] ?? 0xFFFFFFFF
  const sb    = bits <= 16 ? (1 << (bits - 1)) : (bits === 32 ? 0x80000000 : 0x80000000)
  let r, CF, OF

  if (op === '+') {
    const rf = a + b
    r  = rf & mask
    CF = rf > mask ? 1 : 0
    const sa  = (a & sb) ? 1 : 0
    const sbb = (b & sb) ? 1 : 0
    const sr  = (r & sb) ? 1 : 0
    OF = (sa === sbb && sr !== sa) ? 1 : 0

  } else if (op === '-') {
    const au = a & mask
    const bu = b & mask
    r  = (au - bu) & mask
    CF = au < bu ? 1 : 0        // borrow
    const sa  = (a  & sb) ? 1 : 0
    const sbb = (b  & sb) ? 1 : 0
    const sr  = (r  & sb) ? 1 : 0
    OF = (sa !== sbb && sr !== sa) ? 1 : 0

  } else if (op === '*') {
    // Multiplicação: calcula resultado real, flags baseados no resultado
    const rf = a * b
    r  = rf & mask
    CF = rf > mask ? 1 : 0
    const sr = (r & sb) ? 1 : 0
    OF = (rf > mask || (sr === 1 && rf >= 0)) ? 1 : 0

  } else if (op === '/') {
    r  = b !== 0 ? Math.floor(a / b) & mask : 0
    CF = 0; OF = 0

  } else {
    r = 0; CF = 0; OF = 0
  }

  const ZF = (r & mask) === 0 ? 1 : 0
  const SF = (r & sb) ? 1 : 0
  const PF = (r & 0xFF).toString(2).split('').filter(c => c === '1').length % 2 === 0 ? 1 : 0

  return {
    result: r & mask,
    flags:  { CF, OF, ZF, SF, PF }
  }
}

/**
 * Gera passo a passo do complemento de 2.
 * @returns {{ original, notBits, plusOne, result, steps[] }}
 */
export function complement2Steps(val, bits) {
  const mask    = (1 << bits) - 1
  const posBin  = toBin(Math.abs(val), bits)
  const notBin  = posBin.split('').map(b => b === '0' ? '1' : '0').join('')
  const notVal  = parseInt(notBin, 2)
  const result  = (notVal + 1) & mask
  const resBin  = toBin(result, bits)

  return {
    value:   val,
    bits,
    steps: [
      { label: `Valor positivo (${Math.abs(val)})`, bin: posBin },
      { label: 'Passo 1: inverter todos os bits (NOT)', bin: notBin },
      { label: 'Passo 2: somar 1', bin: resBin },
    ],
    result: resBin,
    check:  `Verificação: ${Math.abs(val)} + (-${Math.abs(val)}) = 0  →  ZF=1  ✓`,
  }
}

/**
 * Demonstração de SEXT e ZEXT de 8 bits para N bits.
 */
export function extSignZero(val8, bits) {
  const a8   = val8 & 0xFF
  const msb  = (a8 >> 7) & 1
  const mask = (1 << bits) - 1

  const sextVal  = msb ? (a8 | (mask ^ 0xFF)) : a8
  const zextVal  = a8

  return {
    a8,
    msb8: msb,
    sextBin: toBin(sextVal, bits),
    zextBin: toBin(zextVal, bits),
    sextDec: msb ? sextVal - (1 << bits) : sextVal,
    zextDec: zextVal,
    sextMsg: msb
      ? `bit7=1 → replica 1s nos ${bits - 8} bits superiores`
      : `bit7=0 → replica 0s nos ${bits - 8} bits superiores`,
  }
}

/**
 * Full Adder de 1 bit.
 * 5 portas: 2×XOR + 2×AND + 1×OR
 */
export function fullAdder(a, b, cin) {
  const xor1 = a ^ b
  const sum  = xor1 ^ cin
  const and1 = a & b
  const and2 = xor1 & cin
  const cout = and1 | and2
  return { sum, cout, gates: { xor1, sum, and1, and2, carry: cout } }
}

/**
 * Somador Ripple-Carry de N bits.
 * Se sub=true faz subtração via complemento de 2 (NOT B + Cin=1).
 *
 * @returns {{ result, carries, gates[], carryOut }}
 */
export function rippleAdder(A, B, sub = false) {
  const n  = Math.max(A.length, B.length)
  let Ap   = A.padStart(n, '0')
  let Bp   = B.padStart(n, '0')

  if (sub) {
    Bp  = Bp.split('').map(b => b === '0' ? '1' : '0').join('')
  }

  const cin0   = sub ? 1 : 0
  const rbits  = []
  const carries = [cin0]
  const gatesList = []

  for (let i = n - 1; i >= 0; i--) {
    const { sum, cout, gates } = fullAdder(
      parseInt(Ap[i]), parseInt(Bp[i]), carries[carries.length - 1]
    )
    rbits.unshift(String(sum))
    carries.push(cout)
    gatesList.unshift(gates)
  }

  return {
    result:   rbits.join(''),
    carries:  carries.slice(0, -1).reverse(),
    gates:    gatesList,
    carryOut: carries[carries.length - 1],
  }
}

/**
 * Extrai a primeira operação numérica de um bloco de código (Python ou C).
 * Rastreia variáveis definidas e resolve operações entre elas.
 * Ignora blocos indentados (corpo de if/for/while).
 *
 * @returns {{ a: number, op: string, b: number }}
 */
export function parseFirstOp(code) {
  const lines = code.split('\n')
  const vars  = {}   // { nome: valor }

  for (const rawLine of lines) {
    // Ignora linhas indentadas (corpo de if/for/while)
    if (rawLine.startsWith('    ') || rawLine.startsWith('\t')) continue

    let line = rawLine.trim().replace(/;$/, '')
    // Remove tipo C: int, long, short, unsigned X, signed X
    line = line.replace(/^(int|long|short|unsigned\s+\w+|signed\s+\w+)\s+/, '')

    if (!line || /^[;#/]/.test(line)) continue
    if (/^(if|elif|else|for|while|do|print|printf|return|def|class)\b/.test(line)) continue

    // var = num OP num
    let m = line.match(/^(\w+)\s*=\s*(-?\d+)\s*([+\-*/])\s*(-?\d+)$/)
    if (m) {
      const a = parseInt(m[2]), op = m[3], b = parseInt(m[4])
      vars[m[1]] = op==='+' ? a+b : op==='-' ? a-b : op==='*' ? a*b : Math.floor(a/b)
      return { a, op, b }
    }

    // var = var OP var  (resolve usando vars já definidos)
    m = line.match(/^(\w+)\s*=\s*(\w+)\s*([+\-*/])\s*(\w+)$/)
    if (m) {
      const aVal = isNaN(m[2]) ? (vars[m[2]] ?? 10) : parseInt(m[2])
      const bVal = isNaN(m[4]) ? (vars[m[4]] ?? 5)  : parseInt(m[4])
      const op   = m[3]
      const res  = op==='+' ? aVal+bVal : op==='-' ? aVal-bVal : op==='*' ? aVal*bVal : Math.floor(aVal/bVal)
      vars[m[1]] = res
      return { a: aVal, op, b: bVal }
    }

    // var = num  (armazena para uso posterior)
    m = line.match(/^(\w+)\s*=\s*(-?\d+)$/)
    if (m) { vars[m[1]] = parseInt(m[2]); continue }
  }

  // Fallback: usa os dois primeiros valores encontrados
  const vals = Object.values(vars).filter(v => typeof v === 'number')
  if (vals.length >= 2) return { a: vals[0], op: '+', b: vals[1] }
  if (vals.length === 1) return { a: vals[0], op: '+', b: 0 }
  return { a: 10, op: '+', b: 5 }
}
