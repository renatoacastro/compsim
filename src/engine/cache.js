// ── engine/cache.js ─────────────────────────────────────────────
// Simulação de cache set-associativo com política LRU.
// Suporta: mapeamento direto (1-way), 2-way e 4-way.

/**
 * Simula cache e retorna resultado por acesso.
 *
 * @param {number[]} addresses   Sequência de endereços
 * @param {number}   cacheSize   Tamanho total em bytes
 * @param {number}   blockSize   Tamanho de bloco em bytes
 * @param {number}   assoc       Associatividade (1, 2 ou 4)
 * @returns {{ results, hits, missRate, config }}
 */
export function simulateCache(addresses, cacheSize, blockSize, assoc) {
  const numBlocks   = Math.floor(cacheSize / blockSize)
  const numSets     = Math.max(1, Math.floor(numBlocks / assoc))
  const offsetBits  = Math.log2(blockSize) | 0
  const indexBits   = numSets > 1 ? (Math.log2(numSets) | 0) : 0
  const tagBits     = Math.max(0, 32 - indexBits - offsetBits)

  const config = { cacheSize, blockSize, assoc, numSets, numBlocks, offsetBits, indexBits, tagBits }

  // sets: array de sets, cada set = array de { tag, time }
  const sets  = Array.from({ length: numSets }, () => [])
  let timer   = 0
  let hits    = 0
  const results = []

  for (const rawAddr of addresses) {
    const addr   = parseInt(rawAddr)
    const offset = addr & (blockSize - 1)
    const index  = numSets > 1 ? ((addr >> offsetBits) & (numSets - 1)) : 0
    const tag    = addr >> (offsetBits + indexBits)
    const s      = sets[index]

    const hitIdx = s.findIndex(e => e.tag === tag)
    const hit    = hitIdx !== -1

    if (hit) {
      hits++
      s[hitIdx].time = timer++
    } else {
      if (s.length < assoc) {
        s.push({ tag, time: timer++ })
      } else {
        const lruIdx = s.reduce((mi, e, i) => e.time < s[mi].time ? i : mi, 0)
        s[lruIdx] = { tag, time: timer++ }
      }
    }

    results.push({
      addr, tag, index, offset, hit,
      setSnapshot: s.map(e => e.tag),
    })
  }

  const missRate = addresses.length > 0 ? 1 - hits / addresses.length : 0
  return { results, hits, missRate, config }
}

/**
 * AMAT — Average Memory Access Time
 * AMAT = HitTime + MissRate × MissPenalty
 */
export function calcAMAT(missRate, hitTime = 1, missPenalty = 10) {
  return +(hitTime + missRate * missPenalty).toFixed(2)
}

/**
 * Analisa padrão de acesso para dica didática.
 */
export function analyzeAccessPattern(addresses) {
  if (addresses.length < 2) return 'poucos acessos'

  // Temporal: repetições
  const unique  = new Set(addresses).size
  const repRate = 1 - unique / addresses.length
  if (repRate > 0.4) return 'localidade temporal (repetições frequentes)'

  // Espacial: stride pequeno
  const strides = addresses.slice(1).map((a, i) => Math.abs(a - addresses[i]))
  const avgStride = strides.reduce((s, v) => s + v, 0) / strides.length
  if (avgStride <= 8) return 'localidade espacial (acesso sequencial)'
  if (avgStride > 32) return 'acesso aleatório / stride grande (pior caso para cache)'

  return 'padrão misto'
}
