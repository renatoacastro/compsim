// src/pages/Atividade/Atividade.jsx
// Atividade Avaliativa — Lab 1 e Lab 2
// Acesso: número do grupo + senha da aula (questão determinada automaticamente)
// Entrega: PDF via window.print()

import { useState, useRef } from 'react'
import {
  ClipboardList, Lock, Unlock, Printer,
  ChevronRight, AlertCircle, CheckCircle,
  BookOpen, Code2,
} from 'lucide-react'
import { QUESTOES_LAB1 } from './questoes.js'

// ── Configuração das abas ─────────────────────────────────────────
const LABS = [
  { id: 'lab1', label: 'Atividade 1', subtitle: 'Sim1 — Abstração + Arrays', color: '#3b82f6', questoes: QUESTOES_LAB1 },
  { id: 'lab2', label: 'Atividade 2', subtitle: 'Sim2 — Fluxo, Pipeline, Cache', color: '#22c55e', questoes: [] },
]

// ── Validação da senha ────────────────────────────────────────────
// Formato: grupo (1–20) + senha da aula
// A questão é determinada automaticamente pelo número do grupo
function validarAcesso(grupo, senha, senhaAula) {
  if (!senhaAula.trim()) return { ok: false, msg: 'Senha da aula não configurada.' }
  const gNum = parseInt(grupo)
  if (isNaN(gNum) || gNum < 1 || gNum > 20) return { ok: false, msg: 'Número do grupo inválido (1–20).' }
  if (senha.trim().toLowerCase() !== senhaAula.trim().toLowerCase())
    return { ok: false, msg: 'Senha incorreta. Solicite ao professor.' }
  return { ok: true }
}

// ── Componente de impressão ───────────────────────────────────────
function BotaoImprimir({ grupo, isa, integrantes }) {
  function handlePrint() {
    const style = document.createElement('style')
    style.id = 'print-style'
    style.textContent = `
      @media print {
        nav, .no-print, button { display: none !important; }
        .print-area { display: block !important; }
        body { background: white !important; color: black !important; }
        .print-area * { color: black !important; background: white !important; }
        .print-header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
        .print-q { border: 1px solid #999; border-radius: 6px; padding: 12px; margin-bottom: 12px; }
        .print-resp { min-height: 80px; border-bottom: 1px solid #ccc; margin-bottom: 8px; }
        @page { margin: 1.5cm; }
      }
    `
    document.head.appendChild(style)
    window.print()
    setTimeout(() => document.getElementById('print-style')?.remove(), 1000)
  }

  return (
    <div className="no-print">
      <div className="rounded-xl p-4 border mb-4"
           style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.3)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Printer size={16} className="text-accent-blue" />
          <span className="text-sm font-display font-bold" style={{ color: 'var(--text-primary)' }}>
            Como gerar o PDF para entrega
          </span>
        </div>
        <div className="text-xs font-mono leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          1. Preencha seus dados e as respostas abaixo<br />
          2. Clique em IMPRIMIR / SALVAR PDF<br />
          3. Na janela que abrir: escolha "Salvar como PDF" como destino<br />
          4. Salve o arquivo e entregue no Google Forms da disciplina<br />
          <br />
          <span style={{ color: '#eab308' }}>⚠ Dica: em Configurações de impressão, ative "Mais configurações" → "Imprimir planos de fundo"</span>
        </div>
        <button onClick={handlePrint}
                className="btn-primary w-full justify-center">
          <Printer size={14} />
          IMPRIMIR / SALVAR PDF
        </button>
      </div>
    </div>
  )
}

