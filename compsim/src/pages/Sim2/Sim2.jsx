// src/pages/Sim2/Sim2.jsx
// Simulador 2 — Controle de Fluxo + Pipeline + Cache
// Layout: painel esquerdo fixo (teoria) + painel direito (entrada + saídas expansíveis)

import { useState, useCallback } from 'react'
import {
  GitBranch, ChevronDown, ChevronRight,
  BookOpen, Play, RotateCcw, AlertCircle,
  Shuffle, Activity, HardDrive, Map,
} from 'lucide-react'

import { ISA, ISA_LIST }                              from '../../data/isa.js'
import { parseCFG, generateFlowAsm }                 from '../../engine/cfg.js'
import { classifyInstr, detectHazards,
         buildPipelineTable, forwardingPaths }        from '../../engine/pipeline.js'
import { simulateCache, calcAMAT,
         analyzeAccessPattern }                       from '../../engine/cache.js'
import { CfgDiagram }                                from '../../components/charts/CfgDiagram.jsx'
import { PipelineDiagram }                           from '../../components/charts/PipelineDiagram.jsx'
import { CacheTimeline }                             from '../../components/charts/CacheTimeline.jsx'
import { SIM2_TEORIA }                               from './teoria.js'
import { EXEMPLOS_FLUXO, EXEMPLOS_PIPELINE,
         EXEMPLOS_CACHE }                            from './exemplos.js'

const TABS = [
  { id: 'fluxo',    label: 'Controle de Fluxo', icon: Shuffle,  color: '#a855f7' },
  { id: 'pipeline', label: 'Pipeline',           icon: Activity, color: '#f97316' },
  { id: 'cache',    label: 'Cache',              icon: HardDrive,color: '#22c55e' },
]
const LANGS = ['Python', 'C']

