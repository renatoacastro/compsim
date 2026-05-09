// src/pages/Atividade/questoes.js
// 20 enunciados únicos para a Atividade 1 — Sim1
// Nível: médio → alto
// Cobre: Assembly, Binário, Flags, SEXT/ZEXT, Complemento de 2,
//        Full Adder, Sinais Elétricos, Arrays simples, ISA comparada

export const QUESTOES_LAB1 = [

  // ── Q01 ──────────────────────────────────────────────────────
  {
    id:  1,
    isa: 'x86-64 (Intel/AMD)',
    bits: 32,
    titulo: 'Overflow de sensor de temperatura',
    contexto:
      'Um sensor industrial armazena temperatura em um registrador de 8 bits com sinal. ' +
      'O valor atual é 120°C e ocorre um pico de +10°C.',
    codigo_py: 'temp = 120\ndelta = 10\nresult = temp + delta',
    codigo_c:  'signed char temp = 120;\nsigned char delta = 10;\nsigned char result = temp + delta;',
    a: 120, b: 10, op: '+', bits: 8,
    perguntas: [
      'Represente temp (120) e delta (10) em binário de 8 bits com sinal. Qual é o valor máximo positivo em 8 bits com sinal?',
      'Execute a soma bit a bit. Qual é o resultado binário? Os flags OF e CF foram ativados? Justifique.',
      'Gere o Assembly x86-64 para esta operação. Use registradores de 8 bits (AL, BL). Quais flags são afetados?',
      'O que acontece com o valor armazenado no registrador? Explique o conceito de overflow com sinal e as consequências práticas.',
      'ARRAY: O sensor registra leituras em um array de 4 posições: temp[4] = {120, 118, 122, 119}. Escreva o Assembly x86-64 que carrega temp[2] usando endereçamento indexado (LEA ou MOV com base+índice).',
    ],
    gabarito: [
      '120 = 0111 1000; 10 = 0000 1010; MAX positivo 8-bit com sinal = 127 (0111 1111)',
      '0111 1000 + 0000 1010 = 1000 0010 = -126 decimal. OF=1 (dois positivos geraram negativo). CF=0 (sem carry do bit 7).',
      'MOV AL, 120 / MOV BL, 10 / ADD AL, BL. Flags: CF, OF, ZF, SF, PF, AF.',
      'AL passa a valer -126 (interpretação com sinal). Overflow com sinal = resultado matematicamente incorreto. Em C: undefined behavior para signed char.',
      'LEA RBX, [temp] / MOV AL, [RBX + 2*1] ; carrega temp[2] = 122. Stride = 1 byte (char).',
    ],
  },

  // ── Q02 ──────────────────────────────────────────────────────
  {
    id:  2,
    isa: 'ARM (32-bit)',
    bits: 16,
    titulo: 'Subtração com borrow — controle de estoque',
    contexto:
      'Um sistema de estoque armazena quantidades em 16 bits sem sinal. ' +
      'O estoque atual é 50 unidades e ocorre uma saída de 75 unidades.',
    codigo_py: 'estoque = 50\nsaida = 75\nsaldo = estoque - saida',
    codigo_c:  'unsigned short estoque = 50;\nunsigned short saida = 75;\nunsigned short saldo = estoque - saida;',
    a: 50, b: 75, op: '-', bits: 16,
    perguntas: [
      'Represente estoque (50) e saida (75) em binário de 16 bits. Qual a diferença entre unsigned short e signed short?',
      'Execute a subtração. Os flags CF e SF foram ativados? O que CF=1 significa em uma subtração?',
      'Gere o Assembly ARM32 para esta operação. Qual instrução atualiza os flags no ARM? Explique o sufixo "S".',
      'Calcule o complemento de 2 de saida (75) em 16 bits e some com estoque (50). Confirme o resultado.',
      'ARRAY: O estoque tem 4 produtos: qtd[4] = {50, 120, 30, 200}. Escreva Assembly ARM32 que percorre o array e carrega cada elemento em R0.',
    ],
    gabarito: [
      '50 = 0000 0000 0011 0010; 75 = 0000 0000 0100 1011. unsigned: 0-65535, signed: -32768 a 32767.',
      'CF=1 (borrow: 50 < 75). SF=1 (MSB=1, resultado interpretado como negativo). Resultado = 65511 (unsigned) ou -25 (signed).',
      'MOV R0, #50 / MOV R1, #75 / SUBS R2, R0, R1. O "S" em SUBS atualiza o CPSR (N, Z, C, V).',
      'NOT(75) = 1111 1111 1011 0100; +1 = 1111 1111 1011 0101 (-75). 50 + (-75) = 1111 1111 1110 0111 = -25.',
      'LDR R1, =qtd / MOV R2, #0 / loop: LDR R0, [R1, R2, LSL #2] / ADD R2, R2, #1 / CMP R2, #4 / BLT loop.',
    ],
  },

  // ── Q03 ──────────────────────────────────────────────────────
  {
    id:  3,
    isa: 'RISC-V (RV32I)',
    bits: 32,
    titulo: 'Zero Flag e comparação — sistema de autenticação',
    contexto:
      'Um sistema verifica se uma senha digitada bate com a senha armazenada ' +
      'comparando dois valores de 32 bits.',
    codigo_py: 'senha_armazenada = 0xDEAD\nsenha_digitada   = 0xDEAD\nmatch = senha_armazenada - senha_digitada',
    codigo_c:  'unsigned int armazenada = 0xDEAD;\nunsigned int digitada   = 0xDEAD;\nunsigned int match = armazenada - digitada;',
    a: 0xDEAD, b: 0xDEAD, op: '-', bits: 32,
    perguntas: [
      'Qual o valor decimal de 0xDEAD? Represente em binário de 16 bits.',
      'Execute a subtração. Qual flag é ativado? Como o RISC-V detecta igualdade sem flags de hardware?',
      'Gere o Assembly RISC-V para esta comparação usando BEQ. Por que o RISC-V não tem instrução CMP?',
      'Explique a diferença entre a abordagem x86 (CMP + JE) e RISC-V (BEQ rs1, rs2, label) para detectar igualdade.',
      'ARRAY: As últimas 4 tentativas de senha estão em tentativas[4]. Escreva Assembly RISC-V que verifica se algum elemento do array é igual a 0xDEAD e salta para .achou se encontrar.',
    ],
    gabarito: [
      '0xDEAD = 57005 decimal. Binário 16 bits: 1101 1110 1010 1101.',
      'ZF=1 (resultado zero). RISC-V usa BEQ a0, a1, label — compara dois registradores diretamente.',
      'LI a0, 0xDEAD / LI a1, 0xDEAD / BEQ a0, a1, .igual. Sem CMP porque RISC-V é RISC puro: branch já compara.',
      'x86: CMP atualiza RFLAGS, JE lê ZF. RISC-V: BEQ compara e salta em 1 instrução, sem registrador de flags.',
      'LI t2, 0xDEAD / LI t3, 0 / loop: LW t0, 0(a0) / BEQ t0, t2, .achou / ADDI a0, a0, 4 / ADDI t3, t3, 1 / LI t4, 4 / BLT t3, t4, loop.',
    ],
  },

  // ── Q04 ──────────────────────────────────────────────────────
  {
    id:  4,
    isa: 'MIPS (32-bit)',
    bits: 32,
    titulo: 'Multiplicação e Delay Slot — cálculo de área',
    contexto:
      'Um programa calcula a área de um retângulo. ' +
      'Base = 15, Altura = 8. Resultado deve caber em 32 bits.',
    codigo_py: 'base = 15\naltura = 8\narea = base * altura',
    codigo_c:  'int base = 15;\nint altura = 8;\nint area = base * altura;',
    a: 15, b: 8, op: '*', bits: 32,
    perguntas: [
      'Represente base (15) e altura (8) em binário de 32 bits. Qual o resultado esperado da multiplicação?',
      'No MIPS, MULT armazena o resultado em dois registradores especiais. Quais são eles e o que cada um guarda?',
      'Gere o Assembly MIPS completo. Inclua MULT, MFLO e explique o "delay slot" após instruções de branch.',
      'Por que o MIPS não tem flags OF/CF como o x86? Como ele detecta overflow em multiplicação?',
      'ARRAY: A grade tem dimensões[8] com pares (base, altura). Escreva Assembly MIPS que calcula a área do par na posição i (i em $t3), carregando base de dim[2i] e altura de dim[2i+1].',
    ],
    gabarito: [
      '15 = 0x0000000F, 8 = 0x00000008. Resultado = 120 = 0x00000078.',
      'HI = parte alta do produto (bits 63-32). LO = parte baixa (bits 31-0). Para resultados que cabem em 32 bits, só LO importa.',
      'LI $t0, 15 / LI $t1, 8 / MULT $t0, $t1 / NOP (delay slot) / MFLO $t2. Delay slot: instrução após MULT sempre executa antes do resultado ser disponível.',
      'MIPS é RISC — sem EFLAGS. Overflow em MULT: verificar se HI ≠ 0 (resultado maior que 32 bits).',
      'SLL $t4, $t3, 1 / SLL $t5, $t4, 2 / ADDU $t6, $a0, $t5 / LW $t0, 0($t6) / LW $t1, 4($t6) / MULT $t0, $t1 / MFLO $v0.',
    ],
  },

  // ── Q05 ──────────────────────────────────────────────────────
  {
    id:  5,
    isa: 'ARM64 / AArch64',
    bits: 64,
    titulo: 'SEXT em leitura de arquivo binário',
    contexto:
      'Um parser de arquivo binário lê um byte (signed char) e precisa ' +
      'ampliar para 64 bits para aritmética com ponteiros.',
    codigo_py: 'byte_lido = -42\noffset64 = byte_lido',
    codigo_c:  'signed char byte_lido = -42;\nlong long offset64 = byte_lido;',
    a: -42, b: 0, op: '+', bits: 8,
    perguntas: [
      'Represente -42 em binário de 8 bits (complemento de 2). Mostre o passo a passo: positivo → NOT → +1.',
      'Ao ampliar -42 de 8 para 64 bits com SEXT, qual é o valor binário resultante? Quantos bits 1 são replicados?',
      'Gere o Assembly ARM64 usando SXTB (Sign Extend Byte). Compare com UXTB (zero extension) — qual seria o resultado numérico de cada um?',
      'Por que usar SEXT em vez de simplesmente mover o byte para um registrador de 64 bits? O que aconteceria com ZEXT para -42?',
      'ARRAY: Um arquivo tem header[8] = {0x01, 0xFF, 0x7F, 0x80, ...} (8 bytes signed). Escreva Assembly ARM64 que carrega header[1] (0xFF = -1) e header[2] (0x7F = 127) com SEXTB e calcula a soma em X0.',
    ],
    gabarito: [
      '42 = 0010 1010. NOT = 1101 0101. +1 = 1101 0110 = -42 em 8 bits.',
      'SEXT replica o MSB (bit 7 = 1) nos 56 bits superiores: 1111...1111 1101 0110. 56 bits 1 replicados + 8 bits originais.',
      'SXTB X0, W1. SXTB: X0 = -42 (sign extend). UXTB: X0 = 214 (zero extend, interpreta como unsigned).',
      'SEXT preserva o valor numérico com sinal. ZEXT de -42 daria 214, interpretação errada para aritmética de ponteiros.',
      'LDRB W0, [X1, #1] / SXTB X0, W0 ; -1 / LDRB W1, [X1, #2] / SXTB X1, W1 ; +127 / ADD X0, X0, X1 ; resultado = 126.',
    ],
  },

  // ── Q06 ──────────────────────────────────────────────────────
  {
    id:  6,
    isa: 'x86-64 (Intel/AMD)',
    bits: 32,
    titulo: 'Operações lógicas — máscara de bits em protocolo de rede',
    contexto:
      'Um pacote de rede tem um campo de flags de 32 bits. ' +
      'O bit 3 (SYN) precisa ser verificado e o bit 7 (FIN) precisa ser limpo.',
    codigo_py: 'flags = 0b10001010\nmask_syn = 0b00001000\nresult = flags & mask_syn',
    codigo_c:  'unsigned int flags = 0x8A;\nunsigned int mask = 0x08;\nunsigned int syn = flags & mask;',
    a: 0x8A, b: 0x08, op: '+', bits: 32,
    perguntas: [
      'Converta 0x8A para binário de 8 bits. Identifique quais bits estão ativados.',
      'Execute flags AND mask_syn (0x08) bit a bit. O bit SYN (bit 3) está ativado neste pacote?',
      'Gere o Assembly x86-64 para: (a) verificar bit SYN com AND, (b) limpar bit FIN (bit 7) com AND + NOT, (c) ativar bit RST (bit 2) com OR.',
      'Quais flags do processador são afetados por AND e OR? O flag CF e OF são zerados — por quê?',
      'ARRAY: Um buffer recebe 8 pacotes em flags[8]. Escreva Assembly x86-64 que conta quantos pacotes têm o bit SYN ativo, armazenando o contador em RCX.',
    ],
    gabarito: [
      '0x8A = 1000 1010. Bits ativos: 1 (bit 1), 3 (bit 3), 7 (bit 7).',
      '1000 1010 AND 0000 1000 = 0000 1000 = 8 ≠ 0. Bit SYN está ATIVO.',
      'TEST EAX, 0x08 (verifica SYN) / AND EAX, 0x7F (limpa bit 7: NOT(0x80)=0x7F) / OR EAX, 0x04 (ativa bit 2).',
      'AND/OR: ZF=1 se resultado=0, SF=1 se MSB=1. CF=OF=0 sempre (operações lógicas nunca geram carry/overflow).',
      'XOR RCX, RCX / MOV RSI, flags / MOV R8, 8 / loop: MOV EAX, [RSI] / TEST EAX, 0x08 / JZ .skip / INC RCX / .skip: ADD RSI, 4 / DEC R8 / JNZ loop.',
    ],
  },

  // ── Q07 ──────────────────────────────────────────────────────
  {
    id:  7,
    isa: 'ARM (32-bit)',
    bits: 32,
    titulo: 'Deslocamento lógico — divisão e multiplicação por potência de 2',
    contexto:
      'Um DSP usa deslocamentos para multiplicar e dividir por potências de 2 ' +
      'sem usar a instrução de multiplicação (mais lenta).',
    codigo_py: 'valor = 13\nmul4  = valor << 2\ndiv2  = valor >> 1',
    codigo_c:  'unsigned int valor = 13;\nunsigned int mul4 = valor << 2;\nunsigned int div2 = valor >> 1;',
    a: 13, b: 4, op: '*', bits: 32,
    perguntas: [
      'Represente 13 em binário de 8 bits. Execute LSL #2 (shift left 2 posições) manualmente. Qual o resultado decimal?',
      'Execute LSR #1 (shift right lógico 1 posição) em 13. Compare com ASR #1 (aritmético). A diferença importa para números positivos?',
      'Gere o Assembly ARM32 para as três operações. Qual é a vantagem de usar LSL em vez de MUL em um processador RISC?',
      'O que acontece com o flag CF em um LSL quando o bit deslocado para fora é 1? Dê um exemplo com 13 << 28.',
      'ARRAY: Um array de 8 inteiros amostras[8] precisa ser multiplicado por 4. Escreva Assembly ARM32 que faz LSL #2 em cada elemento e armazena no mesmo array (in-place).',
    ],
    gabarito: [
      '13 = 0000 1101. LSL #2 = 0011 0100 = 52. Equivale a 13 × 4.',
      'LSR #1: 0000 0110 = 6. ASR #1: igual para positivos (replica o 0). Diferença aparece em negativos: ASR replica bit de sinal.',
      'MOV R0, #13 / LSL R1, R0, #2 / LSR R2, R0, #1. LSL é 1 ciclo, MUL pode ser multi-ciclo em ARM simples.',
      '13 = 0000 1101. 13 << 28: o bit 3 (=1) eventualmente é deslocado para fora — CF=1 quando isso ocorre.',
      'LDR R1, =amostras / MOV R2, #0 / loop: LDR R0, [R1, R2, LSL #2] / LSL R0, R0, #2 / STR R0, [R1, R2, LSL #2] / ADD R2, #1 / CMP R2, #8 / BLT loop.',
    ],
  },

  // ── Q08 ──────────────────────────────────────────────────────
  {
    id:  8,
    isa: 'RISC-V (RV32I)',
    bits: 32,
    titulo: 'Full Adder e propagação de carry — somador de 4 bits manual',
    contexto:
      'Trace manualmente a execução de um Ripple-Carry Adder de 4 bits ' +
      'somando os valores 9 (1001) e 7 (0111).',
    codigo_py: 'a = 9\nb = 7\nc = a + b',
    codigo_c:  'unsigned char a = 9;\nunsigned char b = 7;\nunsigned char c = a + b;',
    a: 9, b: 7, op: '+', bits: 4,
    perguntas: [
      'Represente 9 e 7 em binário de 4 bits. Qual o resultado esperado e ele cabe em 4 bits?',
      'Trace o Full Adder bit a bit (do bit 0 ao bit 3): para cada bit calcule A, B, Cin, XOR1, XOR2(=S), AND1, AND2, OR(=Cout). Monte a tabela.',
      'Identifique quais portas lógicas tiveram saída = 1 no bit mais significativo (bit 3). O carry-out final foi 1?',
      'Gere o Assembly RISC-V para a = 9, b = 7, c = a + b. Mostre os valores esperados em cada registrador após a execução.',
      'ARRAY: Implemente em Assembly RISC-V uma função que some dois arrays de 4 inteiros (a[4] e b[4]) elemento a elemento e armazene em c[4]. Mostre o loop completo.',
    ],
    gabarito: [
      '9 = 1001, 7 = 0111. 9+7=16 = 10000 — não cabe em 4 bits (carry-out = 1).',
      'Bit0: A=1,B=1,Cin=0, XOR1=0, S=0, AND1=1, AND2=0, Cout=1. Bit1: A=0,B=1,Cin=1, XOR1=1, S=0, AND1=0, AND2=1, Cout=1. Bit2: A=0,B=1,Cin=1, XOR1=1, S=0, Cout=1. Bit3: A=1,B=0,Cin=1, XOR1=1, S=0, Cout=1.',
      'Bit3: XOR1=1(saída=1), AND2=1(saída=1), OR=1(saída=1). Carry-out final = 1.',
      'LI a0, 9 / LI a1, 7 / ADD a2, a0, a1. Após: a0=9, a1=7, a2=16.',
      'LI t0, 0 / loop: LW t1, 0(a0) / LW t2, 0(a1) / ADD t3, t1, t2 / SW t3, 0(a2) / ADDI a0,a0,4 / ADDI a1,a1,4 / ADDI a2,a2,4 / ADDI t0,t0,1 / LI t4,4 / BLT t0,t4,loop.',
    ],
  },

  // ── Q09 ──────────────────────────────────────────────────────
  {
    id:  9,
    isa: 'x86-64 (Intel/AMD)',
    bits: 32,
    titulo: 'Sinais elétricos e Clock — análise de formas de onda',
    contexto:
      'Um osciloscópio captura os sinais dos operandos A = 0b10110100 ' +
      'e do resultado S = A + B, onde B = 0b01001100, em 8 bits.',
    codigo_py: 'A = 0b10110100\nB = 0b01001100\nS = A + B',
    codigo_c:  'unsigned char A = 0xB4;\nunsigned char B = 0x4C;\nunsigned char S = A + B;',
    a: 0xB4, b: 0x4C, op: '+', bits: 8,
    perguntas: [
      'Converta A (0xB4) e B (0x4C) para decimal e binário de 8 bits. Qual o resultado S? Os flags CF e ZF foram ativados?',
      'Para o sinal A = 1011 0100, identifique quais bits (T0 a T7) estão em HIGH (3.3V) e quais em LOW (0V) em uma forma de onda CMOS.',
      'No resultado S, o MSB (T0) está em HIGH ou LOW? Relacione com o flag SF. O que isso indica sobre o valor com sinal?',
      'Explique o conceito de limiar lógico (~1.5V) em CMOS. O que acontece com um sinal que oscila entre 1.2V e 1.8V?',
      'ARRAY: O osciloscópio captura 8 amostras de 8 bits cada: leituras[8] = {0xB4, 0x4C, 0xFF, 0x00, 0x80, 0x7F, 0xAA, 0x55}. Para cada amostra, determine se o MSB é HIGH ou LOW (escreva a sequência H/L).',
    ],
    gabarito: [
      'A=0xB4=180dec=1011 0100. B=0x4C=76dec=0100 1100. S=256=0x100→wrap-around=0x00. CF=1(overflow unsigned), ZF=1(resultado=0).',
      'A=10110100: T0=HIGH(1), T1=LOW(0), T2=HIGH(1), T3=HIGH(1), T4=LOW(0), T5=HIGH(1), T6=LOW(0), T7=LOW(0).',
      'S=0x00, MSB(T0)=LOW(0V). SF=0 — resultado zero, não negativo. Mas CF=1 indica estouro unsigned.',
      'Abaixo de 0.8V=LOW certo. Acima de 2V=HIGH certo. Entre 0.8V-2V = zona proibida. 1.2-1.8V = indeterminado, glitch, metaestabilidade.',
      '0xB4=HIGH, 0x4C=LOW, 0xFF=HIGH, 0x00=LOW, 0x80=HIGH, 0x7F=LOW, 0xAA=HIGH, 0x55=LOW. Sequência: H L H L H L H L.',
    ],
  },

  // ── Q10 ──────────────────────────────────────────────────────
  {
    id: 10,
    isa: 'MIPS (32-bit)',
    bits: 32,
    titulo: 'ZEXT em processamento de pixels RGB',
    contexto:
      'Um processador de imagem lê componentes RGB como unsigned char (8 bits) ' +
      'e precisa ampliá-los para 32 bits para cálculos de blending.',
    codigo_py: 'r = 255\ng = 128\nb_val = 64\nblend = (r + g + b_val) // 3',
    codigo_c:  'unsigned char r=255, g=128, b=64;\nunsigned int blend = ((unsigned int)r + g + b) / 3;',
    a: 255, b: 128, op: '+', bits: 8,
    perguntas: [
      'Represente r=255, g=128, b=64 em binário de 8 bits. Qual o MSB de cada um? Eles são tratados como positivos (ZEXT) ou com sinal (SEXT)?',
      'Se usarmos SEXT para r=255 (1111 1111), qual seria o valor em 32 bits? Por que isso está errado para pixels RGB?',
      'Gere Assembly MIPS que faz ZEXT (LBU) de r, g e b para 32 bits, depois soma e divide por 3.',
      'Mostre o Full Adder para a soma r(255) + g(128) em 8 bits. O flag CF é ativado? O que o sistema deve fazer?',
      'ARRAY: pixels[12] armazena 4 pixels RGB consecutivos (R0,G0,B0,R1,G1,B1,...). Escreva Assembly MIPS que calcula o brilho médio do pixel 0: (R0+G0+B0)/3.',
    ],
    gabarito: [
      'r=1111 1111, g=1000 0000, b=0100 0000. MSBs: r=1, g=1, b=0. Como unsigned: ZEXT (não SEXT).',
      'SEXT de 0xFF = 0xFFFFFFFF = -1 decimal. Errado — pixel 255 deve ser +255, não -1.',
      'LBU $t0, r / LBU $t1, g / LBU $t2, b / ADDU $t3, $t0, $t1 / ADDU $t3, $t3, $t2 / LI $t4, 3 / DIV $t3, $t4 / MFLO $v0.',
      '1111 1111 + 1000 0000 = 0111 1111 com CF=1. Em 8 bits blend saturation: clip a 255 ou usa 16 bits.',
      'LBU $t0, 0($a0) / LBU $t1, 1($a0) / LBU $t2, 2($a0) / ADDU $t3,$t0,$t1 / ADDU $t3,$t3,$t2 / LI $t4,3 / DIV $t3,$t4 / MFLO $v0.',
    ],
  },

  // ── Q11 ──────────────────────────────────────────────────────
  {
    id: 11,
    isa: 'ARM64 / AArch64',
    bits: 64,
    titulo: 'Overflow de inteiro — CRC32 em firmware',
    contexto:
      'Um algoritmo de CRC32 soma valores unsigned de 32 bits. ' +
      'Dois acumuladores valem 3.000.000.000 e 2.000.000.000.',
    codigo_py: 'acc1 = 3000000000\nacc2 = 2000000000\ncrc  = acc1 + acc2',
    codigo_c:  'unsigned int acc1 = 3000000000U;\nunsigned int acc2 = 2000000000U;\nunsigned int crc  = acc1 + acc2;',
    a: 3000000000, b: 2000000000, op: '+', bits: 32,
    perguntas: [
      'Qual o valor máximo de unsigned int (32 bits)? A soma 3.000.000.000 + 2.000.000.000 cabe? Qual o resultado real com wrap-around?',
      'Calcule o resultado em hexadecimal. Os flags CF e OF são ativados? (Lembre: OF é para com sinal, CF é para sem sinal.)',
      'Gere Assembly ARM64 para esta operação. Por que usar W0/W1 (32 bits) em vez de X0/X1 (64 bits) para unsigned int?',
      'Se o programador usasse X0/X1 (64 bits), o overflow ocorreria? Explique a diferença entre usar 32 bits vs 64 bits para unsigned int.',
      'ARRAY: Um buffer de checksums tem crc[4] = {3000000000U, 2000000000U, 1500000000U, 2500000000U}. Escreva Assembly ARM64 que soma todos os elementos em X0 (usando 64 bits para evitar overflow).',
    ],
    gabarito: [
      'MAX uint32 = 4.294.967.295. 3B + 2B = 5B > 4.29B. Wrap-around: 5.000.000.000 - 4.294.967.296 = 705.032.704.',
      '3B=0xB2D05E00, 2B=0x77359400. Soma=0x12A05F200→trunca para 0x2A05F200. CF=1(overflow unsigned). OF depende de interpretação signed.',
      'MOV W0, #... / MOV W1, #... / ADD W2, W0, W1. W=32 bits, trunca automaticamente. unsigned int é 32 bits.',
      'Com X0/X1 (64 bits): 5.000.000.000 cabe perfeitamente, sem overflow. Usar o tipo correto é fundamental.',
      'LDR X1,[X0] / LDR X2,[X0,#4] / UXTW X2,W2 / ADD X1,X1,X2 / LDR X3,[X0,#8] / UXTW X3,W3 / ADD X1,X1,X3 / LDR X4,[X0,#12] / UXTW X4,W4 / ADD X0,X1,X4.',
    ],
  },

  // ── Q12 ──────────────────────────────────────────────────────
  {
    id: 12,
    isa: 'x86-64 (Intel/AMD)',
    bits: 16,
    titulo: 'Parity Flag e detecção de erro — protocolo serial',
    contexto:
      'Um protocolo serial usa paridade par (PF) para verificar integridade. ' +
      'O byte transmitido é 0b10110101 (8 bits).',
    codigo_py: 'dado = 0b10110101\ncalc = dado + 0',
    codigo_c:  'unsigned char dado = 0b10110101;\nunsigned char resultado = dado;',
    a: 0b10110101, b: 0, op: '+', bits: 8,
    perguntas: [
      'Conte os bits 1 em 0b10110101. O número é par ou ímpar? O flag PF será 1 ou 0?',
      'Para que serve o Parity Flag (PF) no x86? Em que cenário prático ele é usado hoje em dia?',
      'Gere Assembly x86-64 que carrega o dado, faz ADD AL, 0 (só para atualizar flags) e verifica o PF com JPE/JPO.',
      'Se o byte for corrompido e um bit for invertido (0b10110111), o PF muda? Mostre o cálculo.',
      'ARRAY: Um buffer de comunicação tem bytes[8]. Escreva Assembly x86-64 que verifica a paridade de cada byte e conta quantos têm paridade ímpar (PF=0) em RCX.',
    ],
    gabarito: [
      '10110101: bits 1 nas posições 0,2,4,5,7 = 5 bits. Número ÍMPAR → PF=0 (PF=1 somente se par).',
      'PF indica paridade do byte baixo do resultado. Usado em comunicação serial (RS-232) e memórias ECC. Raro hoje em software.',
      'MOV AL, 0b10110101 / ADD AL, 0 / JPE .paridade_par / JPO .paridade_impar.',
      '0b10110111: bits 1 = 0,1,2,4,5,7 = 6 bits. Par → PF=1. Sim, PF muda — detecção de erro de 1 bit funciona.',
      'XOR RCX,RCX / MOV RSI,bytes / MOV R8,8 / loop: MOV AL,[RSI] / ADD AL,0 / JPE .skip / INC RCX / .skip: INC RSI / DEC R8 / JNZ loop.',
    ],
  },

  // ── Q13 ──────────────────────────────────────────────────────
  {
    id: 13,
    isa: 'RISC-V (RV32I)',
    bits: 32,
    titulo: 'Comparação sem flags — ordenação de array (bubble sort parcial)',
    contexto:
      'O RISC-V não tem flags de hardware. Implemente uma comparação ' +
      'entre dois elementos de um array e troque se estiver fora de ordem.',
    codigo_py: 'v = [42, 17]\nif v[0] > v[1]:\n    v[0], v[1] = v[1], v[0]',
    codigo_c:  'int v[2] = {42, 17};\nif (v[0] > v[1]) {\n    int tmp = v[0]; v[0] = v[1]; v[1] = tmp;\n}',
    a: 42, b: 17, op: '-', bits: 32,
    perguntas: [
      'Represente 42 e 17 em binário de 32 bits. A diferença 42-17 gera CF ou OF? Qual o resultado?',
      'No RISC-V, como verificar se v[0] > v[1] sem o flag CF? Qual instrução de branch usar?',
      'Gere Assembly RISC-V completo para o swap condicional, incluindo o endereçamento do array.',
      'Compare com x86-64: quantas instruções cada ISA usa para esta operação? Por que o RISC-V precisa de mais instruções mas ainda é considerado eficiente?',
      'ARRAY: Implemente um passo do Bubble Sort em RISC-V para um array de 4 inteiros v[4]. O loop deve comparar pares adjacentes e trocar se necessário.',
    ],
    gabarito: [
      '42=0x0000002A, 17=0x00000011. 42-17=25, CF=0(sem borrow), OF=0(sem overflow). Resultado=25.',
      'BLE t0,t1,.nao_troca ou usar BGT t0,t1,.trocar — BGT compara diretamente t0>t1.',
      'LW t0,0(a0) / LW t1,4(a0) / BGT t0,t1,.swap / J .fim / .swap: SW t1,0(a0) / SW t0,4(a0) / .fim.',
      'RISC-V: ~6 instruções. x86: ~4 com CMOV. RISC-V é eficiente porque todas são 32 bits fixos, pipeline simples.',
      'LI t2,0 / loop: LW t0,0(a0) / LW t1,4(a0) / BLE t0,t1,.skip / SW t1,0(a0) / SW t0,4(a0) / .skip: ADDI a0,a0,4 / ADDI t2,t2,1 / LI t3,3 / BLT t2,t3,loop.',
    ],
  },

  // ── Q14 ──────────────────────────────────────────────────────
  {
    id: 14,
    isa: 'ARM (32-bit)',
    bits: 32,
    titulo: 'Instrução condicional ARM — cálculo de valor absoluto',
    contexto:
      'O ARM32 permite que qualquer instrução seja condicional, sem precisar de branch. ' +
      'Calcule o valor absoluto de -37 usando RSBLT (RSB se negativo).',
    codigo_py: 'x = -37\nabs_x = abs(x)',
    codigo_c:  'int x = -37;\nint abs_x = (x < 0) ? -x : x;',
    a: -37, b: 0, op: '+', bits: 32,
    perguntas: [
      'Represente -37 em binário de 32 bits (complemento de 2). Mostre o passo a passo.',
      'No ARM32, CMP R0, #0 atualiza quais flags para R0 = -37? Qual flag indica que R0 é negativo?',
      'Gere Assembly ARM32 usando execução condicional: CMP + RSBLT (Reverse Subtract if Less Than) para calcular |x| sem branch.',
      'Compare com x86-64: o x86 não tem execução condicional em instruções aritméticas (exceto CMOVcc). Quantas instruções o x86 precisaria para o mesmo resultado?',
      'ARRAY: Um array de 8 inteiros valores[8] contém positivos e negativos. Escreva Assembly ARM32 que substitui cada elemento pelo seu valor absoluto usando execução condicional (sem branch dentro do loop).',
    ],
    gabarito: [
      '37=0x25=0000...0010 0101. NOT=1111...1101 1010. +1=1111...1101 1011 = 0xFFFFFFDB = -37.',
      'CMP R0,#0: N=1(negativo), Z=0, C=0, V=0. N=1 indica resultado negativo.',
      'CMP R0, #0 / RSBLT R0, R0, #0 ; if(R0<0) R0 = 0 - R0. Apenas 2 instruções, sem branch!',
      'x86: CMP EAX,0 / JGE .pos / NEG EAX / .pos: — 3 instruções + 1 branch. ARM usa 2 instruções sem branch.',
      'LDR R1,=valores / MOV R2,#0 / loop: LDR R0,[R1,R2,LSL#2] / CMP R0,#0 / RSBLT R0,R0,#0 / STR R0,[R1,R2,LSL#2] / ADD R2,#1 / CMP R2,#8 / BLT loop.',
    ],
  },

  // ── Q15 ──────────────────────────────────────────────────────
  {
    id: 15,
    isa: 'x86-64 (Intel/AMD)',
    bits: 32,
    titulo: 'Overflow wrap-around — contador de rede com rollover',
    contexto:
      'Um contador de pacotes de rede usa unsigned int (32 bits). ' +
      'O contador está em 4.294.967.290 e chegam mais 10 pacotes.',
    codigo_py: 'contador = 4294967290\npacotes  = 10\nnovo = (contador + pacotes) % (2**32)',
    codigo_c:  'unsigned int contador = 4294967290U;\nunsigned int pacotes  = 10;\nunsigned int novo = contador + pacotes;',
    a: 4294967290, b: 10, op: '+', bits: 32,
    perguntas: [
      'Qual o valor máximo de unsigned int de 32 bits em hexadecimal? Calcule 4294967290 + 10 e o wrap-around.',
      'Mostre os últimos 8 bits (byte baixo) de 4294967290 em binário. O flag PF é 1 ou 0?',
      'Gere Assembly x86-64 para a operação. O flag CF é ativado? Como um programa pode usar CF para detectar o rollover?',
      'Explique por que o wrap-around de unsigned int é comportamento definido em C (ao contrário do overflow de signed int).',
      'ARRAY: contadores[4] = {4294967290U, 4294967295U, 4294967294U, 4294967292U}. Escreva Assembly x86-64 que soma 10 a cada elemento e armazena o resultado, detectando quais sofreram rollover (CF=1) e incrementando um contador de rollovers em R9.',
    ],
    gabarito: [
      'MAX=0xFFFFFFFF=4294967295. 4294967290+10=4294967300. Wrap: 4294967300-4294967296=4. Novo valor=4.',
      '4294967290=0xFFFFFFFA. Byte baixo=0xFA=1111 1010. Bits 1: posições 1,3,4,5,6,7 = 6 bits → par → PF=1.',
      'MOV EAX,[contador] / MOV EBX,[pacotes] / ADD EAX,EBX. CF=1 após wrap-around. JC .rollover detecta.',
      'C padrão: unsigned overflow é módulo 2^N — comportamento definido. Signed overflow é UB pois compilador pode assumir que não ocorre.',
      'XOR R9,R9 / MOV RSI,contadores / MOV RCX,4 / loop: MOV EAX,[RSI] / ADD EAX,10 / MOV [RSI],EAX / JNC .skip / INC R9 / .skip: ADD RSI,4 / DEC RCX / JNZ loop.',
    ],
  },

  // ── Q16 ──────────────────────────────────────────────────────
  {
    id: 16,
    isa: 'ARM64 / AArch64',
    bits: 64,
    titulo: 'Registradores de 64 bits — soma de timestamps',
    contexto:
      'Um sistema de tempo real soma dois timestamps UNIX de 64 bits: ' +
      '1700000000000 ms + 86400000 ms (24 horas em milissegundos).',
    codigo_py: 'ts1 = 1700000000000\nts2 = 86400000\nresult = ts1 + ts2',
    codigo_c:  'long long ts1 = 1700000000000LL;\nlong long ts2 = 86400000LL;\nlong long result = ts1 + ts2;',
    a: 1700000000000, b: 86400000, op: '+', bits: 64,
    perguntas: [
      'Por que int (32 bits) não seria suficiente para timestamps Unix modernos? Qual o valor máximo de long long (64 bits)?',
      'Converta ts2 = 86400000 para hexadecimal. Este valor cabe em 32 bits? E em 16 bits?',
      'Gere Assembly ARM64 usando MOV/MOVK para carregar ts1 (64 bits). Por que é necessário usar MOVK múltiplas vezes?',
      'Os flags N, Z, C, V do PSTATE são ativados por ADDS (com S). Quais flags seriam ativados para ts1+ts2? Explique.',
      'ARRAY: Um array de 4 timestamps long long tempos[4] precisa ser somado com um offset de 86400000. Escreva Assembly ARM64 que percorre o array e adiciona o offset a cada elemento.',
    ],
    gabarito: [
      'INT32 max = 2147483647 ≈ 2.1B. UNIX timestamp 2024 > 1.7T — não cabe. LONG LONG max = 9.2 × 10^18.',
      '86400000 = 0x0524F800 — cabe em 32 bits (< 0xFFFFFFFF). Não cabe em 16 bits (max 65535).',
      'MOV X0, #0xF800 / MOVK X0, #0x524, LSL #16 / (mais MOVK para bits altos). ARM64 MOV é 16 bits por vez, MOVK "move with keep" preserva os outros bits.',
      'ts1+ts2 ≈ 1.7T+86M: resultado positivo pequeno vs max. N=0(positivo), Z=0, C=0(sem overflow 64b), V=0. Nenhum flag ativado.',
      'MOV X2, #86400000 / MOV X3, #0 / loop: LDR X0, [X1, X3, LSL #3] / ADD X0, X0, X2 / STR X0, [X1, X3, LSL #3] / ADD X3, X3, #1 / CMP X3, #4 / BLT loop.',
    ],
  },

  // ── Q17 ──────────────────────────────────────────────────────
  {
    id: 17,
    isa: 'MIPS (32-bit)',
    bits: 32,
    titulo: 'SLT e comparação sem flags — algoritmo de busca linear',
    contexto:
      'O MIPS usa SLT (Set Less Than) para comparações. ' +
      'Implemente uma busca linear em um array de 5 inteiros pelo valor 99.',
    codigo_py: 'v = [10, 45, 99, 22, 67]\nalvo = 99\npos = -1\nfor i in range(5):\n    if v[i] == alvo:\n        pos = i\n        break',
    codigo_c:  'int v[5]={10,45,99,22,67};\nint alvo=99, pos=-1;\nfor(int i=0;i<5;i++)\n    if(v[i]==alvo){pos=i;break;}',
    a: 99, b: 22, op: '-', bits: 32,
    perguntas: [
      'Represente 99 e 22 em binário de 32 bits. Calcule 99 - 22 e verifique CF e SF.',
      'No MIPS, como verificar igualdade entre dois registradores? Escreva a sequência: SUB + BEQ $zero vs BEQ direto.',
      'Gere Assembly MIPS completo para a busca linear, incluindo o loop, comparação e retorno da posição.',
      'O MIPS usa delay slot após branches. Mostre onde o NOP deve ser inserido no seu código e explique por que ele é necessário.',
      'ARRAY: Modifique o Assembly para busca em um array de 8 inteiros v[8] = {10,45,99,22,67,99,13,5}. Retorne a posição da ÚLTIMA ocorrência de 99 (não a primeira).',
    ],
    gabarito: [
      '99=0x63=0110 0011, 22=0x16=0001 0110. 99-22=77>0. CF=0(sem borrow), SF=0(positivo).',
      'BEQ $t0,$t1,igual — compara diretamente. Alternativa: SUBU $t2,$t0,$t1 / BEQ $t2,$zero,igual.',
      'LI $t0,0 / LI $v0,-1 / LA $t1,v / loop: LW $t2,0($t1) / BEQ $t2,$a0,.acha / NOP / ADDI $t1,$t1,4 / ADDI $t0,$t0,1 / SLTI $t3,$t0,5 / BNE $t3,$zero,loop / NOP / J .fim / .acha: MOVE $v0,$t0 / .fim.',
      'NOP após BEQ e BNE — instrução seguinte ao branch executa sempre. Sem NOP o próximo LW executaria antes do branch ser resolvido.',
      'Loop igual mas não usa break. Quando encontra: MOVE $v0,$t0 e continua o loop. Ao final $v0 tem a última posição.',
    ],
  },

  // ── Q18 ──────────────────────────────────────────────────────
  {
    id: 18,
    isa: 'x86-64 (Intel/AMD)',
    bits: 32,
    titulo: 'Complemento de 2 e negação — cálculo de diferença absoluta',
    contexto:
      'Um algoritmo de compressão calcula |A - B| para dois pixels. ' +
      'A = 200, B = 237. O resultado deve ser sempre positivo.',
    codigo_py: 'A = 200\nB = 237\ndiff = A - B\nabs_diff = abs(diff)',
    codigo_c:  'int A = 200, B = 237;\nint diff = A - B;\nint abs_diff = diff < 0 ? -diff : diff;',
    a: 200, b: 237, op: '-', bits: 32,
    perguntas: [
      'Calcule 200 - 237 em binário de 32 bits usando complemento de 2 de 237. Qual o resultado e os flags SF, CF?',
      'Para calcular abs(diff), o x86-64 usa NEG (negação). O que NEG faz internamente? Mostre para o resultado de A-B.',
      'Gere Assembly x86-64 completo: A-B, verificação de SF, aplicação de NEG se negativo. Use CMP + JNS.',
      'Calcule o Carry-Out do Full Adder no bit 31 (MSB) para 200 + NOT(237) + 1. Isso confirma CF=1?',
      'ARRAY: blocos[8] e referencia[8] armazenam valores de pixels. Escreva Assembly x86-64 que calcula sad[8] (Sum of Absolute Differences): sad[i] = |blocos[i] - referencia[i]|.',
    ],
    gabarito: [
      '200=0xC8, 237=0xED. NOT(237)+1=0xFFFFFF13 (-237). 200+(-237)=0xFFFFFFDB=-37. SF=1(negativo), CF=0(sem borrow em signed).',
      'NEG EAX = SUB 0,EAX = complemento de 2. NEG(-37) = 0x25 = 37.',
      'MOV EAX,200 / MOV EBX,237 / SUB EAX,EBX / JNS .pos / NEG EAX / .pos: MOV [abs_diff],EAX.',
      'Bit31 de 200: 0. Bit31 de NOT(237): 1. Cin (carry): depende dos bits inferiores. Carry-out bit31=0→CF=0 confirmado.',
      'XOR RCX,RCX / loop: MOV EAX,[RSI+RCX*4] / SUB EAX,[RDI+RCX*4] / JNS .pos / NEG EAX / .pos: MOV [RDX+RCX*4],EAX / INC RCX / CMP RCX,8 / JL loop.',
    ],
  },

  // ── Q19 ──────────────────────────────────────────────────────
  {
    id: 19,
    isa: 'RISC-V (RV32I)',
    bits: 32,
    titulo: 'Operações bit a bit — codificação de cores em 32 bits',
    contexto:
      'Um formato de cor armazena ARGB em 32 bits: ' +
      'bits [31:24]=Alpha, [23:16]=R, [15:8]=G, [7:0]=B. ' +
      'Extraia e recombine os canais de uma cor 0xFF8040C0.',
    codigo_py: 'cor = 0xFF8040C0\nalpha = (cor >> 24) & 0xFF\nr     = (cor >> 16) & 0xFF\ng     = (cor >>  8) & 0xFF\nb     = (cor >>  0) & 0xFF',
    codigo_c:  'unsigned int cor = 0xFF8040C0;\nunsigned char alpha=(cor>>24)&0xFF;\nunsigned char r=(cor>>16)&0xFF;\nunsigned char g=(cor>>8)&0xFF;\nunsigned char b=cor&0xFF;',
    a: 0xFF8040C0, b: 0xFF, op: '+', bits: 32,
    perguntas: [
      'Converta 0xFF8040C0 para binário de 32 bits. Identifique os 4 bytes (Alpha, R, G, B) em binário e decimal.',
      'Mostre as operações de extração: SRL (shift right lógico) e ANDI para isolar cada canal no RISC-V.',
      'Gere Assembly RISC-V completo para extrair todos os 4 canais em t0, t1, t2, t3.',
      'Para recombinar: use SLL e OR. Mostre como montar 0xFF8040C0 de volta a partir dos 4 canais extraídos.',
      'ARRAY: palette[4] = {0xFF8040C0, 0x80FF0000, 0xFF00FF00, 0x7F0000FF}. Escreva Assembly RISC-V que inverte os canais R e B de cada cor (swap R↔B mantendo A e G).',
    ],
    gabarito: [
      '0xFF8040C0 = 1111 1111 1000 0000 0100 0000 1100 0000. A=0xFF=255, R=0x80=128, G=0x40=64, B=0xC0=192.',
      'Alpha: SRLI t0,a0,24 / ANDI t0,t0,0xFF. R: SRLI t1,a0,16 / ANDI t1,t1,0xFF. G: SRLI t2,a0,8 / ANDI t2,t2,0xFF. B: ANDI t3,a0,0xFF.',
      'LW a0, cor / SRLI t0,a0,24 / ANDI t0,t0,255 / SRLI t1,a0,16 / ANDI t1,t1,255 / SRLI t2,a0,8 / ANDI t2,t2,255 / ANDI t3,a0,255.',
      'SLLI t1_s,t1,16 / SLLI t2_s,t2,8 / SLLI t0_s,t0,24 / OR res,t0_s,t1_s / OR res,res,t2_s / OR res,res,t3.',
      'Loop: LW t0,0(a0) / ANDI t1,t0,0xFF (B) / SRLI t2,t0,16 / ANDI t2,t2,0xFF (R) / SLLI t1s,t1,16 / OR t0,t0,t1s / AND t0,t0,0xFF00FFFF_mask / SLLI t2s,t2,0 / OR t0,t0,t2s / SW t0,0(a0) / ADDI a0,a0,4.',
    ],
  },

  // ── Q20 ──────────────────────────────────────────────────────
  {
    id: 20,
    isa: 'x86-64 (Intel/AMD)',
    bits: 32,
    titulo: 'Análise completa — pipeline de processamento de áudio',
    contexto:
      'Um buffer de áudio de 8 samples de 16 bits com sinal (short) ' +
      'precisa ter seu volume ajustado: cada sample é multiplicado por 3/4 ' +
      '(equivalente a * 3 depois >> 2). Samples: [-32768, 16384, -1, 32767, 0, -16384, 8192, -8192].',
    codigo_py:
      'samples = [-32768, 16384, -1, 32767, 0, -16384, 8192, -8192]\nadjusted = [(s * 3) >> 2 for s in samples]',
    codigo_c:
      'short samples[8] = {-32768,16384,-1,32767,0,-16384,8192,-8192};\nfor(int i=0;i<8;i++)\n    samples[i] = (short)((samples[i] * 3) >> 2);',
    a: -32768, b: 3, op: '*', bits: 16,
    perguntas: [
      'Represente -32768 e 32767 em binário de 16 bits. Qual o padrão de bits de cada um? Eles são os limites de signed short?',
      'Calcule (-32768 × 3): o resultado cabe em 16 bits? Em 32 bits? Quais flags seriam ativados em operação de 16 bits?',
      'Gere Assembly x86-64 para processar samples[0] = -32768: MOVSX (SEXT de 16→32 bits), IMUL por 3, SAR (shift aritmético) por 2.',
      'Por que usar SAR (shift aritmético direito) em vez de SHR (shift lógico direito) para amostras de áudio com sinal?',
      'Escreva o Assembly x86-64 completo do loop que processa todos os 8 samples: carrega com MOVSX, multiplica por 3 com IMUL, divide por 4 com SAR #2, e armazena de volta com MOV WORD PTR.',
    ],
    gabarito: [
      '-32768=1000 0000 0000 0000 (só bit 15 = 1). 32767=0111 1111 1111 1111. Sim — extremos do signed short.',
      '-32768×3=-98304. Não cabe em 16 bits (max=-32768). Cabe em 32 bits. Em 16 bits: OF=1(overflow signed).',
      'MOVSX EAX, WORD PTR[RDI] / IMUL EAX, 3 / SAR EAX, 2 / MOV WORD PTR[RDI], AX.',
      'SAR replica o bit de sinal: -4 SAR 1 = -2 (correto). SHR de -4 daria um número positivo enorme (incorreto para áudio).',
      'XOR RCX,RCX / loop: MOVSX EAX,WORD PTR[RSI+RCX*2] / IMUL EAX,3 / SAR EAX,2 / MOV WORD PTR[RSI+RCX*2],AX / INC RCX / CMP RCX,8 / JL loop.',
    ],
  },
]
