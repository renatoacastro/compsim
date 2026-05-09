// src/pages/Sim2/teoria.js
// Conteúdo teórico para o painel esquerdo fixo do Sim2.
// Cada seção corresponde a uma aba de saída.

export const SIM2_TEORIA = {
  fluxo: {
    title: 'Controle de Fluxo',
    color: '#a855f7',
    icon:  '🔀',
    resumo: [
      'Condicionais e laços são traduzidos para instruções de comparação (CMP) e salto (Jcc, BEQ…).',
      'O compilador gera labels e back-edges para representar loops.',
      'O CFG (Grafo de Fluxo de Controle) mostra os caminhos possíveis de execução.',
    ],
    conceitos: [
      { label: 'if → CMP + Jcc',   texto: 'if (a > b) vira CMP a, b + JLE .else. A condição é invertida: salta quando a condição NÃO é verdadeira, pulando o then.' },
      { label: 'for → INIT+COND+UPDATE', texto: 'O compilador gera 3 partes: inicialização (fora do laço), teste da condição (antes do corpo) e update (no final do corpo). Back-edge: JMP de volta ao teste.' },
      { label: 'while → COND first', texto: 'Testa a condição ANTES de executar o corpo. Se falsa na primeira iteração, o corpo nunca executa. Diferente do do-while.' },
      { label: 'do-while → body first', texto: 'Executa o corpo UMA VEZ antes de testar a condição. Gera menos instruções que while quando ao menos 1 iteração é garantida.' },
      { label: 'Back-edge',         texto: 'Aresta de volta no CFG — indica um laço. Toda back-edge implica um JMP/B incondicional para um label anterior no código.' },
    ],
    dica: 'O compilador INVERTE a condição do if para gerar o salto. if (a > b) → JLE .else. Isso evita um JMP extra — o caso "true" continua em linha reta.',
    ref: 'Zhirkov Cap. 5 · Weber Cap. 4',
  },

  cfg: {
    title: 'Grafo de Fluxo (CFG)',
    color: '#06b6d4',
    icon:  '🗺️',
    resumo: [
      'O CFG divide o código em blocos básicos — sequências sem desvio.',
      'Arestas representam transferências de controle (saltos, branches).',
      'Back-edges identificam laços.',
    ],
    conceitos: [
      { label: 'Bloco básico',  texto: 'Sequência maximal de instruções sem desvio interno. Entrada só no início, saída só no final. Compiladores otimizam blocos básicos independentemente.' },
      { label: 'Nó de decisão', texto: 'Bloco que termina com um branch condicional. Tem duas arestas de saída: true e false. Representado como losango no CFG.' },
      { label: 'Back-edge',     texto: 'Aresta que vai para um nó "anterior" no CFG — indica laço. Pontilhada no diagrama para diferenciar de arestas de avanço.' },
      { label: 'Merge point',   texto: 'Nó com múltiplas entradas — onde caminhos do if/else se reencontram. O compilador garante que o estado do programa seja consistente aqui.' },
    ],
    dica: 'O número de back-edges no CFG é igual ao número de laços no código. Um loop aninhado tem 2 back-edges.',
    ref: 'Zhirkov Cap. 6 · Patterson & Hennessy Cap. 4',
  },

  pipeline: {
    title: 'Pipeline 5 Estágios',
    color: '#f97316',
    icon:  '🔄',
    resumo: [
      'Pipeline executa múltiplas instruções simultaneamente — uma por estágio.',
      'CPI ideal = 1.0 (uma instrução completada por ciclo).',
      'Hazards interrompem o fluxo ideal e aumentam o CPI.',
    ],
    conceitos: [
      { label: 'IF/ID/EX/MEM/WB', texto: 'IF: busca instrução. ID: decodifica e lê registradores. EX: ULA executa. MEM: acessa memória. WB: escreve resultado. Cada estágio usa hardware dedicado.' },
      { label: 'Data Hazard',     texto: 'Instrução precisa de um resultado que ainda não foi escrito. Solução: Forwarding passa o resultado direto da saída do EX para a entrada do próximo EX, sem esperar WB.' },
      { label: 'Load-Use Hazard', texto: 'LW seguido imediatamente de instrução que usa o valor carregado. O dado só fica disponível após MEM — exige 1 stall obrigatório mesmo com forwarding.' },
      { label: 'Control Hazard',  texto: 'Branch — não sabemos qual instrução buscar até EX resolver a condição. Sem predição: 2 stalls (busca as 2 próximas instruções e descarta se o branch for tomado).' },
      { label: 'CPI',             texto: 'Cycles Per Instruction. CPI ideal = 1. Cada stall aumenta o CPI. Com forwarding: Load-Use +1, Control +2. Sem forwarding: cada data hazard +2.' },
    ],
    dica: 'Forwarding EX→EX: resolve data hazard em distância 1 (instrução imediatamente posterior). MEM→EX: resolve distância 2. Load-Use sempre gera 1 stall mesmo com forwarding.',
    ref: 'Patterson & Hennessy Cap. 4 · Weber Cap. 6',
  },

  cache: {
    title: 'Cache',
    color: '#22c55e',
    icon:  '💾',
    resumo: [
      'Cache explora localidade temporal (reusar dados recentes) e espacial (dados próximos).',
      'AMAT = HitTime + MissRate × MissPenalty.',
      'Maior associatividade → menos conflitos, mas mais complexidade de hardware.',
    ],
    conceitos: [
      { label: 'Tag / Índice / Offset', texto: 'O endereço de 32 bits é dividido: offset (byte no bloco), índice (qual conjunto), tag (qual bloco da RAM está aqui). Tamanho do bloco = 2^offset_bits.' },
      { label: 'Mapeamento Direto',     texto: '1-way: cada endereço mapeia em exatamente uma linha da cache. Simples e rápido, mas sofre thrashing quando dois endereços frequentes mapeiam no mesmo índice.' },
      { label: 'Set Associativo',        texto: '2-way ou 4-way: cada índice tem 2 ou 4 "ways". O bloco pode ir para qualquer way do conjunto. Reduz thrashing mas precisa de comparador paralelo.' },
      { label: 'LRU',                    texto: 'Least Recently Used: quando o conjunto está cheio, descarta o bloco acessado há mais tempo. Aproximação do comportamento ótimo para maioria dos acessos.' },
      { label: 'Thrashing',              texto: 'Dois ou mais endereços mapeiam no mesmo conjunto e se alternam — 100% de misses. Solução: aumentar associatividade ou tamanho da cache.' },
    ],
    dica: 'AMAT = 1 + MissRate × 10 ciclos (típico). Com 50% miss rate: AMAT = 6 ciclos — 6× mais lento que um hit. Cache 4-way geralmente reduz o miss rate à metade em relação ao mapeamento direto.',
    ref: 'Patterson & Hennessy Cap. 5',
  },
}
