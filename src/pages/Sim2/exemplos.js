// src/pages/Sim2/exemplos.js
// Banco de exemplos para o Sim2 — Controle de Fluxo, Pipeline e Cache.

// ── Controle de Fluxo ─────────────────────────────────────────────
export const EXEMPLOS_FLUXO = {
  Python: {
    '— selecione —': '',

    'if / else (comparação simples)':
      '# Classifica nota\nnota = 75\nif nota >= 70:\n    aprovado = 1\nelse:\n    aprovado = 0',

    'if / elif / else':
      '# Três faixas de temperatura\ntemp = 30\nif temp > 35:\n    estado = 3\nelif temp > 20:\n    estado = 2\nelse:\n    estado = 1',

    'for crescente':
      '# Soma dos primeiros N inteiros\nsoma = 0\nfor i in range(0, 10):\n    soma = soma + i',

    'for decrescente':
      '# Contagem regressiva\nfor i in range(10, 0, -1):\n    print(i)',

    'while':
      '# Divide por 2 até chegar a zero\nn = 64\nwhile n > 0:\n    n = n - 2',

    'for + if (aninhado)':
      '# Soma só os ímpares\nsoma = 0\nfor i in range(0, 20):\n    if i > 10:\n        soma = soma + i',
  },

  C: {
    '— selecione —': '',

    'if / else':
      '// Verifica saldo\nint saldo = 150;\nint saque = 200;\nif (saldo >= saque) {\n    saldo = saldo - saque;\n} else {\n    saldo = saldo;\n}',

    'if / else if / else':
      '// Classificação de sensor\nint sensor = 42;\nif (sensor > 100) {\n    nivel = 3;\n} else if (sensor > 50) {\n    nivel = 2;\n} else {\n    nivel = 1;\n}',

    'for crescente':
      '// Acumula array\nint soma = 0;\nfor (int i = 0; i < 10; i++) {\n    soma = soma + i;\n}',

    'while':
      '// Potência de 2\nint n = 1;\nwhile (n < 256) {\n    n = n + n;\n}',

    'do-while':
      '// Lê até acertar senha\nint tentativas = 0;\ndo {\n    tentativas = tentativas + 1;\n} while (tentativas != 3);',

    'for + if':
      '// Conta valores acima do limiar\nint cont = 0;\nfor (int i = 0; i < 20; i++) {\n    if (i > 10) {\n        cont = cont + 1;\n    }\n}',
  },
}

// ── Pipeline ──────────────────────────────────────────────────────
export const EXEMPLOS_PIPELINE = {
  '— selecione —': '',

  'Sem hazard (pipeline ideal)':
    'ADD R1, R2, R3\nADD R4, R5, R6\nADD R7, R8, R9\nADD R10, R1, R4\nNOP',

  'Data hazard — EX→EX Forwarding':
    '; R1 escrito por ADD, lido por SUB imediatamente\nADD R1, R2, R3\nSUB R4, R1, R5\nAND R6, R4, R7\nOR  R8, R6, R9',

  'Load-Use hazard (1 stall obrigatório)':
    '; LW carrega R1 — próxima instrução lê R1\nLW  R1, R2, 0\nADD R3, R1, R4\nSUB R5, R3, R6\nAND R7, R5, R8',

  'Control hazard — branch (2 stalls)':
    '; BEQ causa 2 stalls sem branch prediction\nADD R1, R2, R3\nBEQ R1, R0, label\nSUB R4, R5, R6\nAND R7, R8, R9',

  'Múltiplos hazards combinados':
    '; Load-use + data hazard + control hazard\nLW  R1, R2, 0\nADD R3, R1, R4\nBEQ R3, R0, fim\nSUB R5, R3, R1\nOR  R6, R5, R7',

  'Forwarding MEM→EX (distância 2)':
    '; R1 escrito, 2 instruções depois lê R1\nADD R1, R2, R3\nMOV R4, R5\nSUB R6, R1, R4\nAND R7, R6, R8',
}

// ── Cache ─────────────────────────────────────────────────────────
export const EXEMPLOS_CACHE = {
  '— selecione —': { addrs: [], desc: '' },

  'Localidade temporal (repetições)': {
    addrs: [0, 4, 8, 0, 4, 0, 8, 4, 0, 4, 8, 0],
    desc:  'Mesmo endereço acessado várias vezes — cache aproveita bem a localidade temporal.',
  },
  'Localidade espacial (sequencial)': {
    addrs: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44],
    desc:  'Endereços consecutivos — cada bloco carregado é aproveitado várias vezes.',
  },
  'Thrashing — mapeamento direto': {
    addrs: [0, 64, 0, 64, 0, 64, 0, 64, 0, 64, 0, 64],
    desc:  'Dois endereços mapeiam no mesmo conjunto — cache direta sofre 100% de miss.',
  },
  'Acesso aleatório (pior caso)': {
    addrs: [0, 64, 128, 192, 256, 320, 0, 64, 128, 192, 256, 320],
    desc:  'Endereços espaçados — cada acesso é um miss. Cache não ajuda.',
  },
  'Loop sobre array (stride 1)': {
    addrs: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60],
    desc:  'Percorre array sequencialmente — boa localidade espacial.',
  },
  'Loop com stride grande (stride 16)': {
    addrs: [0, 64, 128, 192, 0, 64, 128, 192, 0, 64, 128, 192],
    desc:  'Stride de 16 bytes — cada acesso pula um bloco inteiro, thrashing em cache pequena.',
  },
}
