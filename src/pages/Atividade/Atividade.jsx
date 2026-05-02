import { ClipboardList } from 'lucide-react'

export default function Atividade() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardList size={22} className="text-accent-orange" />
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">Atividade Avaliativa</h1>
          <p className="text-text-muted text-xs font-mono">
            Enunciado por grupo · Senha · Exportar PDF
          </p>
        </div>
      </div>
      <div className="card text-center py-16 text-text-muted text-sm font-mono">
        🔧 Em construção — próxima etapa
      </div>
    </div>
  )
}