// ── Formulário de acesso ──────────────────────────────────────────
function FormularioAcesso({ labColor, onUnlock, senhaAula }) {
  const [grupo,  setGrupo]  = useState('')
  const [senha,  setSenha]  = useState('')
  const [erro,   setErro]   = useState('')

  function tentar() {
    const qSorteada = ((parseInt(grupo) - 1) % 20) + 1
    const res = validarAcesso(grupo, senha, senhaAula)
    if (res.ok) {
      onUnlock(parseInt(grupo), qSorteada, senha)
    } else {
      setErro(res.msg)
    }
  }

  const inputStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--bg-border)',
    color: 'var(--text-primary)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    fontFamily: 'JetBrains Mono, monospace',
    outline: 'none',
    width: '100%',
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: labColor + '18', border: `1px solid ${labColor}40` }}>
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
                   placeholder="Ex: 3"
                   style={inputStyle} />
          </div>

          <div>
            <label className="text-xs font-mono font-bold mb-1.5 block"
                   style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Senha da aula
            </label>
            <input type="password"
                   value={senha} onChange={e => { setSenha(e.target.value); setErro('') }}
                   placeholder="Fornecida pelo professor na aula"
                   onKeyDown={e => e.key === 'Enter' && tentar()}
                   style={inputStyle} />
          </div>
        </div>

        {erro && (
          <div className="flex items-start gap-2 rounded-lg px-4 py-3"
               style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-xs font-mono text-red-400">{erro}</span>
          </div>
        )}

        <button onClick={tentar}
                disabled={!grupo || !senha}
                className="btn-primary justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: labColor }}>
          <Unlock size={14} />
          ACESSAR ATIVIDADE
        </button>

        <div className="text-xs text-center font-mono" style={{ color: 'var(--text-muted)' }}>
          A questão é sorteada pelo sistema conforme o número do grupo.<br />
          Dúvidas? Consulte o professor.
        </div>
      </div>
    </div>
  )
}

