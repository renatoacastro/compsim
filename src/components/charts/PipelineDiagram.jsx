// src/components/charts/PipelineDiagram.jsx
// Diagrama de execução pipeline ciclo a ciclo — SVG puro.

import { STAGES } from '../../engine/pipeline.js'

const STAGE_COLORS = {
  IF:    { fill: '#0d2035', stroke: '#3b82f6', text: '#93c5fd' },
  ID:    { fill: '#1a0d2a', stroke: '#a855f7', text: '#d8b4fe' },
  EX:    { fill: '#2a1a00', stroke: '#f97316', text: '#fdba74' },
  MEM:   { fill: '#2a0d0d', stroke: '#ef4444', text: '#fca5a5' },
  WB:    { fill: '#0d2a0d', stroke: '#22c55e', text: '#86efac' },
  stall: { fill: '#1a1a1a', stroke: '#374151', text: '#ef4444' },
  '':    { fill: 'transparent', stroke: 'none', text: 'transparent' },
}

// Forwarding path colors
const FWD_COLORS = {
  'EX→EX Forwarding':        '#22c55e',
  'MEM→EX Forwarding':       '#eab308',
  'Load-Use (1 stall)':      '#ef4444',
  'Control Hazard (2 stalls)':'#f97316',
}

export function PipelineDiagram({ table, infoList, hazards, fwdPaths, totalCycles, cpi, forwarding }) {
  if (!table || table.length === 0) return null

  const n    = table.length
  const nc   = Math.max(...table.map(r => r.length), 1)
  const CW   = 42   // cell width
  const RH   = 32   // row height
  const LPAD = 200  // left padding for instruction labels
  const TOP  = 28
  const W    = LPAD + nc * CW + 20
  const H    = TOP + n * RH + 40

  function cellColor(val) {
    return STAGE_COLORS[val] || STAGE_COLORS['']
  }

  // Find column of a stage for a given instruction row
  function findStageCol(rowIdx, stage) {
    return table[rowIdx]?.indexOf(stage) ?? -1
  }

  const mode = forwarding ? 'COM Forwarding' : 'SEM Forwarding'

  return (
    <div className="diagram-canvas overflow-x-auto">
      <svg width={W} height={H} style={{ minWidth: W }}>

        {/* Title */}
        <text x={W/2} y={16} textAnchor="middle" fontSize={10}
              fill="#94a3b8" fontFamily="JetBrains Mono,monospace">
          Pipeline 5 Estágios — {mode} — {totalCycles} ciclos — CPI = {cpi}
        </text>

        {/* Cycle header */}
        {Array.from({ length: nc }, (_, c) => (
          <text key={c} x={LPAD + c * CW + CW/2} y={TOP - 4}
                textAnchor="middle" fontSize={8} fill="#475569"
                fontFamily="JetBrains Mono,monospace">C{c+1}</text>
        ))}

        {/* Cells */}
        {table.map((row, i) => {
          const h = hazards?.[i] || {}
          const hasHaz = h.loadUse || h.controlHazard || (h.dataHazard?.length > 0)
          const instrLabel = infoList?.[i]?.raw?.slice(0, 22) || `I${i}`

          return (
            <g key={i}>
              {/* Instruction label */}
              <text x={LPAD - 6} y={TOP + i * RH + RH/2 + 1}
                    textAnchor="end" dominantBaseline="middle"
                    fontSize={8} fontFamily="JetBrains Mono,monospace"
                    fill={hasHaz ? '#fde047' : '#94a3b8'}>
                I{i} {instrLabel}
              </text>

              {/* Hazard indicator */}
              {h.loadUse && (
                <text x={LPAD - 8} y={TOP + i * RH + RH/2 + 1}
                      textAnchor="end" dominantBaseline="middle"
                      fontSize={7} fill="#ef4444"
                      fontFamily="JetBrains Mono,monospace">⚠LU</text>
              )}

              {/* Stage cells */}
              {row.map((val, c) => {
                if (!val) return null
                const col = cellColor(val)
                return (
                  <g key={c}>
                    <rect x={LPAD + c * CW + 1} y={TOP + i * RH + 1}
                          width={CW - 2} height={RH - 2} rx={4}
                          fill={col.fill} stroke={col.stroke} strokeWidth={1.2}
                          opacity={0.9} />
                    <text x={LPAD + c * CW + CW/2} y={TOP + i * RH + RH/2 + 1}
                          textAnchor="middle" dominantBaseline="middle"
                          fontSize={val === 'stall' ? 7 : 8.5}
                          fill={col.text} fontWeight="700"
                          fontFamily="JetBrains Mono,monospace">
                      {val === 'stall' ? 'STALL' : val}
                    </text>
                  </g>
                )
              })}
            </g>
          )
        })}

        {/* Forwarding arrows */}
        {forwarding && fwdPaths?.map((fp, idx) => {
          if (fp.from < 0 || fp.from >= n || fp.to >= n) return null
          const srcStage = fp.path.includes('MEM') ? 'MEM' : 'EX'
          const sc = findStageCol(fp.from, srcStage)
          const dc = findStageCol(fp.to,   'EX')
          if (sc < 0 || dc < 0) return null

          const x0 = LPAD + sc * CW + CW/2
          const y0 = TOP + fp.from * RH + RH
          const x1 = LPAD + dc * CW + CW/2
          const y1 = TOP + fp.to   * RH
          const col = FWD_COLORS[fp.path] || '#94a3b8'
          const mx  = (x0 + x1) / 2

          return (
            <g key={idx}>
              <defs>
                <marker id={`fwd-${idx}`} markerWidth="6" markerHeight="6"
                        refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={col} />
                </marker>
              </defs>
              <path d={`M ${x0} ${y0} C ${x0} ${y0+12} ${x1} ${y1-12} ${x1} ${y1}`}
                    fill="none" stroke={col} strokeWidth={1.8}
                    strokeDasharray="4,2"
                    markerEnd={`url(#fwd-${idx})`} opacity={0.8} />
              <text x={mx} y={(y0+y1)/2} textAnchor="middle"
                    fontSize={7} fill={col}
                    fontFamily="JetBrains Mono,monospace">
                {fp.path.split(' ')[0]}
              </text>
            </g>
          )
        })}

        {/* Stage legend */}
        {STAGES.map((s, i) => {
          const c = STAGE_COLORS[s]
          return (
            <g key={s} transform={`translate(${8 + i * 70}, ${H - 18})`}>
              <rect width={16} height={12} rx={3} fill={c.fill} stroke={c.stroke} strokeWidth={1} />
              <text x={20} y={10} fontSize={8} fill={c.text}
                    fontFamily="JetBrains Mono,monospace">{s}</text>
            </g>
          )
        })}
        <g transform={`translate(${8 + STAGES.length * 70}, ${H - 18})`}>
          <rect width={16} height={12} rx={3}
                fill={STAGE_COLORS.stall.fill} stroke={STAGE_COLORS.stall.stroke} strokeWidth={1} />
          <text x={20} y={10} fontSize={8} fill={STAGE_COLORS.stall.text}
                fontFamily="JetBrains Mono,monospace">STALL</text>
        </g>

      </svg>
    </div>
  )
}
