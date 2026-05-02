// src/components/charts/AluDiagram.jsx
// Diagrama SVG do Ripple-Carry Adder — renderizado no cliente, sem bibliotecas externas.

import { rippleAdder } from '../../engine/binary.js'

const GATE_COLORS = {
  XOR: { fill: '#1e3a4a', stroke: '#06b6d4', text: '#06b6d4' },
  AND: { fill: '#1e3a20', stroke: '#22c55e', text: '#22c55e' },
  OR:  { fill: '#3a3a10', stroke: '#eab308', text: '#eab308' },
}

function GateBox({ x, y, w = 52, h = 28, type, value }) {
  const c = GATE_COLORS[type] || { fill: '#222', stroke: '#555', text: '#aaa' }
  const valColor = value ? '#4ade80' : '#f87171'
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5}
            fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle"
            fontSize={9} fontWeight="700" fill={c.text} fontFamily="JetBrains Mono, monospace">
        {type}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 8} textAnchor="middle"
            fontSize={10} fontWeight="700" fill={valColor} fontFamily="JetBrains Mono, monospace">
        {value}
      </text>
    </g>
  )
}

function Arrow({ x1, y1, x2, y2, color = '#4b5563' }) {
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth={1.2} markerEnd={`url(#arr-${color.replace('#', '')})`} />
    </g>
  )
}

