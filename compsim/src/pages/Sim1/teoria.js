// src/pages/Sim1/teoria.js
// Conteúdo teórico exibido no painel esquerdo fixo do Sim1.
// Cada camada tem: título, cor, resumo curto e dica rápida.

export const SIM1_TEORIA = {
  assembly: {
    title: 'Assembly',
    color: '#3b82f6',
    icon:  '⚙️',
    resumo: [
      'Assembly é a representação textual das instruções de máquina.',
      'Cada linha corresponde a exatamente 1 instrução do processador.',
      'O compilador faz o mapeamento: variável → registrador.',
    ],
    conceitos: [
      { label: 'Registrador',  texto: 'Memória ultra-rápida dentro da CPU. Cada ISA tem nomes diferentes: RAX (x86), R0 (ARM), a0 (RISC-V).' },
      { label: 'MOV',          texto: 'Copia um valor para um registrador. MOV RAX, 10 → RAX = 10.' },
      { label: 'ADD / SUB',    texto: 'Operações aritméticas. Resultado salvo no destino e flags atualizados.' },
      { label: 'CMP + Jcc',    texto: 'CMP compara dois valores (subtrai, descarta resultado). Jcc salta se a condição for verdadeira.' },
      { label: 'CALL / RET',   texto: 'CALL empilha o endereço de retorno e salta. RET desempilha e volta.' },
    ],
    dica: 'O mapa variável→registrador mostra como o compilador "traduz" nomes para hardware. Diferentes ISAs usam registradores e sintaxes diferentes para a mesma operação.',
    ref: 'Zhirkov Cap. 2 · Weber Cap. 4',
  },

  binario: {
    title: 'Binário + Flags',
    color: '#22c55e',
    icon:  '🔢',
    resumo: [
      'Internamente tudo é binário — 0s e 1s representam dados e instruções.',
      'A ULA executa operações e grava o resultado em flags de status.',
      'Flags controlam desvios condicionais (JE, BNE, BLT…).',
    ],
    conceitos: [
      { label: 'CF (Carry)',    texto: 'Vai-um do MSB. Indica overflow sem sinal ou borrow na subtração.' },
      { label: 'OF (Overflow)', texto: 'Transbordamento com sinal: dois positivos geraram negativo (ou vice-versa).' },
      { label: 'ZF (Zero)',     texto: 'Resultado é zero. JE / BEQ testam ZF=1 para detectar igualdade.' },
      { label: 'SF (Sign)',     texto: 'MSB=1 indica resultado negativo em complemento de 2.' },
      { label: 'SEXT / ZEXT',  texto: 'Ampliar tipo estreito: SEXT replica o bit de sinal, ZEXT preenche com zeros.' },
    ],
    dica: 'CF ≠ OF. CF é para unsigned (sem sinal). OF é para signed (com sinal). Exemplo: 200 + 56 em 8-bit → CF=1 (estouro unsigned), OF=0 (válido como unsigned).',
    ref: 'Weber Cap. 2 · Patterson & Hennessy Ap. B',
  },

  portas: {
    title: 'Portas Lógicas',
    color: '#eab308',
    icon:  '⚡',
    resumo: [
      'A ULA é construída com portas lógicas: AND, OR, XOR, NOT.',
      'A adição usa Full Adders encadeados (Ripple-Carry Adder).',
      'Cada Full Adder usa 2×XOR + 2×AND + 1×OR = 5 portas por bit.',
    ],
    conceitos: [
      { label: 'XOR',           texto: 'A⊕B = 1 se A≠B. Usado para calcular a soma parcial de cada bit.' },
      { label: 'AND',           texto: 'A·B = 1 só se A=1 E B=1. Gera carries parciais.' },
      { label: 'OR',            texto: 'A+B = 1 se pelo menos um for 1. Combina carries → Cout.' },
      { label: 'Full Adder',    texto: 'Circuito de 1 bit: S = A⊕B⊕Cin, Cout = (A·B) | ((A⊕B)·Cin).' },
      { label: 'Ripple-Carry',  texto: 'N Full Adders encadeados. O Cout de cada bit alimenta o Cin do próximo.' },
    ],
    dica: 'Subtração = NOT(B) + Cin=1. A mesma ULA de adição faz subtração: inverte B bit a bit e seta Cin=1 no primeiro Full Adder. Nenhum circuito extra necessário.',
    ref: 'Weber Cap. 3 · Patterson & Hennessy B.5',
  },

  sinais: {
    title: 'Sinais Elétricos',
    color: '#f97316',
    icon:  '〰️',
    resumo: [
      'Bit 0 = LOW (~0V), Bit 1 = HIGH (~3.3V) em CMOS moderno.',
      'O clock sincroniza todas as operações do processador.',
      'Transistores CMOS implementam as portas lógicas.',
    ],
    conceitos: [
      { label: 'LOW (0)',        texto: '0V a 0.8V — transistor NMOS desligado, PMOS ligado.' },
      { label: 'HIGH (1)',       texto: '2.0V a 3.3V — transistor PMOS desligado, NMOS ligado (VDD).' },
      { label: 'Limiar lógico', texto: '~1.5V — tensão de decisão entre LOW e HIGH.' },
      { label: 'Clock',          texto: 'Pulso periódico que sincroniza o pipeline. Cada borda de subida = 1 ciclo.' },
      { label: 'Propagação',    texto: 'O sinal elétrico precisa estabilizar antes da próxima borda. Define a frequência máxima.' },
    ],
    dica: 'O carry do Ripple-Carry Adder é o gargalo elétrico: para 64 bits, o sinal atravessa 64 Full Adders em série antes de estabilizar. Por isso CPUs modernas usam Carry-Lookahead.',
    ref: 'Weber Cap. 1 · Tanenbaum Cap. 3',
  },
}
