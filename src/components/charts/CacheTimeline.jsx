// src/components/charts/CacheTimeline.jsx
// Linha do tempo de acessos cache — Hit (verde) vs Miss (vermelho) — SVG puro.

export function CacheTimeline({ resultsMap, addresses }) {
  // resultsMap: { 'Direto': results[], '2-way': results[], '4-way': results[] }
  const configs = Object.keys(resultsMap)
  const n       = addresses.length

  const CW    = Math.max(36, Math.min(56, Math.floor(560 / n)))
  const RH    = 52
  const LPAD  = 100
  const TOP   = 28
  const W     = LPAD + n * CW + 20
  const H     = TOP + configs.length * RH + 32

  function hitColor(hit) { return hit ? '#22c55e' : '#ef4444' }
  function hitBg(hit)    { return hit ? '#0d2a0d' : '#2a0d0d' }

  return (
    <div className="diagram-canvas overflow-x-auto">
      <svg width={W} height={H} style={{ minWidth: W }}>

        {/* Title */}
        <text x={W/2} y={16} textAnchor="middle" fontSize={10}
              fill="#94a3b8" fontFamily="JetBrains Mono,monospace">
          Linha do Tempo — Hit (verde) / Miss (vermelho) por acesso
        </text>

        {/* Address header */}
        {addresses.map((addr, i) => (
          <text key={i} x={LPAD + i * CW + CW/2} y={TOP - 3}
                textAnchor="middle" fontSize={7.5} fill="#475569"
                fontFamily="JetBrains Mono,monospace">
            {`0x${addr.toString(16).toUpperCase()}`}
          </text>
        ))}

        {/* Rows */}
        {configs.map((cfg, row) => {
          const results = resultsMap[cfg] || []
          const hits    = results.filter(r => r.hit).length
          const mr      = results.length ? (1 - hits / results.length) : 0

          return (
            <g key={cfg}>
              {/* Config label */}
              <text x={LPAD - 8} y={TOP + row * RH + RH/2 + 1}
                    textAnchor="end" dominantBaseline="middle"
                    fontSize={9} fill="#94a3b8"
                    fontFamily="JetBrains Mono,monospace">{cfg}</text>

              {/* Cells */}
              {results.map((r, i) => (
                <g key={i}>
                  <rect x={LPAD + i * CW + 2} y={TOP + row * RH + 4}
                        width={CW - 4} height={RH - 8} rx={5}
                        fill={hitBg(r.hit)} stroke={hitColor(r.hit)} strokeWidth={1.2}
                        opacity={0.85} />
                  <text x={LPAD + i * CW + CW/2} y={TOP + row * RH + RH/2 - 4}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={11} fontWeight="700" fill={hitColor(r.hit)}
                        fontFamily="JetBrains Mono,monospace">
                    {r.hit ? 'H' : 'M'}
                  </text>
                  <text x={LPAD + i * CW + CW/2} y={TOP + row * RH + RH/2 + 10}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={7} fill="#475569"
                        fontFamily="JetBrains Mono,monospace">
                    A{i}
                  </text>
                </g>
              ))}

              {/* Stats */}
              <text x={LPAD + n * CW + 6} y={TOP + row * RH + RH/2 - 4}
                    fontSize={8} fill="#94a3b8"
                    fontFamily="JetBrains Mono,monospace">
                {hits}/{results.length}
              </text>
              <text x={LPAD + n * CW + 6} y={TOP + row * RH + RH/2 + 8}
                    fontSize={8} fill={mr > 0.5 ? '#f87171' : '#4ade80'}
                    fontFamily="JetBrains Mono,monospace">
                {(mr * 100).toFixed(0)}%miss
              </text>
            </g>
          )
        })}

        {/* Legend */}
        {[['H', '#22c55e', '#0d2a0d', 'HIT — bloco na cache'],
          ['M', '#ef4444', '#2a0d0d', 'MISS — busca na RAM']].map(([sym, col, bg, lbl], i) => (
          <g key={i} transform={`translate(${LPAD + i * 160}, ${H - 16})`}>
            <rect width={16} height={12} rx={3} fill={bg} stroke={col} strokeWidth={1} />
            <text x={20} y={10} fontSize={8} fill="#94a3b8"
                  fontFamily="JetBrains Mono,monospace">{lbl}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