// ── Painel de teoria ──────────────────────────────────────────────
function TeoriaPanel({ section }) {
  const t = SIM2_TEORIA[section] || SIM2_TEORIA.fluxo
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-60 flex-shrink-0
                      sticky top-16 self-start max-h-[calc(100vh-5rem)] overflow-y-auto pr-1">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen size={13} style={{ color: 'var(--text-muted)' }} />
        <span className="section-title">{t.icon} {t.title}</span>
      </div>
      <div className="rounded-xl p-3.5 border text-xs leading-relaxed"
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

// ── Seção expansível ──────────────────────────────────────────────
function OutputSection({ label, icon: Icon, color, children, defaultOpen = false, onExpand }) {
  const [open, setOpen] = useState(defaultOpen)
  function toggle() { setOpen(o => !o); if (!open && onExpand) onExpand() }
  return (
    <div className="rounded-xl overflow-hidden"
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

// ── Code Block ────────────────────────────────────────────────────
function CodeBlock({ lines, errorLines = [] }) {
  function colorize(line) {
    if (!line.trim()) return line
    if (/^[;#]/.test(line.trim()) || line.trim().startsWith('//'))
      return <span className="asm-comment">{line}</span>
    if (/^\s*\.L\w+:/.test(line)) return <span className="asm-label">{line}</span>
    const m = line.match(/^(\s+)(\w+)(\s+.+)?$/)
    if (m) return <>{m[1]}<span className="asm-instr">{m[2]}</span>{m[3] && <span className="asm-reg">{m[3]}</span>}</>
    return line
  }
  return (
    <div className="code-block text-xs leading-relaxed max-h-72 overflow-y-auto">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-3 px-1 py-0.5 rounded"
             style={{ background: errorLines.includes(i) ? 'rgba(239,68,68,0.1)' : undefined }}>
          <span className="asm-comment w-5 flex-shrink-0 text-right select-none opacity-40">{i + 1}</span>
          <span className="break-all">{colorize(line)}</span>
        </div>
      ))}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// SIMULADOR 2 — PÁGINA PRINCIPAL
// ══════════════════════════════════════════════════════════════════
export default function Sim2() {
  const [activeTab, setActiveTab] = useState('fluxo')
  const [teoriaSection, setTeoriaSection] = useState('fluxo')

  // ── Estado da aba Fluxo ───────────────────────────────────────
  const [fluxoLang,    setFluxoLang]    = useState('Python')
  const [fluxoIsaKey,  setFluxoIsaKey]  = useState('x86-64')
  const [fluxoModo,    setFluxoModo]    = useState('exemplo')
  const [fluxoEx,      setFluxoEx]      = useState('— selecione —')
  const [fluxoCode,    setFluxoCode]    = useState('')
  const [fluxoResult,  setFluxoResult]  = useState(null)
  const [fluxoError,   setFluxoError]   = useState(null)

  // ── Estado da aba Pipeline ────────────────────────────────────
  const [pipModo,      setPipModo]      = useState('exemplo')
  const [pipEx,        setPipEx]        = useState('— selecione —')
  const [pipCode,      setPipCode]      = useState('')
  const [pipFwd,       setPipFwd]       = useState(true)
  const [pipResult,    setPipResult]    = useState(null)
  const [pipError,     setPipError]     = useState(null)

  // ── Estado da aba Cache ───────────────────────────────────────
  const [cacheModo,    setCacheModo]    = useState('exemplo')
  const [cacheEx,      setCacheEx]      = useState('— selecione —')
  const [cacheAddrs,   setCacheAddrs]   = useState('')
  const [cacheSize,    setCacheSize]    = useState(64)
  const [blockSize,    setBlockSize]    = useState(4)
  const [hitTime,      setHitTime]      = useState(1)
  const [missPenalty,  setMissPenalty]  = useState(10)
  const [cacheResult,  setCacheResult]  = useState(null)
  const [cacheError,   setCacheError]   = useState(null)

  // ── Simulação: Controle de Fluxo ──────────────────────────────
  const simFluxo = useCallback(() => {
    if (!fluxoCode.trim()) return
    setFluxoError(null)
    try {
      const blocks = parseCFG(fluxoCode, fluxoLang)
      const { lines: asmLines, instrCount } = generateFlowAsm(fluxoCode, fluxoLang, fluxoIsaKey)

      const hasFor    = /\bfor\b/.test(fluxoCode)
      const hasWhile  = /\bwhile\b/.test(fluxoCode)
      const hasDo     = fluxoLang === 'C' && /\bdo\s*\{/.test(fluxoCode)
      const hasIf     = /\bif\b/.test(fluxoCode)
      const backEdges = blocks.filter(b =>
        (b.trueTo  != null && b.trueTo  <= b.id) ||
        (b.falseTo != null && b.falseTo <= b.id)
      ).length

      setFluxoResult({ blocks, asmLines, instrCount, hasFor, hasWhile, hasDo, hasIf, backEdges })
    } catch (e) {
      setFluxoError(`Erro ao processar: ${e.message}`)
      setFluxoResult(null)
    }
  }, [fluxoCode, fluxoLang, fluxoIsaKey])

  // ── Simulação: Pipeline ───────────────────────────────────────
  const simPipeline = useCallback(() => {
    if (!pipCode.trim()) return
    setPipError(null)
    try {
      const rawLines  = pipCode.split('\n').filter(l => l.trim() && !l.trim().startsWith(';'))
      if (rawLines.length > 20) { setPipError('Máximo 20 instruções por simulação.'); return }

      const infoList  = rawLines.map(classifyInstr)
      const hazards   = detectHazards(infoList)
      const fwdPaths  = forwardingPaths(infoList, hazards)

      const { table: tFwd, totalCycles: cyFwd, cpi: cpiFwd } = buildPipelineTable(infoList, hazards, true)
      const { table: tNo,  totalCycles: cyNo,  cpi: cpiNo  } = buildPipelineTable(infoList, hazards, false)

      const dataHz  = hazards.filter(h => h.dataHazard?.length > 0).length
      const loadUse = hazards.filter(h => h.loadUse).length
      const ctrlHz  = hazards.filter(h => h.controlHazard).length

      setPipResult({ infoList, hazards, fwdPaths, tFwd, tNo, cyFwd, cyNo, cpiFwd, cpiNo, dataHz, loadUse, ctrlHz })
    } catch (e) {
      setPipError(`Erro: ${e.message}`)
      setPipResult(null)
    }
  }, [pipCode, pipFwd])

  // ── Simulação: Cache ──────────────────────────────────────────
  const simCache = useCallback(() => {
    if (!cacheAddrs.trim()) return
    setCacheError(null)
    try {
      const raw = cacheAddrs.replace(/\n/g, ',')
      const addresses = raw.split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => parseInt(s, 0))
        .filter(n => !isNaN(n))

      if (addresses.length === 0) { setCacheError('Nenhum endereço válido encontrado.'); return }
      if (addresses.length > 32)  { setCacheError('Máximo 32 endereços.'); setCacheAddrs(addresses.slice(0,32).join(', ')); return }

      const resultsMap = {}
      const stats      = {}
      for (const [assoc, name] of [[1,'Direto'],[2,'2-way'],[4,'4-way']]) {
        const { results, hits, missRate, config } = simulateCache(addresses, cacheSize, blockSize, assoc)
        const amat = calcAMAT(missRate, hitTime, missPenalty)
        resultsMap[name] = results
        stats[name]      = { hits, missRate, amat, config, assoc }
      }

      const pattern = analyzeAccessPattern(addresses)
      const best    = Object.entries(stats).reduce((a,b) => b[1].amat < a[1].amat ? b : a)[0]

      setCacheResult({ resultsMap, stats, addresses, pattern, best,
                       cacheSize, blockSize, hitTime, missPenalty })
    } catch (e) {
      setCacheError(`Erro: ${e.message}`)
      setCacheResult(null)
    }
  }, [cacheAddrs, cacheSize, blockSize, hitTime, missPenalty])

  // ── Helpers de UI ─────────────────────────────────────────────
  const sectionStyle = (color) => ({
    fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: color, margin: '0 0 0.5rem',
  })

  const inputStyle = {
    background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
    color: 'var(--text-primary)', borderRadius: 8,
    padding: '6px 12px', fontSize: 12, fontFamily: 'monospace',
    outline: 'none',
  }

  function TabBtn({ tab }) {
    const active = activeTab === tab.id
    return (
      <button onClick={() => { setActiveTab(tab.id); setTeoriaSection(tab.id) }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background:  active ? `${tab.color}18` : 'var(--bg-card)',
                border:      `1px solid ${active ? tab.color + '50' : 'var(--bg-border)'}`,
                color:       active ? tab.color : 'var(--text-secondary)',
                fontWeight:  active ? 700 : 400,
              }}>
        <tab.icon size={13} />
        {tab.label}
      </button>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
          <GitBranch size={20} className="text-accent-purple" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Simulador 2</h1>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Controle de Fluxo · CFG · Pipeline 5 Estágios · Cache
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(tab => <TabBtn key={tab.id} tab={tab} />)}
      </div>

      {/* Layout: teoria + conteúdo */}
      <div className="flex gap-6 items-start">
        <TeoriaPanel section={teoriaSection} />

        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* ════════════════════════════════════════════════════
              ABA: CONTROLE DE FLUXO
              ════════════════════════════════════════════════════ */}
          {activeTab === 'fluxo' && (
            <>
              <div className="card flex flex-col gap-4">
                {/* Linguagem + ISA */}
                <div className="flex flex-wrap gap-3 items-center">
                  <p style={sectionStyle('#a855f7')}>Linguagem</p>
                  <div className="flex gap-1.5">
                    {LANGS.map(l => (
                      <button key={l} onClick={() => { setFluxoLang(l); setFluxoEx('— selecione —'); setFluxoCode(''); setFluxoResult(null) }}
                              className="px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
                              style={{ background: fluxoLang===l ? '#a855f7' : 'var(--bg-border)', color: fluxoLang===l ? '#fff' : 'var(--text-secondary)' }}>
                        {l}
                      </button>
                    ))}
                  </div>

                  <p style={sectionStyle('#a855f7')}>ISA</p>
                  <select value={fluxoIsaKey} onChange={e => setFluxoIsaKey(e.target.value)} style={inputStyle}>
                    {ISA_LIST.map(k => <option key={k} value={k}>{ISA[k].name}</option>)}
                  </select>
                </div>

                {/* Modo + Exemplo */}
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.15)' }}>
                    {[['exemplo','📚 Exemplo'],['livre','✏️ Livre']].map(([m,lbl]) => (
                      <button key={m} onClick={() => { setFluxoModo(m); if (m==='livre') setFluxoCode('') }}
                              className="px-3 py-1 rounded text-xs font-medium transition-all"
                              style={{ background: fluxoModo===m ? 'var(--bg-card)' : 'transparent', color: fluxoModo===m ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                  {fluxoModo === 'exemplo' && (
                    <select value={fluxoEx}
                            onChange={e => {
                              setFluxoEx(e.target.value)
                              const v = EXEMPLOS_FLUXO[fluxoLang]?.[e.target.value]
                              if (v) setFluxoCode(v)
                            }} style={{ ...inputStyle, flex: 1, maxWidth: 320 }}>
                      {Object.keys(EXEMPLOS_FLUXO[fluxoLang] || {}).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  )}
                </div>

                <div>
                  <p style={{ ...sectionStyle('#a855f7'), marginBottom: 6 }}>
                    {fluxoModo === 'livre' ? `Código ${fluxoLang} — entrada livre` : 'Código'}
                  </p>
                  <textarea value={fluxoCode} onChange={e => setFluxoCode(e.target.value)}
                            readOnly={fluxoModo==='exemplo'} rows={6}
                            placeholder={fluxoLang==='Python'
                              ? 'nota = 75\nif nota >= 70:\n    aprovado = 1\nelse:\n    aprovado = 0'
                              : 'int n = 8;\nfor (int i = 0; i < n; i++) {\n    soma = soma + i;\n}'}
                            className={`w-full code-block resize-y leading-relaxed focus:outline-none ${fluxoModo==='exemplo' ? 'cursor-default opacity-90' : ''}`}
                            style={{ minHeight: 110 }} />
                </div>

                <div className="flex gap-3">
                  <button onClick={simFluxo} disabled={!fluxoCode.trim()}
                          className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                    <Play size={14} />SIMULAR FLUXO
                  </button>
                  <button onClick={() => { setFluxoCode(''); setFluxoEx('— selecione —'); setFluxoResult(null); setFluxoError(null) }} className="btn-ghost px-4">
                    <RotateCcw size={14} />Limpar
                  </button>
                </div>
              </div>

              {fluxoError && (
                <div className="rounded-xl px-5 py-4 flex gap-3 animate-fade-in"
                     style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.06)' }}>
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{fluxoError}</div>
                </div>
              )}

              {fluxoResult && (
                <div className="flex flex-col gap-3 animate-slide-up">

                  {/* Assembly */}
                  <OutputSection label="① Assembly gerado" icon={Shuffle} color="#a855f7"
                                 defaultOpen={true} onExpand={() => setTeoriaSection('fluxo')}>
                    <div className="flex items-center justify-between mb-3">
                      <p style={sectionStyle('#a855f7')}>Assembly — {ISA[fluxoIsaKey]?.name}</p>
                      <span className="badge text-[10px] font-mono"
                            style={{ background: '#a855f718', color: '#a855f7', borderColor: '#a855f740' }}>
                        {fluxoResult.instrCount} instruções
                      </span>
                    </div>
                    <CodeBlock lines={fluxoResult.asmLines} />
                  </OutputSection>

                  {/* CFG */}
                  <OutputSection label="② Grafo de Fluxo de Controle (CFG)" icon={Map} color="#06b6d4"
                                 onExpand={() => setTeoriaSection('cfg')}>
                    <div className="code-block text-xs mb-4">
                      <div>Blocos básicos : <span className="asm-instr">{fluxoResult.blocks.length}</span></div>
                      <div>Back-edges     : <span className="asm-instr">{fluxoResult.backEdges}</span> (indica {fluxoResult.backEdges} laço{fluxoResult.backEdges !== 1 ? 's' : ''})</div>
                      <div>Estruturas     : {[
                        fluxoResult.hasIf    && 'if/else',
                        fluxoResult.hasFor   && 'for',
                        fluxoResult.hasWhile && 'while',
                        fluxoResult.hasDo    && 'do-while',
                      ].filter(Boolean).join(' · ') || 'nenhuma detectada'}</div>
                    </div>
                    <div className="code-block text-xs mb-4">
                      <div style={{ color: '#22c55e' }}>● Seta verde [S]   = branch verdadeiro (true)</div>
                      <div style={{ color: '#ef4444' }}>● Seta vermelha [N] = branch falso (false)</div>
                      <div style={{ color: '#64748b' }}>● Seta pontilhada   = back-edge (laço)</div>
                      <div style={{ color: '#f97316' }}>◆ Losango           = nó de decisão</div>
                      <div style={{ color: '#22c55e' }}>■ Retângulo         = bloco básico</div>
                    </div>
                    <CfgDiagram blocks={fluxoResult.blocks}
                                title={`CFG — ${fluxoLang} — ${fluxoResult.blocks.length} blocos`} />
                  </OutputSection>

                </div>
              )}

              {!fluxoResult && !fluxoError && (
                <div className="rounded-xl text-center py-14" style={{ border: '1px dashed var(--bg-border)' }}>
                  <Shuffle size={28} className="mx-auto mb-3 opacity-40" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Selecione um exemplo ou escreva código e clique em <span className="text-accent-purple font-mono font-bold">SIMULAR FLUXO</span>
                  </p>
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════════════════════════
              ABA: PIPELINE
              ════════════════════════════════════════════════════ */}
          {activeTab === 'pipeline' && (
            <>
              <div className="card flex flex-col gap-4">

                {/* Modo + Exemplo */}
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.15)' }}>
                    {[['exemplo','📚 Exemplo'],['livre','✏️ Livre']].map(([m,lbl]) => (
                      <button key={m} onClick={() => { setPipModo(m); if (m==='livre') setPipCode('') }}
                              className="px-3 py-1 rounded text-xs font-medium transition-all"
                              style={{ background: pipModo===m ? 'var(--bg-card)' : 'transparent', color: pipModo===m ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                  {pipModo === 'exemplo' && (
                    <select value={pipEx}
                            onChange={e => {
                              setPipEx(e.target.value)
                              const v = EXEMPLOS_PIPELINE[e.target.value]
                              if (v) setPipCode(v)
                            }} style={{ ...inputStyle, flex: 1, maxWidth: 360 }}>
                      {Object.keys(EXEMPLOS_PIPELINE).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  )}
                </div>

                {/* Forwarding toggle */}
                <div className="flex items-center gap-3">
                  <p style={sectionStyle('#f97316')}>Forwarding</p>
                  <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.15)' }}>
                    {[[true,'Com Forwarding'],[false,'Sem Forwarding']].map(([v,lbl]) => (
                      <button key={String(v)} onClick={() => setPipFwd(v)}
                              className="px-3 py-1 rounded text-xs font-medium transition-all"
                              style={{ background: pipFwd===v ? 'var(--bg-card)' : 'transparent', color: pipFwd===v ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ ...sectionStyle('#f97316'), marginBottom: 6 }}>
                    {pipModo === 'livre' ? 'Instruções Assembly (uma por linha, máx. 20)' : 'Instruções'}
                  </p>
                  <textarea value={pipCode} onChange={e => setPipCode(e.target.value)}
                            readOnly={pipModo==='exemplo'} rows={7}
                            placeholder={'ADD R1, R2, R3\nLW  R4, 0(R1)\nSUB R5, R4, R1\nBEQ R5, R0, end\nNOP'}
                            className={`w-full code-block resize-y leading-relaxed focus:outline-none ${pipModo==='exemplo' ? 'cursor-default opacity-90' : ''}`}
                            style={{ minHeight: 120 }} />
                </div>

                <div className="flex gap-3">
                  <button onClick={simPipeline} disabled={!pipCode.trim()}
                          className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ background: '#f97316' }}>
                    <Play size={14} />SIMULAR PIPELINE
                  </button>
                  <button onClick={() => { setPipCode(''); setPipEx('— selecione —'); setPipResult(null); setPipError(null) }} className="btn-ghost px-4">
                    <RotateCcw size={14} />Limpar
                  </button>
                </div>
              </div>

              {pipError && (
                <div className="rounded-xl px-5 py-4 flex gap-3" style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.06)' }}>
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{pipError}</div>
                </div>
              )}

              {pipResult && (
                <div className="flex flex-col gap-3 animate-slide-up">

                  {/* Hazards */}
                  <OutputSection label="① Detecção de Hazards" icon={Activity} color="#f97316"
                                 defaultOpen={true} onExpand={() => setTeoriaSection('pipeline')}>
                    <div className="code-block text-xs mb-4">
                      <div>Instruções    : <span className="asm-instr">{pipResult.infoList.length}</span></div>
                      <div>Data hazards  : <span className={pipResult.dataHz  > 0 ? 'asm-flag-off' : 'asm-flag-on'}>{pipResult.dataHz}</span></div>
                      <div>Load-Use      : <span className={pipResult.loadUse > 0 ? 'asm-flag-off' : 'asm-flag-on'}>{pipResult.loadUse}</span> {pipResult.loadUse > 0 ? '← 1 stall obrigatório cada' : ''}</div>
                      <div>Control haz.  : <span className={pipResult.ctrlHz  > 0 ? 'asm-flag-off' : 'asm-flag-on'}>{pipResult.ctrlHz}</span> {pipResult.ctrlHz > 0 ? '← 2 stalls cada' : ''}</div>
                      <div className="mt-2" style={{ borderTop: '1px solid var(--bg-border)', paddingTop: 6 }}>
                        <span className="asm-instr">Com Forwarding</span> : {pipResult.cyFwd} ciclos · CPI = {pipResult.cpiFwd}
                      </div>
                      <div>
                        <span className="asm-flag-off">Sem Forwarding</span> : {pipResult.cyNo} ciclos · CPI = {pipResult.cpiNo}
                      </div>
                      <div>Ganho do forwarding : <span className="asm-flag-on">{pipResult.cyNo - pipResult.cyFwd} ciclos ({((pipResult.cyNo - pipResult.cyFwd)/pipResult.cyNo*100).toFixed(0)}%)</span></div>
                    </div>

                    {pipResult.hazards.some(h => h.dataHazard?.length > 0 || h.loadUse || h.controlHazard) && (
                      <div>
                        <p style={sectionStyle('#f97316')}>Hazards por instrução</p>
                        <div className="code-block text-xs">
                          {pipResult.infoList.map((info, i) => {
                            const h = pipResult.hazards[i]
                            if (!h.dataHazard?.length && !h.loadUse && !h.controlHazard) return null
                            const tags = [
                              h.loadUse       && '⚠ Load-Use (1 stall)',
                              h.controlHazard && '⚠ Control (2 stalls)',
                              ...(h.dataHazard || []).filter(d => !h.loadUse).map(d => `→ ${d.path || 'Forwarding'} reg:${d.reg}`),
                            ].filter(Boolean)
                            return (
                              <div key={i} className="flex gap-3 py-0.5">
                                <span className="asm-comment w-5 flex-shrink-0 text-right">{i}</span>
                                <span className="asm-instr w-28 flex-shrink-0">{info.raw?.slice(0,20)}</span>
                                <span style={{ color: '#fde047' }}>{tags.join(' | ')}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </OutputSection>

                  {/* Diagrama COM forwarding */}
                  <OutputSection label={`② Diagrama — ${pipFwd ? 'COM' : 'SEM'} Forwarding`} icon={Activity} color="#3b82f6"
                                 onExpand={() => setTeoriaSection('pipeline')}>
                    <PipelineDiagram
                      table={pipFwd ? pipResult.tFwd : pipResult.tNo}
                      infoList={pipResult.infoList}
                      hazards={pipResult.hazards}
                      fwdPaths={pipFwd ? pipResult.fwdPaths : []}
                      totalCycles={pipFwd ? pipResult.cyFwd : pipResult.cyNo}
                      cpi={pipFwd ? pipResult.cpiFwd : pipResult.cpiNo}
                      forwarding={pipFwd}
                    />
                  </OutputSection>

                  {/* Comparativo */}
                  <OutputSection label="③ Comparativo — Forwarding ON vs OFF" icon={Activity} color="#a855f7"
                                 onExpand={() => setTeoriaSection('pipeline')}>
                    <div className="grid grid-cols-2 gap-4">
                      {[[true,'Com Forwarding','#22c55e',pipResult.cyFwd,pipResult.cpiFwd],
                        [false,'Sem Forwarding','#ef4444',pipResult.cyNo,pipResult.cpiNo]].map(([fwd,lbl,col,cy,cpi]) => (
                        <div key={String(fwd)} className="rounded-xl p-4 border"
                             style={{ borderColor: col + '40', background: col + '0a' }}>
                          <div className="text-xs font-mono font-bold mb-2" style={{ color: col }}>{lbl}</div>
                          <div className="text-2xl font-display font-bold" style={{ color: col }}>{cy}</div>
                          <div className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>ciclos totais</div>
                          <div className="text-lg font-display font-bold mt-2" style={{ color: col }}>{cpi}</div>
                          <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>CPI</div>
                        </div>
                      ))}
                    </div>
                    <div className="code-block text-xs mt-4">
                      <div>CPI ideal = <span className="asm-flag-on">1.0</span> (sem nenhum stall)</div>
                      <div>Ganho do forwarding: <span className="asm-flag-on">{pipResult.cyNo - pipResult.cyFwd} ciclos</span> ({((pipResult.cyNo - pipResult.cyFwd)/pipResult.cyNo*100).toFixed(0)}% de redução)</div>
                    </div>
                  </OutputSection>

                </div>
              )}

              {!pipResult && !pipError && (
                <div className="rounded-xl text-center py-14" style={{ border: '1px dashed var(--bg-border)' }}>
                  <Activity size={28} className="mx-auto mb-3 opacity-40" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Selecione um exemplo ou escreva instruções Assembly e clique em <span className="font-mono font-bold" style={{ color: '#f97316' }}>SIMULAR PIPELINE</span>
                  </p>
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════════════════════════
              ABA: CACHE
              ════════════════════════════════════════════════════ */}
          {activeTab === 'cache' && (
            <>
              <div className="card flex flex-col gap-4">

                {/* Modo + Exemplo */}
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.15)' }}>
                    {[['exemplo','📚 Exemplo'],['livre','✏️ Livre']].map(([m,lbl]) => (
                      <button key={m} onClick={() => { setCacheModo(m); if (m==='livre') setCacheAddrs('') }}
                              className="px-3 py-1 rounded text-xs font-medium transition-all"
                              style={{ background: cacheModo===m ? 'var(--bg-card)' : 'transparent', color: cacheModo===m ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                  {cacheModo === 'exemplo' && (
                    <select value={cacheEx}
                            onChange={e => {
                              setCacheEx(e.target.value)
                              const v = EXEMPLOS_CACHE[e.target.value]
                              if (v?.addrs) setCacheAddrs(v.addrs.join(', '))
                            }} style={{ ...inputStyle, flex: 1, maxWidth: 360 }}>
                      {Object.keys(EXEMPLOS_CACHE).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  )}
                </div>

                {/* Descrição do exemplo */}
                {cacheModo === 'exemplo' && cacheEx !== '— selecione —' && EXEMPLOS_CACHE[cacheEx]?.desc && (
                  <div className="rounded-lg px-4 py-2.5 border text-xs font-mono"
                       style={{ borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)', color: '#4ade80' }}>
                    {EXEMPLOS_CACHE[cacheEx].desc}
                  </div>
                )}

                {/* Endereços */}
                <div>
                  <p style={{ ...sectionStyle('#22c55e'), marginBottom: 6 }}>
                    Endereços de memória (decimal ou 0x hex, separados por vírgula — máx. 32)
                  </p>
                  <textarea value={cacheAddrs} onChange={e => setCacheAddrs(e.target.value)}
                            readOnly={cacheModo==='exemplo'} rows={3}
                            placeholder="0, 4, 8, 12, 0, 4, 64, 0, 4, 8"
                            className={`w-full code-block resize-y leading-relaxed focus:outline-none ${cacheModo==='exemplo' ? 'cursor-default opacity-90' : ''}`}
                            style={{ minHeight: 72 }} />
                </div>

                {/* Parâmetros */}
                <div className="flex flex-wrap gap-4">
                  {[
                    ['Cache total',   cacheSize,   setCacheSize,   [32,64,128,256], v => v + ' B'],
                    ['Bloco',         blockSize,   setBlockSize,   [4, 8, 16],      v => v + ' B'],
                    ['Hit time',      hitTime,     setHitTime,     [1, 2],          v => v + ' ciclo(s)'],
                    ['Miss penalty',  missPenalty, setMissPenalty, [5,10,20,50],    v => v + ' ciclos'],
                  ].map(([lbl, val, setter, opts, fmt]) => (
                    <div key={lbl}>
                      <p style={{ ...sectionStyle('#22c55e'), marginBottom: 4 }}>{lbl}</p>
                      <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.15)' }}>
                        {opts.map(o => (
                          <button key={o} onClick={() => setter(o)}
                                  className="px-3 py-0.5 rounded text-xs font-mono transition-all"
                                  style={{ background: val===o ? 'var(--bg-card)' : 'transparent', color: val===o ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: val===o ? 700 : 400 }}>
                            {fmt(o)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={simCache} disabled={!cacheAddrs.trim()}
                          className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ background: '#22c55e' }}>
                    <Play size={14} />SIMULAR CACHE
                  </button>
                  <button onClick={() => { setCacheAddrs(''); setCacheEx('— selecione —'); setCacheResult(null); setCacheError(null) }} className="btn-ghost px-4">
                    <RotateCcw size={14} />Limpar
                  </button>
                </div>
              </div>

              {cacheError && (
                <div className="rounded-xl px-5 py-4 flex gap-3" style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.06)' }}>
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{cacheError}</div>
                </div>
              )}

              {cacheResult && (
                <div className="flex flex-col gap-3 animate-slide-up">

                  {/* Métricas */}
                  <OutputSection label="① Configuração e Métricas" icon={HardDrive} color="#22c55e"
                                 defaultOpen={true} onExpand={() => setTeoriaSection('cache')}>
                    <div className="code-block text-xs mb-4">
                      {(() => {
                        const d = cacheResult.stats['Direto'].config
                        return <>
                          <div>Cache total    : <span className="asm-instr">{cacheResult.cacheSize} bytes</span></div>
                          <div>Bloco          : <span className="asm-instr">{cacheResult.blockSize} bytes ({cacheResult.blockSize/4} words)</span></div>
                          <div>Endereço       : <span className="asm-reg">{d.tagBits}b tag</span> + <span className="asm-instr">{d.indexBits}b índice</span> + <span className="asm-comment">{d.offsetBits}b offset</span></div>
                          <div>Hit time       : <span className="asm-instr">{cacheResult.hitTime} ciclo(s)</span></div>
                          <div>Miss penalty   : <span className="asm-flag-off">{cacheResult.missPenalty} ciclos</span></div>
                          <div>Padrão detectado: <span className="asm-reg">{cacheResult.pattern}</span></div>
                        </>
                      })()}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(cacheResult.stats).map(([name, s]) => (
                        <div key={name} className="rounded-xl p-3 border"
                             style={{
                               borderColor: name === cacheResult.best ? 'rgba(34,197,94,0.5)' : 'var(--bg-border)',
                               background:  name === cacheResult.best ? 'rgba(34,197,94,0.06)' : 'var(--bg-card)',
                             }}>
                          <div className="text-xs font-mono font-bold mb-2 flex items-center gap-1"
                               style={{ color: name === cacheResult.best ? '#4ade80' : 'var(--text-secondary)' }}>
                            {name} {name === cacheResult.best && '✓ melhor'}
                          </div>
                          <div>
                            <span className="text-lg font-bold" style={{ color: s.missRate > 0.5 ? '#f87171' : '#4ade80' }}>
                              {(s.missRate * 100).toFixed(0)}%
                            </span>
                            <span className="text-xs font-mono ml-1" style={{ color: 'var(--text-muted)' }}>miss</span>
                          </div>
                          <div className="text-xs font-mono mt-1" style={{ color: 'var(--text-secondary)' }}>
                            AMAT = {s.amat.toFixed(1)} ciclos
                          </div>
                          <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                            {s.hits}/{cacheResult.addresses.length} hits
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="code-block text-xs mt-4">
                      <div>AMAT = HitTime + MissRate × MissPenalty</div>
                      <div>     = {cacheResult.hitTime} + MissRate × {cacheResult.missPenalty}</div>
                    </div>
                  </OutputSection>

                  {/* Linha do tempo */}
                  <OutputSection label="② Linha do Tempo — Hit / Miss por Acesso" icon={HardDrive} color="#06b6d4"
                                 onExpand={() => setTeoriaSection('cache')}>
                    <CacheTimeline resultsMap={cacheResult.resultsMap} addresses={cacheResult.addresses} />
                  </OutputSection>

                </div>
              )}

              {!cacheResult && !cacheError && (
                <div className="rounded-xl text-center py-14" style={{ border: '1px dashed var(--bg-border)' }}>
                  <HardDrive size={28} className="mx-auto mb-3 opacity-40" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Selecione um padrão de acesso e clique em <span className="font-mono font-bold" style={{ color: '#22c55e' }}>SIMULAR CACHE</span>
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}
