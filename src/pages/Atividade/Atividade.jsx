// src/pages/Atividade/Atividade.jsx
// Melhorias: LocalStorage, CSS impressão, gabarito Base64, modo professor

import { useState, useCallback, useEffect } from 'react'
import {
  ClipboardList, Lock, Unlock, Printer,
  AlertCircle, CheckCircle, Eye, EyeOff,
} from 'lucide-react'
import { QUESTOES_LAB1 } from './questoes.js'

const LABS = [
  { id: 'lab1', label: 'Atividade 1', subtitle: 'Sim1 — Abstração + Arrays', color: '#3b82f6', questoes: QUESTOES_LAB1 },
  { id: 'lab2', label: 'Atividade 2', subtitle: 'Sim2 — Fluxo, Pipeline, Cache', color: '#22c55e', questoes: [] },
]

// ── Senha do professor (modo gabarito) ────────────────────────────
const SENHA_PROFESSOR = 'PROF2025'   // ← altere para uma senha secreta sua

// ── Senha da aula ─────────────────────────────────────────────────
// Altere antes de cada aula e faça git push
const SENHA_LAB1 = 'IFC2025'
const SENHA_LAB2 = 'IFC2025'

// ── Decodifica gabarito (Base64) ──────────────────────────────────
function decodeGab(str) {
  try { return atob(str) } catch { return str }
}

// ── Validação ─────────────────────────────────────────────────────
function validarAcesso(grupo, senha, senhaAula, senhaProfessor) {
  if (!senhaAula.trim()) return { ok: false, prof: false, msg: 'Senha não configurada.' }
  const gNum = parseInt(grupo)
  if (isNaN(gNum) || gNum < 1 || gNum > 20)
    return { ok: false, prof: false, msg: 'Número do grupo inválido (1–20).' }
  // Modo professor
  if (senha.trim().toLowerCase() === senhaProfessor.trim().toLowerCase())
    return { ok: true, prof: true }
  // Modo aluno
  if (senha.trim().toLowerCase() !== senhaAula.trim().toLowerCase())
    return { ok: false, prof: false, msg: 'Senha incorreta. Solicite ao professor.' }
  return { ok: true, prof: false }
}

// ── CSS de impressão ──────────────────────────────────────────────
const PRINT_CSS = `
@media print {
  nav, .no-print, button, footer { display: none !important; }
  body { background: white !important; color: black !important; font-size: 12pt; }
  * { color: black !important; background: white !important; border-color: #ccc !important; }
  .print-header { border-bottom: 2pt solid black; padding-bottom: 10pt; margin-bottom: 14pt; }
  .print-header h2 { font-size: 15pt; font-weight: bold; margin: 0 0 4pt; }
  .print-header p  { font-size: 10pt; margin: 0; }
  .print-question  { border: 1pt solid #999; border-radius: 4pt; padding: 10pt; margin-bottom: 10pt;
                     break-inside: avoid; page-break-inside: avoid; }
  .print-q-num     { font-size: 11pt; font-weight: bold; margin-bottom: 4pt; }
  .print-q-text    { font-size: 10pt; margin-bottom: 6pt; }
  .print-resp-label{ font-size: 9pt; color: #555 !important; margin-bottom: 3pt; }
  .print-resp-box  { min-height: 70pt; border-bottom: 1pt solid #ccc; margin-bottom: 4pt;
                     font-size: 10pt; white-space: pre-wrap; }
  .print-footer    { margin-top: 14pt; border-top: 1pt solid #ccc; font-size: 8pt;
                     text-align: center; padding-top: 6pt; }
  @page { margin: 2cm; }
}
`

