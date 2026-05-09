// src/pages/Sim1/Sim1.jsx
// Fixes: bits bloqueados por ISA, reset de resultado ao mudar ISA/código,
//        erro amigável com linha destacada, tema claro funcional.

import { useState, useCallback, useEffect } from 'react'
import {
  FlaskConical, ChevronDown, ChevronRight,
  BookOpen, Cpu, Binary, Zap, Activity,
  Play, RotateCcw, AlertCircle, List,
} from 'lucide-react'
import { ISA, ISA_LIST, FLAG_DESC } from '../../data/isa.js'
import { generateAssembly }         from '../../engine/assembler.js'
import {
  computeFlags, toBin, fmtBin,
  complement2Steps, extSignZero,
  rippleAdder, parseFirstOp,
}                                   from '../../engine/binary.js'
import { AluDiagram, WaveformDiagram } from '../../components/charts/AluDiagram.jsx'
import { SIM1_TEORIA }              from './teoria.js'
import { EXEMPLOS }                 from './exemplos.js'

const LANGS        = ['Python', 'C', 'Assembly']
const ALL_BITS     = [8, 16, 32, 64]

// ── Teoria Panel ─────────────────────────────────────────────────
function TeoriaPanel({ section }) {
  const t = SIM1_TEORIA[section] || SIM1_TEORIA.assembly
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-60 flex-shrink-0
                      sticky top-16 self-start max-h-[calc(100vh-5rem)] overflow-y-auto pr-1">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen size={13} style={{ color: 'var(--text-muted)' }} />
        <span className="section-title">{t.icon} {t.title}</span>
      </div>
      <div className="rounded-xl p-3.5 border text-xs leading-relaxed transition-colors"
           style={{ background: `${t.color}0d`, borderColor: `${t.color}30` }}>
        {t.resumo.map((r, i) => (
          <p key={i} className="mb-1 last:mb-0" style={{ color: 'var(--text-secondary)' }}>{r}</p>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {t.conceitos.map((c, i) => (
          <div key={i} className="rounded-lg p-3 border transition-colors"
               style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}>
            <div className="text-xs font-mono font-bold mb-1" style={{ color: t.color }}>{c.label}</div>
            <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.texto}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 border border-accent-yellow/25 bg-accent-yellow/5">
        <div className="text-accent-yellow text-xs font-mono font-bold mb-1.5">💡 DICA</div>
        <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.dica}</div>
      </div>
      <div className="text-xs font-mono text-right" style={{ color: 'var(--text-muted)' }}>📚 {t.ref}</div>
    </aside>
  )
}

// ── Output Section (expansível) ───────────────────────────────────
function OutputSection({ label, icon: Icon, color, children, defaultOpen = false, onExpand }) {
  const [open, setOpen] = useState(defaultOpen)
  function toggle() { setOpen(o => !o); if (!open && onExpand) onExpand() }
  return (
    <div className="rounded-xl overflow-hidden transition-shadow duration-200"
         style={{ border: '1px solid var(--bg-border)' }}>
      <button onClick={toggle}
              className="w-full flex items-center justify-between px-5 py-3.5 transition-colors"
              style={{ borderLeft: `3px solid ${color}` }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <div className="flex items-center gap-2.5">
          <Icon size={15} style={{ color }} />
          <span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</span>
        </div>
        {open
          ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
      </button>
      {open && (
        <div className="px-5 py-4 animate-fade-in"
             style={{ borderTop: '1px solid var(--bg-border)', background: 'var(--bg)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Code block com highlight e linhas problemáticas ───────────────
function CodeBlock({ lines, errorLines = [] }) {
  function colorize(line) {
    if (!line.trim()) return line
    if (/^[;#]/.test(line.trim()) || line.trim().startsWith('//'))
      return <span className="asm-comment">{line}</span>
    if (/^\s*\.L\w+:/.test(line))
      return <span className="asm-label">{line}</span>
    const m = line.match(/^(\s+)(\w+)(\s+.+)?$/)
    if (m) return <>{m[1]}<span className="asm-instr">{m[2]}</span>{m[3] && <span className="asm-reg">{m[3]}</span>}</>
    return line
  }
  return (
    <div className="code-block text-xs leading-relaxed max-h-72 overflow-y-auto">
      {lines.map((line, i) => (
        <div key={i}
             className="flex gap-3 px-1 py-0.5 rounded"
             style={{
               background: errorLines.includes(i) ? 'rgba(239,68,68,0.12)' : undefined,
               borderLeft: errorLines.includes(i) ? '2px solid #ef4444' : '2px solid transparent',
             }}>
          <span className="asm-comment w-5 flex-shrink-0 text-right select-none opacity-40">{i + 1}</span>
          <span className="break-all">{colorize(line)}</span>
          {errorLines.includes(i) && (
            <span className="ml-auto text-red-400 text-[9px] flex-shrink-0">⚠ não reconhecido</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Tabela de registradores ───────────────────────────────────────
function RegTable({ isaKey, regMap }) {
  const cfg  = ISA[isaKey]
  const regs = cfg.regs.slice(0, 16)
  const used = new Set(Object.values(regMap))
  return (
    <div className="mt-5">
      <div className="section-title mb-2">Registradores — {cfg.name}</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
        {regs.map(r => {
          const clean   = r.split('(')[0]
          const isUsed  = used.has(r) || used.has(clean)
          const varName = Object.entries(regMap).find(([, v]) => v === r || v === clean)?.[0]
          return (
            <div key={r}
                 className="rounded-lg px-3 py-2 font-mono text-xs transition-all"
                 style={{
                   border: `1px solid ${isUsed ? 'rgba(59,130,246,0.5)' : 'var(--bg-border)'}`,
                   background: isUsed ? 'rgba(59,130,246,0.08)' : 'var(--bg-card)',
                   opacity: isUsed ? 1 : 0.6,
                 }}>
              <div className={`font-bold text-[11px] ${isUsed ? 'text-accent-blue' : ''}`}
                   style={!isUsed ? { color: 'var(--text-muted)' } : {}}>{clean}</div>
              {isUsed
                ? <div className="text-accent-cyan text-[9px] mt-0.5">← {varName}</div>
                : <div className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>livre</div>}
            </div>
          )
        })}
      </div>
      {Object.keys(regMap).length > 0 && (
        <>
          <div className="section-title mb-2">Mapa variável → registrador</div>
          <div className="code-block text-xs mb-4">
            {Object.entries(regMap).map(([v, r]) => (
              <div key={v} className="flex gap-4">
                <span className="asm-reg w-20">{v}</span>
                <span style={{ color: 'var(--text-muted)' }}>→</span>
                <span className="asm-instr">{r}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="rounded-lg px-4 py-3 text-xs font-mono"
           style={{ border: '1px solid var(--bg-border)', background: 'var(--bg-card)' }}>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5" style={{ color: 'var(--text-secondary)' }}>
          {[['Tipo', cfg.type], ['Bits', cfg.bits + '-bit'], ['Endian', cfg.endian],
            ['Flags', cfg.flags.join(', ')], ['Reg.Flag', cfg.flagReg],
            ['SEXT', cfg.sext], ['ZEXT', cfg.zext]].map(([k, v]) => (
            <span key={k}><span style={{ color: 'var(--text-muted)' }}>{k}: </span>{v}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Saída Binária + Flags ─────────────────────────────────────────
function BinarioOutput({ a, b, op, bits, isaKey }) {
  const cfg  = ISA[isaKey]
  const MASKS = { 8: 0xFF, 16: 0xFFFF, 32: 0xFFFFFFFF, 64: 0xFFFFFFFF }
  const mask = MASKS[bits] ?? 0xFFFFFFFF
  const { result, flags } = computeFlags(a, b, op, bits)
  const aBin = toBin(a, bits), bBin = toBin(b, bits), rBin = toBin(result, bits)
  const c2   = complement2Steps(Math.abs(a), bits)
  const ext  = extSignZero(a & 0xFF, bits)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="section-title mb-2">Representação binária ({bits} bits)</div>
        <div className="code-block text-xs">
          {[['A', a, aBin], ['B', b, bBin], ['S', result, rBin]].map(([lbl, val, bin]) => (
            <div key={lbl} className={`flex gap-3 py-0.5 px-1 rounded ${lbl === 'S' ? 'border-t mt-1 pt-2' : ''}`}
                 style={lbl === 'S' ? { borderColor: 'var(--bg-border)' } : {}}>
              <span className="asm-instr w-4">{lbl}</span>
              <span style={{ color: 'var(--text-muted)' }}>=</span>
              <span className="asm-reg w-16 text-right">{val}</span>
              <span style={{ color: 'var(--text-muted)' }}>→</span>
              <span className="asm-comment">{fmtBin(bin, 8)}</span>
              <span className="ml-auto text-[10px]" style={{ color: 'var(--text-muted)' }}>
                0x{(val < 0 ? val + mask + 1 : val & mask).toString(16).toUpperCase().padStart(bits >> 2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-title mb-2">Flags após {a} {op} {b}</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(flags).map(([fn, fv]) => (
            <span key={fn} title={FLAG_DESC[fn] || fn}
                  className="badge cursor-help font-mono text-xs"
                  style={fv
                    ? { background: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.4)', color: '#4ade80' }
                    : { background: 'rgba(239,68,68,0.12)',  borderColor: 'rgba(239,68,68,0.3)',  color: '#f87171' }}>
              {fn} = {fv}
            </span>
          ))}
        </div>
        {(isaKey === 'RISC-V' || isaKey === 'MIPS') && (
          <div className="rounded-lg px-4 py-2.5 text-xs font-mono mb-2"
               style={{ border: '1px solid rgba(234,179,8,0.3)', background: 'rgba(234,179,8,0.05)', color: '#eab308' }}>
            ⚠ {isaKey === 'RISC-V'
              ? 'RISC-V não tem registrador de flags — branches comparam registradores diretamente (BEQ/BNE/BLT/BGE).'
              : 'MIPS usa $zero + BEQ/BNE — sem EFLAGS.'}
          </div>
        )}
        {flags.OF === 1 && <div className="rounded-lg px-4 py-2.5 text-xs font-mono mb-1" style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>⚠ OF=1 — Overflow com sinal! {a} {op} {b} não cabe em {bits} bits com sinal.{bits === 32 && ' Em C, undefined behavior!'}</div>}
        {flags.CF === 1 && op === '+' && <div className="rounded-lg px-4 py-2.5 text-xs font-mono mb-1" style={{ border: '1px solid rgba(249,115,22,0.4)', background: 'rgba(249,115,22,0.08)', color: '#fb923c' }}>⚠ CF=1 — Carry! Soma excedeu {bits} bits sem sinal (wrap-around).</div>}
        {flags.CF === 1 && op === '-' && <div className="rounded-lg px-4 py-2.5 text-xs font-mono mb-1" style={{ border: '1px solid rgba(249,115,22,0.4)', background: 'rgba(249,115,22,0.08)', color: '#fb923c' }}>⚠ CF=1 — Borrow! {a} {'<'} {b} → resultado negativo sem sinal.</div>}
        {flags.ZF === 1 && <div className="rounded-lg px-4 py-2.5 text-xs font-mono mb-1" style={{ border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.08)', color: '#4ade80' }}>✓ ZF=1 — Resultado zero. JE/BEQ saltaria para branch de igualdade.</div>}
      </div>

      <div>
        <div className="section-title mb-2">Complemento de 2 — como representar -{Math.abs(a)}</div>
        <div className="code-block text-xs">
          {c2.steps.map((s, i) => (
            <div key={i} className="flex gap-4 py-0.5">
              <span className="asm-comment w-52 flex-shrink-0">{s.label}</span>
              <span className="asm-reg">{fmtBin(s.bin, 8)}</span>
            </div>
          ))}
          <div className="mt-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>{c2.check}</div>
        </div>
      </div>

      <div>
        <div className="section-title mb-2">Extensão de sinal (8 → {bits} bits)</div>
        <div className="code-block text-xs">
          <div className="asm-comment mb-1.5">A8 = {(a & 0xFF).toString(2).padStart(8,'0')}  ({a & 0xFF})  bit7={ext.msb8}</div>
          {[['SEXT', cfg.sext, ext.sextBin, ext.sextMsg], ['ZEXT', cfg.zext, ext.zextBin, 'preenche MSBs com 0']].map(([lbl, instr, bin, msg]) => (
            <div key={lbl} className="flex gap-3 py-0.5 flex-wrap">
              <span className="asm-instr w-10">{lbl}</span>
              <span className="text-[10px] w-36" style={{ color: 'var(--text-muted)' }}>({instr})</span>
              <span className="asm-reg">{fmtBin(bin, 8)}</span>
              <span className="asm-comment text-[10px]">{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────
export default function Sim1() {
  const [lang,      setLang]      = useState('Python')
  const [isaKey,    setIsaKey]    = useState('x86-64')
  const [bits,      setBits]      = useState(32)
  const [modo,      setModo]      = useState('exemplo')
  const [exemplo,   setExemplo]   = useState('— selecione —')
  const [code,      setCode]      = useState('')
  const [result,    setResult]    = useState(null)
  const [error,     setError]     = useState(null)
  const [running,   setRunning]   = useState(false)
  const [teoriaSection, setTeoriaSection] = useState('assembly')

  const cfg        = ISA[isaKey]
  const exLang     = EXEMPLOS[lang] || {}

  // FIX 1 — Reset resultado quando ISA ou código mudar
  // Hot reload: re-simula automaticamente ao trocar ISA ou bits (se já tiver código)
  useEffect(() => {
    if (code.trim()) {
      // Pequeno delay para não re-simular durante digitação rápida
      const timer = setTimeout(() => {
        simulateNow(code, lang, isaKey, bits)
      }, 150)
      return () => clearTimeout(timer)
    } else {
      setResult(null); setError(null)
    }
  }, [isaKey, bits])

  // FIX 2 — Bloquear bits incompatíveis com a ISA
  useEffect(() => {
    const native = cfg.nativeBits || [32]
    if (!native.includes(bits)) setBits(native[native.length - 1])
  }, [isaKey])

  function onLangChange(l) {
    setLang(l); setExemplo('— selecione —'); setCode(''); setResult(null); setError(null)
  }

  function onExemploChange(e) {
    const n = e.target.value; setExemplo(n)
    if (exLang[n]) setCode(exLang[n])
  }

  function onIsaChange(k) {
    setIsaKey(k); setResult(null); setError(null)
  }

  // FIX 3 — Tratamento de erro robusto com linhas problemáticas
  function simulateNow(codeArg, langArg, isaArg, bitsArg) {
    if (!codeArg.trim()) return
    setRunning(true); setError(null)
    try {
      const { lines: asmLines, regMap, instrCount, errorLines = [] } = generateAssembly(codeArg, langArg, isaArg)
      const { a, op, b } = parseFirstOp(codeArg)
      const safeOp = op || '+'
      const safeB  = b ?? 0
      const { result: rv, flags } = computeFlags(a, safeB, safeOp, bitsArg)
      const aBin = toBin(a, bitsArg), bBin = toBin(safeB, bitsArg), rBin = toBin(rv, bitsArg)
      const nShow = Math.min(bitsArg, 8)
      const sub   = safeOp === '-'
      const { result: gateRes, carryOut } = rippleAdder(aBin.slice(-nShow), bBin.slice(-nShow), sub)
      if (errorLines.length > 0) {
        setError({
          message: `${errorLines.length} linha(s) não reconhecidas — mantidas como comentário.`,
          lines: errorLines,
        })
      }
      setResult({ asmLines, regMap, instrCount, errorLines, a, b: safeB, op: safeOp, rv, flags, aBin, bBin, rBin, nShow, sub, gateRes, carryOut, label: `${a} ${safeOp} ${safeB}` })
    } catch (err) {
      setError({ message: `Erro: ${err.message}`, lines: [] })
      setResult(null)
    } finally {
      setRunning(false)
    }
  }

  const simulate = useCallback(() => simulateNow(code, lang, isaKey, bits), [code, lang, isaKey, bits])

  function reset() {
    setCode(''); setExemplo('— selecione —'); setResult(null); setError(null)
  }

  const availableBits = cfg.nativeBits || [32]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <FlaskConical size={20} className="text-accent-blue" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Simulador 1</h1>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Alto Nível → Assembly → Binário + Flags → Portas Lógicas → Sinais Elétricos
          </p>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        <TeoriaPanel section={teoriaSection} />

        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Controles */}
          <div className="card flex flex-col gap-4">

            {/* Linguagem */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="section-title">Linguagem</span>
              <div className="flex gap-1.5">
                {LANGS.map(l => (
                  <button key={l} onClick={() => onLangChange(l)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${lang === l ? 'bg-accent-blue text-white shadow-md' : ''}`}
                          style={lang !== l ? { color: 'var(--text-secondary)' } : {}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* ISA + Bits */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="section-title">ISA</span>
                <select value={isaKey} onChange={e => onIsaChange(e.target.value)}
                        className="rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}>
                  {ISA_LIST.map(k => <option key={k} value={k}>{ISA[k].name}</option>)}
                </select>
                <span className="badge text-[10px] font-mono"
                      style={{ background: `${cfg.color}18`, color: cfg.color, borderColor: `${cfg.color}40` }}>
                  {cfg.type} · {cfg.bits}-bit
                </span>
              </div>

              {/* FIX 2 — Bits filtrados pela ISA */}
              <div className="flex items-center gap-2">
                <span className="section-title">Bits ALU</span>
                <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.15)' }}>
                  {ALL_BITS.map(b => {
                    const available = availableBits.includes(b)
                    return (
                      <button key={b}
                              onClick={() => available && setBits(b)}
                              title={!available ? `Não suportado em ${cfg.name}` : undefined}
                              className={`px-3 py-0.5 rounded text-xs font-mono transition-all
                                ${!available ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'}
                                ${bits === b && available ? 'font-bold shadow-sm' : ''}`}
                              style={{
                                background: bits === b && available ? 'var(--bg-card)' : 'transparent',
                                color: bits === b && available ? 'var(--text-primary)' : 'var(--text-muted)',
                              }}>
                        {b}b
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Modo + Exemplo */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.15)' }}>
                {[['exemplo', '📚 Exemplo'], ['livre', '✏️ Livre']].map(([m, lbl]) => (
                  <button key={m} onClick={() => { setModo(m); if (m === 'livre') setCode('') }}
                          className="px-3 py-1 rounded text-xs font-medium transition-all"
                          style={{
                            background: modo === m ? 'var(--bg-card)' : 'transparent',
                            color: modo === m ? 'var(--text-primary)' : 'var(--text-muted)',
                          }}>
                    {lbl}
                  </button>
                ))}
              </div>
              {modo === 'exemplo' && (
                <select value={exemplo} onChange={onExemploChange}
                        className="rounded-lg px-3 py-1.5 text-xs font-mono flex-1 max-w-sm focus:outline-none"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}>
                  {Object.keys(exLang).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              )}
              {modo === 'livre' && (
                <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  Dica: use atribuições simples (a = 25), operações (+, -, *), if/else, for, while.
                </p>
              )}
            </div>

            {/* Código */}
            <div>
              <div className="section-title mb-1.5">
                {modo === 'livre' ? `Código ${lang} — entrada livre` : 'Código selecionado'}
              </div>
              <textarea value={code} onChange={e => setCode(e.target.value)}
                        readOnly={modo === 'exemplo'} rows={6}
                        placeholder={modo === 'livre'
                          ? lang === 'Python' ? 'a = 25\nb = 7\nc = a + b\nprint(c)'
                          : lang === 'C'      ? 'int a = 25;\nint b = 7;\nint c = a + b;\nreturn c;'
                          :                     'a = 25\nb = 7\nc = a + b'
                          : 'Selecione um exemplo acima…'}
                        className={`w-full code-block resize-y leading-relaxed focus:outline-none
                                    ${modo === 'exemplo' ? 'cursor-default opacity-90' : ''}`}
                        style={{ minHeight: 110 }} />
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button onClick={simulate} disabled={!code.trim() || running}
                      className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                <Play size={14} />{running ? 'Simulando…' : 'SIMULAR'}
              </button>
              <button onClick={reset} className="btn-ghost px-4">
                <RotateCcw size={14} />Limpar
              </button>
            </div>
          </div>

          {/* FIX 3 — Mensagem de erro com linha destacada */}
          {error && (
            <div className="rounded-xl px-5 py-4 flex gap-3 animate-fade-in"
                 style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.06)' }}>
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-red-400 mb-1">Atenção</div>
                <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{error.message}</div>
              </div>
            </div>
          )}

          {/* Saídas */}
          {result && (
            <div className="flex flex-col gap-3 animate-slide-up">

              <OutputSection label="① Assembly" icon={Cpu} color="#3b82f6"
                             defaultOpen={true} onExpand={() => setTeoriaSection('assembly')}>
                <div className="flex items-center justify-between mb-3">
                  <div className="section-title">Assembly — {cfg.name}</div>
                  <span className="badge text-[10px] font-mono"
                        style={{ background: '#3b82f618', color: '#3b82f6', borderColor: '#3b82f640' }}>
                    {result.instrCount} instruções
                  </span>
                </div>
                <CodeBlock lines={result.asmLines} errorLines={result.errorLines || []} />
                <RegTable isaKey={isaKey} regMap={result.regMap} />
              </OutputSection>

              <OutputSection label="② Binário + Flags" icon={Binary} color="#22c55e"
                             onExpand={() => setTeoriaSection('binario')}>
                <BinarioOutput a={result.a} b={result.b} op={result.op} bits={bits} isaKey={isaKey} />
              </OutputSection>

              <OutputSection label="③ Portas Lógicas (ULA — Full Adder Ripple-Carry)" icon={Zap} color="#eab308"
                             onExpand={() => setTeoriaSection('portas')}>
                <div className="section-title mb-2">
                  {result.nShow} bits{result.sub ? ' — Subtração (NOT B + Cin=1)' : ' — Adição (Cin=0)'}
                </div>
                <div className="code-block text-xs mb-4">
                  <div>Total: {result.nShow} FA × 5 = <span className="asm-instr">{result.nShow * 5} portas</span>  (para {bits}b: <span className="asm-instr">{bits * 5} portas</span>)</div>
                  <div>Resultado: <span className="asm-reg">{result.gateRes}</span> = {parseInt(result.gateRes, 2)} decimal</div>
                  <div>Carry-Out: <span className={result.carryOut ? 'asm-flag-on' : 'asm-flag-off'}>{result.carryOut} {result.carryOut ? '← CF=1' : '← CF=0'}</span></div>
                </div>
                <AluDiagram aBin={result.aBin} bBin={result.bBin} sub={result.sub} maxBits={result.nShow} />
              </OutputSection>

              <OutputSection label="④ Sinais Elétricos (CMOS 3.3V)" icon={Activity} color="#f97316"
                             onExpand={() => setTeoriaSection('sinais')}>
                <div className="code-block text-xs mb-4">
                  <div>LOW  (0) = 0V–0.8V — NMOS desligado &nbsp; HIGH (1) = 2V–3.3V — PMOS ligado</div>
                  <div className="mt-1.5">A ({result.a}): <span className="asm-reg">{fmtBin(result.aBin.slice(-result.nShow), 8)}</span></div>
                  <div>B ({result.b}): <span className="asm-reg">{fmtBin(result.bBin.slice(-result.nShow), 8)}</span></div>
                  <div>S ({result.rv}): <span className="asm-reg">{fmtBin(result.rBin.slice(-result.nShow), 8)}</span></div>
                </div>
                <WaveformDiagram aBin={result.aBin.slice(-result.nShow)} bBin={result.bBin.slice(-result.nShow)} rBin={result.rBin.slice(-result.nShow)} label={result.label} />
              </OutputSection>

              <div className="card" style={{ borderColor: 'var(--bg-border)' }}>
                <div className="section-title mb-3">Resumo — todas as camadas</div>
                <div className="code-block text-xs">
                  {[
                    ['① Alto Nível',    `${result.a} ${result.op} ${result.b}  (${lang})`],
                    ['② Assembly',      `${cfg.add} / ${cfg.sub}  —  ${cfg.name}`],
                    ['③ Binário',       `${fmtBin(result.rBin.slice(-16), 8)}  CF=${result.flags.CF} OF=${result.flags.OF} ZF=${result.flags.ZF} SF=${result.flags.SF}`],
                    ['④ Portas',        `${result.nShow} FA × 5 = ${result.nShow * 5} portas  Cout=${result.carryOut}`],
                    ['⑤ Sinal elétrico',`MSB: ${result.flags.SF ? 'LOW 0V' : 'HIGH 3.3V'}  (SF=${result.flags.SF})`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-4 py-0.5">
                      <span className="asm-comment w-36 flex-shrink-0">{k}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!result && !error && (
            <div className="rounded-xl text-center py-14" style={{ border: '1px dashed var(--bg-border)' }}>
              <FlaskConical size={28} className="mx-auto mb-3 opacity-40" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Selecione um exemplo ou escreva um código e clique em{' '}
                <span className="text-accent-blue font-mono font-bold">SIMULAR</span>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
