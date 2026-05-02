// src/components/charts/CfgDiagram.jsx
// Diagrama SVG do Grafo de Fluxo de Controle (CFG).
// Renderizado no cliente sem bibliotecas externas.

const BLOCK_COLORS = {
  entry:     { fill: '#0d2035', stroke: '#06b6d4', text: '#06b6d4' },
  exit:      { fill: '#0d2035', stroke: '#06b6d4', text: '#06b6d4' },
  condition: { fill: '#2a1a00', stroke: '#f97316', text: '#fdba74' },
  body:      { fill: '#0d1a0d', stroke: '#22c55e', text: '#86efac' },
  init:      { fill: '#1a0d2a', stroke: '#a855f7', text: '#d8b4fe' },
  update:    { fill: '#2a2200', stroke: '#eab308', text: '#fde047' },
}

// Simple layout: stack blocks vertically, branch nodes offset
function layoutBlocks(blocks) {
  const pos = {}
  const CX = 300, STEP = 90

  function place(id, x, y, visited = new Set()) {
    if (visited.has(id) || id >= blocks.length) return
    visited.add(id)
    if (pos[id]) return
    pos[id] = { x, y }
    const b = blocks[id]
    if (b.nextTo  != null) place(b.nextTo,  x,       y + STEP, visited)
    if (b.trueTo  != null) place(b.trueTo,  x - 110, y + STEP, visited)
    if (b.falseTo != null) place(b.falseTo, x + 110, y + STEP, visited)
  }

  place(0, CX, 30, new Set())
  blocks.forEach((_, i) => { if (!pos[i]) pos[i] = { x: CX + 150, y: 30 + i * STEP } })
  return pos
}

function wrap(text, w = 18) {
  if (!text || text.length <= w) return [text || '']
  const words = text.split(' ')
  const lines = []
  let cur = ''
  for (const word of words) {
    if ((cur + ' ' + word).trim().length <= w) { cur = (cur + ' ' + word).trim() }
    else { if (cur) lines.push(cur); cur = word }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 3)
}

export function CfgDiagram({ blocks, title = 'CFG — Grafo de Fluxo de Controle' }) {
  if (!blocks || blocks.length === 0) return null

  const pos    = layoutBlocks(blocks)
  const xs     = Object.values(pos).map(p => p.x)
  const ys     = Object.values(pos).map(p => p.y)
  const minX   = Math.min(...xs) - 80
  const maxX   = Math.max(...xs) + 80
  const maxY   = Math.max(...ys) + 80
  const W      = maxX - minX + 10
  const H      = maxY + 30
  const BW     = 100, BH = 36

  function blockCenter(id) {
    const p = pos[id]
    if (!p) return { x: 300, y: 0 }
    return { x: p.x - minX, y: p.y }
  }

  const arrows = []
  blocks.forEach(b => {
    const { x: x0, y: y0 } = blockCenter(b.id)
    const edges = [
      ...(b.nextTo  != null ? [{ to: b.nextTo,  color: '#64748b', label: '',  dash: false }] : []),
      ...(b.trueTo  != null ? [{ to: b.trueTo,  color: '#22c55e', label: 'S', dash: false }] : []),
      ...(b.falseTo != null ? [{ to: b.falseTo, color: '#ef4444', label: 'N', dash: false }] : []),
    ]
    for (const { to, color, label, dash } of edges) {
      if (to >= blocks.length) continue
      const { x: x1, y: y1 } = blockCenter(to)
      const isBack = y1 <= y0
      arrows.push({ x0, y0: y0 + BH/2, x1, y1: y1 - BH/2 - 2, color, label, isBack, id: `${b.id}-${to}` })
    }
  })

  return (
    <div className="diagram-canvas overflow-x-auto">
      <svg width={W} height={H} style={{ minWidth: W }}>
        <defs>
          {['22c55e', 'ef4444', '64748b', 'f97316', '06b6d4'].map(c => (
            <marker key={c} id={`arr-${c}`} markerWidth="7" markerHeight="7"
                    refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 z" fill={`#${c}`} />
            </marker>
          ))}
        </defs>

        {/* Title */}
        <text x={W/2} y={16} textAnchor="middle" fontSize={11}
              fill="#94a3b8" fontFamily="JetBrains Mono,monospace">{title}</text>

        {/* Arrows */}
        {arrows.map(({ x0, y0, x1, y1, color, label, isBack, id }) => {
          const col = color.replace('#', '')
          const cx  = isBack ? x0 + 80 : (x0 + x1) / 2
          const cy  = (y0 + y1) / 2
          const d   = isBack
            ? `M ${x0} ${y0} C ${x0+90} ${y0} ${x1+90} ${y1} ${x1} ${y1}`
            : `M ${x0} ${y0} L ${x1} ${y1}`
          return (
            <g key={id}>
              <path d={d} fill="none" stroke={color} strokeWidth={1.5}
                    strokeDasharray={isBack ? '5,3' : 'none'}
                    markerEnd={`url(#arr-${col})`} />
              {label && (
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize={9}
                      fill={color} fontWeight="700"
                      fontFamily="JetBrains Mono,monospace">{label}</text>
              )}
            </g>
          )
        })}

        {/* Blocks */}
        {blocks.map(b => {
          const { x, y } = blockCenter(b.id)
          const c        = BLOCK_COLORS[b.type] || BLOCK_COLORS.body
          const lines    = b.lines?.length ? wrap(b.lines[0], 20) : ['?']
          const isDiamond = b.type === 'condition'

          return (
            <g key={b.id}>
              {isDiamond ? (
                <polygon
                  points={`${x},${y-BH/2} ${x+BW/2},${y} ${x},${y+BH/2} ${x-BW/2},${y}`}
                  fill={c.fill} stroke={c.stroke} strokeWidth={1.5}
                />
              ) : (
                <rect x={x - BW/2} y={y - BH/2} width={BW} height={BH}
                      rx={6} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
              )}
              {lines.map((ln, i) => (
                <text key={i} x={x} y={y + (i - (lines.length-1)/2) * 12}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={8.5} fill={c.text} fontWeight="600"
                      fontFamily="JetBrains Mono,monospace">
                  {ln}
                </text>
              ))}
              <text x={x + BW/2 + 3} y={y - BH/2 + 8} fontSize={7}
                    fill="#475569" fontFamily="monospace">B{b.id}</text>
            </g>
          )
        })}

        {/* Legend */}
        {[['S', '#22c55e', 'Branch verdadeiro'], ['N', '#ef4444', 'Branch falso'],
          ['···', '#64748b', 'Back-edge (laço)']].map(([sym, col, lbl], i) => (
          <g key={i} transform={`translate(8, ${H - 40 + i * 14})`}>
            <text x={0} y={0} fontSize={8} fill={col}
                  fontFamily="JetBrains Mono,monospace">{sym}</text>
            <text x={20} y={0} fontSize={8} fill="#64748b"
                  fontFamily="JetBrains Mono,monospace">{lbl}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