// ── Botão Imprimir ────────────────────────────────────────────────
function BotaoImprimir() {
  function handlePrint() {
    let el = document.getElementById('compsim-print-style')
    if (!el) {
      el = document.createElement('style')
      el.id = 'compsim-print-style'
      document.head.appendChild(el)
    }
    el.textContent = PRINT_CSS
    window.print()
  }

  return (
    <div className="no-print rounded-xl p-4 border mb-4"
         style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.3)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Printer size={15} className="text-accent-blue" />
        <span className="text-sm font-display font-bold" style={{ color: 'var(--text-primary)' }}>
          Como gerar o PDF para entrega
        </span>
      </div>
      <div className="text-xs font-mono leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        1. Preencha os nomes dos integrantes e as respostas abaixo<br />
        2. Clique em IMPRIMIR / SALVAR PDF<br />
        3. Na janela: escolha <strong>"Salvar como PDF"</strong> como destino<br />
        4. Salve e entregue no Google Forms da disciplina<br />
        <span style={{ color: '#eab308' }}>⚠ Dica: ative "Mais configurações → Imprimir planos de fundo"</span>
      </div>
      <button onClick={handlePrint} className="btn-primary w-full justify-center">
        <Printer size={14} /> IMPRIMIR / SALVAR PDF
      </button>
    </div>
  )
}

// ── Formulário de acesso ──────────────────────────────────────────
function FormularioAcesso({ labColor, onUnlock, senhaAula }) {
  const [grupo, setGrupo] = useState('')
  const [senha, setSenha] = useState('')
  const [erro,  setErro]  = useState('')
  const [show,  setShow]  = useState(false)

  function tentar() {
    const qSorteada = ((parseInt(grupo) - 1) % 20) + 1
    const res = validarAcesso(grupo, senha, senhaAula, SENHA_PROFESSOR)
    if (res.ok) onUnlock(parseInt(grupo), qSorteada, res.prof)
    else setErro(res.msg)
  }

  const inputStyle = {
    background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
    color: 'var(--text-primary)', borderRadius: 8,
    padding: '10px 14px', fontSize: 14,
    fontFamily: 'JetBrains Mono, monospace',
    outline: 'none', width: '100%',
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl"
               style={{ background: labColor + '18', border: `1px solid ${labColor}40` }}>
            <Lock size={20} style={{ color: labColor }} />
          </div>
          <div>
            <div className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Acesso à Atividade
            </div>
            <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              Preencha os dados fornecidos pelo professor
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono font-bold mb-1.5 block"
                   style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Número do grupo (1–20)
            </label>
            <input type="number" min={1} max={20}
                   value={grupo} onChange={e => { setGrupo(e.target.value); setErro('') }}
                   placeholder="Ex: 3" style={inputStyle} />
          </div>

          <div>
            <label className="text-xs font-mono font-bold mb-1.5 block"
                   style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Senha da aula
            </label>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'}
                     value={senha} onChange={e => { setSenha(e.target.value); setErro('') }}
                     placeholder="Fornecida pelo professor na aula"
                     onKeyDown={e => e.key === 'Enter' && tentar()}
                     style={{ ...inputStyle, paddingRight: 40 }} />
              <button onClick={() => setShow(s => !s)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                               background: 'none', border: 'none', cursor: 'pointer',
                               color: 'var(--text-muted)' }}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {erro && (
          <div className="flex items-start gap-2 rounded-lg px-4 py-3"
               style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-xs font-mono text-red-400">{erro}</span>
          </div>
        )}

        <button onClick={tentar} disabled={!grupo || !senha}
                className="btn-primary justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: labColor }}>
          <Unlock size={14} /> ACESSAR ATIVIDADE
        </button>

        <div className="text-xs text-center font-mono" style={{ color: 'var(--text-muted)' }}>
          A questão é sorteada automaticamente pelo número do grupo.<br />
          Dúvidas? Consulte o professor.
        </div>
      </div>
    </div>
  )
}