// ── Questão aberta ────────────────────────────────────────────────
function QuestaoAberta({ q, grupo, integrantes, onIntegrantesChange }) {
  const [respostas, setRespostas] = useState(Array(q.perguntas.length).fill(''))

  function setResp(i, val) {
    setRespostas(prev => { const n = [...prev]; n[i] = val; return n })
  }

  const areaStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--bg-border)',
    color: 'var(--text-primary)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    fontFamily: 'JetBrains Mono, monospace',
    outline: 'none',
    width: '100%',
    resize: 'vertical',
    minHeight: 90,
  }

  return (
    <div>
      {/* Cabeçalho para impressão */}
      <div className="print-area" style={{ display: 'none' }}>
        <div className="print-header">
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            Atividade 1 — CompSim — Arquitetura de Computadores
          </div>
          <div>Grupo: {grupo} &nbsp;|&nbsp; Questão: {q.id} &nbsp;|&nbsp; ISA: {q.isa} &nbsp;|&nbsp; {q.bits} bits</div>
          <div>Integrantes: {integrantes}</div>
        </div>
      </div>

      {/* Cabeçalho da questão */}
      <div className="rounded-xl p-5 mb-5 border"
           style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.25)' }}>
        <div className="flex items-start gap-4">
          <div className="text-2xl font-display font-bold flex-shrink-0"
               style={{ color: '#3b82f6' }}>Q{q.id}</div>
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
          Código de referência
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[['Python', q.codigo_py, '#a855f7'], ['C', q.codigo_c, '#3b82f6']].map(([lang, code, col]) => (
            <div key={lang}>
              <div className="text-xs font-mono mb-1" style={{ color: col }}>// {lang}</div>
              <div className="code-block text-xs leading-relaxed"
                   style={{ borderColor: col + '40' }}>
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
        <textarea
          value={integrantes}
          onChange={e => onIntegrantesChange(e.target.value)}
          placeholder="Nome completo dos integrantes (um por linha)"
          rows={2}
          style={areaStyle}
        />
      </div>

      {/* Perguntas */}
      <div className="flex flex-col gap-5">
        {q.perguntas.map((pergunta, i) => (
          <div key={i} className="rounded-xl border overflow-hidden"
               style={{ borderColor: 'var(--bg-border)' }}>
            <div className="px-5 py-3 flex items-start gap-3"
                 style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--bg-border)' }}>
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                   style={{ background: '#3b82f6', color: '#fff' }}>
                {i + 1}
              </div>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {pergunta}
              </div>
            </div>
            <div className="px-5 py-3" style={{ background: 'var(--bg)' }}>
              <div className="text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Resposta do grupo:
              </div>
              <textarea
                value={respostas[i]}
                onChange={e => setResp(i, e.target.value)}
                placeholder="Digite sua resposta aqui..."
                rows={4}
                style={areaStyle}
                className="print-resp"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé da impressão */}
      <div className="mt-8 pt-4 text-xs font-mono text-center"
           style={{ borderTop: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}>
        CompSim · Atividade 1 · Grupo {grupo} · Questão {q.id} · {q.isa} · {q.bits} bits
        &nbsp;|&nbsp; renatoacastro.github.io/compsim
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────
export default function Atividade() {
  const [activeLab,   setActiveLab]   = useState('lab1')
  const [unlocked,    setUnlocked]    = useState(false)
  const [grupo,       setGrupo]       = useState(null)
  const [questaoId,   setQuestaoId]   = useState(null)
  const [integrantes, setIntegrantes] = useState('')

  // SENHA DA AULA — altere aqui antes de cada aula
  // Formato sugerido: código + data, ex: 'IFC0605' para aula de 06/05
  const SENHA_LAB1 = 'IFC2025'  // ← professor altera antes da aula
  const SENHA_LAB2 = 'IFC2025'

  const lab      = LABS.find(l => l.id === activeLab)
  const senhaAtual = activeLab === 'lab1' ? SENHA_LAB1 : SENHA_LAB2
  const questao  = lab.questoes.find(q => q.id === questaoId)

  function handleUnlock(g, qId) {
    setGrupo(g)
    setQuestaoId(qId)
    setUnlocked(true)
    setIntegrantes('')
  }

  function handleLockAgain() {
    setUnlocked(false)
    setGrupo(null)
    setQuestaoId(null)
    setIntegrantes('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8 no-print">
        <div className="p-2 rounded-xl" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)' }}>
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

      {/* Abas Lab 1 / Lab 2 */}
      {!unlocked && (
        <div className="flex gap-2 mb-8 no-print">
          {LABS.map(l => (
            <button key={l.id}
                    onClick={() => { setActiveLab(l.id); setUnlocked(false) }}
                    className="flex flex-col px-5 py-3 rounded-xl border transition-all"
                    style={{
                      background:   activeLab === l.id ? l.color + '15' : 'var(--bg-card)',
                      borderColor:  activeLab === l.id ? l.color + '50' : 'var(--bg-border)',
                    }}>
              <span className="font-display font-bold text-sm" style={{ color: activeLab === l.id ? l.color : 'var(--text-secondary)' }}>
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

      {/* Lab 2 ainda não disponível */}
      {activeLab === 'lab2' && !unlocked && (
        <div className="card text-center py-16" style={{ borderColor: 'var(--bg-border)' }}>
          <ClipboardList size={32} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
          <div className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
            Atividade 2
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Disponível após o laboratório de Controle de Fluxo, Pipeline e Cache.
          </div>
        </div>
      )}

      {/* Formulário de acesso */}
      {activeLab === 'lab1' && !unlocked && (
        <FormularioAcesso
          labColor={lab.color}
          onUnlock={handleUnlock}
          senhaAula={senhaAtual}
        />
      )}

      {/* Questão desbloqueada */}
      {unlocked && questao && (
        <div>
          {/* Barra de status */}
          <div className="flex items-center justify-between mb-6 no-print">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg"
                   style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <CheckCircle size={15} className="text-green-400" />
                <span className="text-sm font-mono font-bold text-green-400">
                  Grupo {grupo} — Questão {questaoId} desbloqueada
                </span>
              </div>
            </div>
            <button onClick={handleLockAgain} className="btn-ghost text-xs px-3 py-1.5">
              <Lock size={12} />Fechar
            </button>
          </div>

          {/* Botão de impressão */}
          <BotaoImprimir
            grupo={grupo}
            questao={questaoId}
            isa={questao.isa}
            integrantes={integrantes}
          />

          {/* A questão */}
          <QuestaoAberta
            q={questao}
            grupo={grupo}
            integrantes={integrantes}
            onIntegrantesChange={setIntegrantes}
          />
        </div>
      )}

      {/* Questão não encontrada */}
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
