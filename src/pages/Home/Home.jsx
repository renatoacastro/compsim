import { useNavigate } from 'react-router-dom'
import { BookOpen, FlaskConical, GitBranch, ClipboardList, ArrowRight, ChevronRight } from 'lucide-react'

const LAYERS = [
  { id: 'alto-nivel',    label: 'Alto Nível',     sub: 'Python / C',                color: '#a855f7', desc: 'Código que humanos escrevem' },
  { id: 'assembly',      label: 'Assembly',        sub: 'Mnemonics + Registradores', color: '#3b82f6', desc: 'Instruções da ISA escolhida' },
  { id: 'isa',           label: 'ISA',             sub: 'x86 · ARM · RISC-V · MIPS', color: '#06b6d4', desc: 'Interface Hardware/Software' },
  { id: 'binario',       label: 'Binário',         sub: 'Flags · SEXT · ZEXT',       color: '#22c55e', desc: 'Representação numérica da máquina' },
  { id: 'portas',        label: 'Portas Lógicas',  sub: 'XOR · AND · OR (Full Adder)',color: '#eab308', desc: 'Circuitos da ULA' },
  { id: 'sinais',        label: 'Sinais Elétricos',sub: 'CMOS 3.3V · LOW / HIGH',     color: '#f97316', desc: 'Física do transistor' },
]

const PAGES = [
  { to: '/teoria',     icon: BookOpen,      label: 'Teoria',      desc: 'Revisão rápida de cada camada',            color: 'text-accent-purple' },
  { to: '/simulador1', icon: FlaskConical,  label: 'Simulador 1', desc: 'Abstração: do código ao sinal elétrico',    color: 'text-accent-blue' },
  { to: '/simulador2', icon: GitBranch,     label: 'Simulador 2', desc: 'Controle de fluxo · Pipeline · Cache',      color: 'text-accent-green' },
  { to: '/atividade',  icon: ClipboardList, label: 'Atividade',   desc: 'Avaliação por grupo com senha',             color: 'text-accent-orange' },
]

export default function Home() {
  const nav = useNavigate()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                        bg-accent-blue/10 border border-accent-blue/20
                        text-accent-blue text-xs font-mono mb-6">
          Arquitetura de Computadores
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-4 leading-tight">
          Comp<span className="text-accent-blue">Sim</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
          Simulador didático das camadas de abstração de computadores —
          do código de alto nível ao sinal elétrico.
        </p>
        <p className="text-text-muted text-sm mt-3 font-mono">
          Prof. Renato A. Castro
        </p>
      </div>

      {/* Diagrama de abstração */}
      <section className="mb-16">
        <p className="section-title text-center mb-8">Camadas de Abstração</p>

        <div className="relative flex flex-col items-center gap-0">
          {LAYERS.map((layer, i) => (
            <div key={layer.id} className="flex flex-col items-center w-full max-w-lg">
              {/* Bloco */}
              <div
                className="w-full cursor-pointer group transition-all duration-200
                           hover:scale-[1.02] hover:shadow-xl"
                onClick={() => nav(i < 4 ? '/simulador1' : '/simulador1')}
                title={`Ver no Simulador 1: ${layer.label}`}
              >
                <div
                  className="rounded-xl px-6 py-4 border flex items-center justify-between"
                  style={{
                    background:   `${layer.color}12`,
                    borderColor:  `${layer.color}40`,
                  }}
                >
                  <div>
                    <div className="font-display font-semibold text-text-primary text-sm">
                      {layer.label}
                    </div>
                    <div className="font-mono text-xs mt-0.5" style={{ color: layer.color }}>
                      {layer.sub}
                    </div>
                  </div>
                  <div className="text-xs text-text-muted text-right max-w-[160px] leading-snug">
                    {layer.desc}
                  </div>
                </div>
              </div>

              {/* Seta de conexão */}
              {i < LAYERS.length - 1 && (
                <div className="flex flex-col items-center my-1 opacity-40">
                  <div className="w-px h-3 bg-text-muted" />
                  <ChevronRight size={12} className="text-text-muted rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-text-muted text-xs font-mono mt-6">
          Clique em qualquer camada para abrir o Simulador 1
        </p>
      </section>

      {/* Cards de navegação */}
      <section>
        <p className="section-title text-center mb-8">O que você quer fazer?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PAGES.map(({ to, icon: Icon, label, desc, color }) => (
            <button
              key={to}
              onClick={() => nav(to)}
              className="card text-left group hover:border-bg-border/80
                         hover:shadow-xl hover:shadow-black/30
                         transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 p-2 rounded-lg bg-bg-border/50 ${color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-text-primary text-sm mb-1">
                    {label}
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed">
                    {desc}
                  </div>
                </div>
                <ArrowRight size={16} className="text-text-muted group-hover:text-text-secondary
                                                  group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </section>

    </div>
  )
}