// ── Questão aberta ────────────────────────────────────────────────
function QuestaoAberta({ q, grupo, modoProf }) {
  const STORAGE_KEY = `compsim_ativ1_g${grupo}_q${q.id}`

  // Integrantes
  const [integrantes, setIntegrantes] = useState(() =>
    localStorage.getItem(STORAGE_KEY + '_integrantes') || ''
  )

  // Respostas — carrega do localStorage
  const [respostas, setRespostas] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_respostas')
      return saved ? JSON.parse(saved) : Array(q.perguntas.length).fill('')
    } catch { return Array(q.perguntas.length).fill('') }
  })

  // Salva automaticamente no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_integrantes', integrantes)
  }, [integrantes])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_respostas', JSON.stringify(respostas))
  }, [respostas])

  function setResp(i, val) {
    setRespostas(prev => { const n = [...prev]; n[i] = val; return n })
  }

  const areaStyle = {
    background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
    color: 'var(--text-primary)', borderRadius: 8,
    padding: '10px 14px', fontSize: 13,
    fontFamily: 'JetBrains Mono, monospace',
    outline: 'none', width: '100%',
    resize: 'vertical', minHeight: 90,
  }

  return (
    <div>
      {/* Cabeçalho para impressão */}
      <div className="print-header" style={{ display: 'none' }}>
        <h2>Atividade 1 — CompSim — Arquitetura de Computadores</h2>
        <p>Grupo: {grupo} &nbsp;|&nbsp; Questão: {q.id} &nbsp;|&nbsp; ISA: {q.isa} &nbsp;|&nbsp; {q.bits} bits</p>
        <p>Integrantes: {integrantes || '_______________________________________________'}</p>
      </div>

      {/* Modo professor — badge */}
      {modoProf && (
        <div className="no-print flex items-center gap-2 mb-4 px-4 py-2 rounded-lg"
             style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)' }}>
          <Eye size={14} className="text-accent-yellow" />
          <span className="text-xs font-mono font-bold text-accent-yellow">
            MODO PROFESSOR — gabarito visível abaixo de cada pergunta
          </span>
        </div>
      )}

      {/* Cabeçalho da questão */}
      <div className="rounded-xl p-5 mb-5 border"
           style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.25)' }}>
        <div className="flex items-start gap-4">
          <div className="text-2xl font-display font-bold flex-shrink-0" style={{ color: '#3b82f6' }}>
            Q{q.id}
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
              {q.titulo}
            </div>
            <div className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {q.contexto}
            </div>
            <div className="flex flex-wrap gap-2">
              {[['ISA', q.isa, '#3b82f6'], [`${q.bits}-bit`, null, '#06b6d4'], ['Lab 1', null, '#a855f7']].map(([lbl, val, col]) => (
                <span key={lbl} className="badge text-[10px] font-mono"
                      style={{ background: col + '18', color: col, borderColor: col + '40' }}>
                  {val ? `${lbl}: ${val}` : lbl}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Código de referência */}
      <div className="mb-5">
        <div className="text-xs font-mono font-bold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Código de referência — execute no Simulador 1
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[['Python', q.codigo_py, '#a855f7'], ['C', q.codigo_c, '#3b82f6']].map(([lang, code, col]) => (
            <div key={lang}>
              <div className="text-xs font-mono mb-1" style={{ color: col }}>// {lang}</div>
              <div className="code-block text-xs leading-relaxed" style={{ borderColor: col + '40' }}>
                {code}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrantes */}
      <div className="mb-5 no-print">
        <label className="text-xs font-mono font-bold mb-1.5 block uppercase tracking-widest"
               style={{ color: 'var(--text-muted)' }}>
          Integrantes do grupo
        </label>
        <textarea value={integrantes} onChange={e => setIntegrantes(e.target.value)}
                  placeholder="Nome completo dos integrantes (um por linha)"
                  rows={2} style={areaStyle} />
        <div className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
          💾 Respostas salvas automaticamente no navegador
        </div>
      </div>

      {/* Perguntas */}
      <div className="flex flex-col gap-5">
        {q.perguntas.map((pergunta, i) => (
          <div key={i} className="rounded-xl border overflow-hidden print-question"
               style={{ borderColor: 'var(--bg-border)' }}>
            <div className="px-5 py-3 flex items-start gap-3"
                 style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--bg-border)' }}>
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                   style={{ background: '#3b82f6', color: '#fff', minWidth: 24 }}>
                {i + 1}
              </div>
              <div className="text-sm leading-relaxed print-q-text" style={{ color: 'var(--text-primary)' }}>
                {pergunta}
              </div>
            </div>
            <div className="px-5 py-3" style={{ background: 'var(--bg)' }}>
              <div className="text-xs font-mono mb-1.5 print-resp-label" style={{ color: 'var(--text-muted)' }}>
                Resposta do grupo:
              </div>
              <textarea value={respostas[i]} onChange={e => setResp(i, e.target.value)}
                        placeholder="Digite sua resposta aqui..."
                        rows={4} style={areaStyle}
                        className="print-resp-box" />
            </div>

            {/* Gabarito — só visível no modo professor */}
            {modoProf && q.gabarito?.[i] && (
              <div className="px-5 py-3 no-print"
                   style={{ background: 'rgba(234,179,8,0.06)', borderTop: '1px solid rgba(234,179,8,0.2)' }}>
                <div className="text-xs font-mono font-bold mb-1" style={{ color: '#eab308' }}>
                  📋 GABARITO (modo professor)
                </div>
                <div className="text-xs font-mono leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {decodeGab(q.gabarito[i])}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rodapé */}
      <div className="mt-8 pt-4 text-xs font-mono text-center print-footer"
           style={{ borderTop: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}>
        CompSim · Atividade 1 · Grupo {grupo} · Questão {q.id} · {q.isa} · {q.bits} bits
        &nbsp;|&nbsp; renatoacastro.github.io/compsim
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────
export default function Atividade() {
  const [activeLab,  setActiveLab]  = useState('lab1')
  const [unlocked,   setUnlocked]   = useState(false)
  const [grupo,      setGrupo]      = useState(null)
  const [questaoId,  setQuestaoId]  = useState(null)
  const [modoProf,   setModoProf]   = useState(false)

  const lab         = LABS.find(l => l.id === activeLab)
  const senhaAtual  = activeLab === 'lab1' ? SENHA_LAB1 : SENHA_LAB2
  const questao     = lab.questoes.find(q => q.id === questaoId)

  function handleUnlock(g, qId, isProf) {
    setGrupo(g); setQuestaoId(qId); setModoProf(isProf); setUnlocked(true)
  }

  function handleLock() {
    setUnlocked(false); setGrupo(null); setQuestaoId(null); setModoProf(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8 no-print">
        <div className="p-2 rounded-xl"
             style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)' }}>
          <ClipboardList size={20} className="text-accent-yellow" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
            Atividade Avaliativa
          </h1>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            20 questões por laboratório · Acesso por grupo + senha da aula
          </p>
        </div>
      </div>

      {/* Abas */}
      {!unlocked && (
        <div className="flex gap-2 mb-8 no-print">
          {LABS.map(l => (
            <button key={l.id}
                    onClick={() => { setActiveLab(l.id); setUnlocked(false) }}
                    className="flex flex-col px-5 py-3 rounded-xl border transition-all"
                    style={{
                      background:  activeLab === l.id ? l.color + '15' : 'var(--bg-card)',
                      borderColor: activeLab === l.id ? l.color + '50' : 'var(--bg-border)',
                    }}>
              <span className="font-display font-bold text-sm"
                    style={{ color: activeLab === l.id ? l.color : 'var(--text-secondary)' }}>
                {l.label}
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                {l.subtitle}
              </span>
              {l.questoes.length === 0 && (
                <span className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Em breve
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lab 2 placeholder */}
      {activeLab === 'lab2' && !unlocked && (
        <div className="card text-center py-16">
          <ClipboardList size={32} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
          <div className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
            Atividade 2
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Disponível após o laboratório de Controle de Fluxo, Pipeline e Cache.
          </div>
        </div>
      )}

      {/* Formulário */}
      {activeLab === 'lab1' && !unlocked && (
        <FormularioAcesso labColor={lab.color} onUnlock={handleUnlock} senhaAula={senhaAtual} />
      )}

      {/* Questão desbloqueada */}
      {unlocked && questao && (
        <div>
          <div className="flex items-center justify-between mb-6 no-print">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg"
                 style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <CheckCircle size={15} className="text-green-400" />
              <span className="text-sm font-mono font-bold text-green-400">
                Grupo {grupo} — Questão {questaoId} {modoProf ? '(Professor)' : ''}
              </span>
            </div>
            <button onClick={handleLock} className="btn-ghost text-xs px-3 py-1.5">
              <Lock size={12} /> Fechar
            </button>
          </div>

          <BotaoImprimir />

          <QuestaoAberta q={questao} grupo={grupo} modoProf={modoProf} />
        </div>
      )}

      {unlocked && !questao && (
        <div className="card text-center py-16">
          <AlertCircle size={32} className="mx-auto mb-4 text-red-400" />
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Questão {questaoId} não encontrada. Consulte o professor.
          </div>
        </div>
      )}

    </div>
  )
}