export function AluDiagram({ aBin, bBin, sub = false, maxBits = 8 }) {
  const n    = Math.min(aBin.length, maxBits)
  const As   = aBin.slice(-n).padStart(n, '0')
  const Bs   = bBin.slice(-n).padStart(n, '0')
  const { result, carries, gates, carryOut } = rippleAdder(As, Bs, sub)

  const COL_W  = 90
  const ROW_H  = 200
  const PAD    = 20
  const SVG_W  = n * COL_W + PAD * 2
  const SVG_H  = ROW_H + PAD * 2

  const arrowColor = '#374151'

  return (
    <div className="diagram-canvas overflow-x-auto">
      <svg width={SVG_W} height={SVG_H} style={{ minWidth: SVG_W }}>
        <defs>
          {['374151','4ade80','f87171','06b6d4'].map(c => (
            <marker key={c} id={`arr-${c}`} markerWidth="6" markerHeight="6"
                    refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill={`#${c}`} />
            </marker>
          ))}
        </defs>

        {/* Título */}
        <text x={SVG_W / 2} y={14} textAnchor="middle"
              fontSize={10} fill="#6b7280" fontFamily="JetBrains Mono, monospace">
          ULA — Ripple-Carry Adder {n} bits | {sub ? 'Subtração (NOT B + Cin=1)' : 'Adição (Cin=0)'}
        </text>

        {Array.from({ length: n }, (_, i) => {
          const g   = gates[i] || {}
          const ab  = parseInt(As[i])
          const bb  = parseInt(Bs[i])
          const cin = carries[i] ?? (sub ? 1 : 0)
          const sb  = parseInt(result[i]) || 0
          const cout = i < n - 1 ? carries[i + 1] : carryOut

          const cx = PAD + i * COL_W + COL_W / 2
          const Y0 = PAD + 22

          return (
            <g key={i}>
              {/* Bit label */}
              <text x={cx} y={Y0} textAnchor="middle"
                    fontSize={9} fill="#6b7280" fontFamily="JetBrains Mono, monospace">
                Bit {n - 1 - i}
              </text>

              {/* Entradas */}
              <text x={cx} y={Y0 + 16} textAnchor="middle"
                    fontSize={8.5} fill="#06b6d4" fontFamily="JetBrains Mono, monospace">
                A={ab} B={bb} Cin={cin}
              </text>

              {/* XOR1 */}
              <GateBox x={cx - 26} y={Y0 + 28} type="XOR"
                       value={g.xor1 ?? (ab ^ bb)} />
              <line x1={cx} y1={Y0 + 56} x2={cx} y2={Y0 + 68}
                    stroke={arrowColor} strokeWidth={1} />

              {/* XOR2 (soma) */}
              <GateBox x={cx - 26} y={Y0 + 68} type="XOR"
                       value={g.sum ?? sb} />
              <text x={cx} y={Y0 + 114} textAnchor="middle"
                    fontSize={9} fill={sb ? '#4ade80' : '#f87171'}
                    fontWeight="700" fontFamily="JetBrains Mono, monospace">
                S={sb}
              </text>

              {/* AND1 */}
              <GateBox x={cx - 46} y={Y0 + 122} w={42} type="AND"
                       value={g.and1 ?? (ab & bb)} />

              {/* AND2 */}
              <GateBox x={cx + 4} y={Y0 + 122} w={42} type="AND"
                       value={g.and2 ?? ((ab ^ bb) & cin)} />

              {/* OR (Cout) */}
              <GateBox x={cx - 26} y={Y0 + 158} type="OR"
                       value={g.carry ?? cout} />
              <text x={cx} y={Y0 + 200} textAnchor="middle"
                    fontSize={9} fill={cout ? '#4ade80' : '#f87171'}
                    fontWeight="700" fontFamily="JetBrains Mono, monospace">
                Cout={cout}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}


// ── Waveform diagram ──────────────────────────────────────────────

export function WaveformDiagram({ aBin, bBin, rBin, label }) {
  const n   = aBin.length
  const Ab  = aBin.split('').map(Number)
  const Bb  = bBin.split('').map(Number)
  const Rb  = rBin.split('').map(Number)
  const Xb  = Ab.map((a, i) => a ^ Bb[i])

  const sigs = [
    { bits: Ab, label: `A (${parseInt(aBin, 2)})`,           color: '#06b6d4' },
    { bits: Bb, label: `B (${parseInt(bBin, 2)})`,           color: '#f97316' },
    { bits: Rb, label: `S — resultado (${parseInt(rBin,2)})`, color: '#22c55e' },
    { bits: Xb, label: 'XOR(A,B) — prop. carry',             color: '#a855f7' },
  ]

  const TW     = 40   // width per bit
  const RH     = 42   // row height
  const LW     = 130  // label width
  const PAD    = 12
  const SVG_W  = LW + n * TW + PAD * 2
  const SVG_H  = sigs.length * RH + PAD * 2 + 28

  function wavePath(bits) {
    const pts = []
    let prev = bits[0]
    pts.push(`M ${LW + PAD} ${prev ? PAD + 2 : RH - PAD}`)
    bits.forEach((bit, i) => {
      const x = LW + PAD + i * TW
      if (bit !== prev) {
        pts.push(`L ${x} ${prev ? PAD + 2 : RH - PAD}`)
        pts.push(`L ${x} ${bit  ? PAD + 2 : RH - PAD}`)
      }
      pts.push(`L ${x + TW - 1} ${bit ? PAD + 2 : RH - PAD}`)
      prev = bit
    })
    return pts.join(' ')
  }

  return (
    <div className="diagram-canvas overflow-x-auto">
      <svg width={SVG_W} height={SVG_H} style={{ minWidth: SVG_W }}>
        {/* Title */}
        <text x={SVG_W / 2} y={14} textAnchor="middle"
              fontSize={10} fill="#6b7280" fontFamily="JetBrains Mono, monospace">
          Formas de Onda — {label} | CMOS 3.3V
        </text>

        {sigs.map(({ bits, label: lbl, color }, row) => {
          const oy = PAD + 20 + row * RH
          return (
            <g key={row}>
              {/* Row background */}
              <rect x={LW + PAD} y={oy} width={n * TW} height={RH - 4}
                    fill="#0d1117" rx={3} />

              {/* Label */}
              <text x={LW + PAD - 6} y={oy + RH / 2} textAnchor="end"
                    fontSize={8.5} fill={color} fontFamily="JetBrains Mono, monospace">
                {lbl}
              </text>

              {/* LOW / HIGH labels */}
              <text x={LW + PAD - 6} y={oy + 8} textAnchor="end"
                    fontSize={7} fill="#374151" fontFamily="JetBrains Mono, monospace">
                3.3V
              </text>
              <text x={LW + PAD - 6} y={oy + RH - 8} textAnchor="end"
                    fontSize={7} fill="#374151" fontFamily="JetBrains Mono, monospace">
                0V
              </text>

              {/* Threshold line */}
              <line x1={LW + PAD} y1={oy + RH / 2} x2={LW + PAD + n * TW} y2={oy + RH / 2}
                    stroke="#1f2937" strokeWidth={0.8} strokeDasharray="3,3" />

              {/* Waveform fill */}
              <path d={wavePath(bits) + ` L ${LW + PAD + n * TW} ${oy + RH - PAD} L ${LW + PAD} ${oy + RH - PAD} Z`}
                    fill={color} fillOpacity={0.08} />
              <path d={wavePath(bits)} fill="none"
                    stroke={color} strokeWidth={1.8} transform={`translate(0,${oy})`} />

              {/* Bit labels */}
              {bits.map((bit, i) => (
                <text key={i}
                      x={LW + PAD + i * TW + TW / 2}
                      y={oy + (bit ? 8 : RH - 3)}
                      textAnchor="middle" fontSize={7.5}
                      fill={color} fillOpacity={0.7}
                      fontFamily="JetBrains Mono, monospace">
                  b{n - 1 - i}={bit}
                </text>
              ))}
            </g>
          )
        })}

        {/* Clock axis */}
        {Array.from({ length: n }, (_, i) => (
          <text key={i}
                x={LW + PAD + i * TW + TW / 2}
                y={SVG_H - 4}
                textAnchor="middle" fontSize={8}
                fill="#4b5563" fontFamily="JetBrains Mono, monospace">
            T{i}
          </text>
        ))}
        <text x={SVG_W / 2} y={SVG_H} textAnchor="middle"
              fontSize={8} fill="#374151" fontFamily="JetBrains Mono, monospace">
          Ciclos de Clock (MSB → LSB)
        </text>
      </svg>
    </div>
  )
}
