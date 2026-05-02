import { GitBranch } from 'lucide-react'

export default function Sim2() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <GitBranch size={22} className="text-accent-green" />
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">Simulador 2</h1>
          <p className="text-text-muted text-xs font-mono">
            Controle de Fluxo · Laços · Pipeline · Cache
          </p>
        </div>
      </div>
      <div className="card text-center py-16 text-text-muted text-sm font-mono">
        🔧 Em construção — próxima etapa
      </div>
    </div>
  )
}
