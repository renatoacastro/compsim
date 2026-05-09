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
    'MTIwID0gMDExMSAxMDAwOyAxMCA9IDAwMDAgMTAxMDsgTUFYIHBvc2l0aXZvIDgtYml0IGNvbSBzaW5hbCA9IDEyNyAoMDExMSAxMTExKQ==',
    'MDExMSAxMDAwICsgMDAwMCAxMDEwID0gMTAwMCAwMDEwID0gLTEyNiBkZWNpbWFsLiBPRj0xIChkb2lzIHBvc2l0aXZvcyBnZXJhcmFtIG5lZ2F0aXZvKS4gQ0Y9MCAoc2VtIGNhcnJ5IGRvIGJpdCA3KS4=',
    'TU9WIEFMLCAxMjAgLyBNT1YgQkwsIDEwIC8gQUREIEFMLCBCTC4gRmxhZ3M6IENGLCBPRiwgWkYsIFNGLCBQRiwgQUYu',
    'QUwgcGFzc2EgYSB2YWxlciAtMTI2IChpbnRlcnByZXRhw6fDo28gY29tIHNpbmFsKS4gT3ZlcmZsb3cgY29tIHNpbmFsID0gcmVzdWx0YWRvIG1hdGVtYXRpY2FtZW50ZSBpbmNvcnJldG8uIEVtIEM6IHVuZGVmaW5lZCBiZWhhdmlvciBwYXJhIHNpZ25lZCBjaGFyLg==',
    'TEVBIFJCWCwgW3RlbXBdIC8gTU9WIEFMLCBbUkJYICsgMioxXSA7IGNhcnJlZ2EgdGVtcFsyXSA9IDEyMi4gU3RyaWRlID0gMSBieXRlIChjaGFyKS4='
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
    'NTAgPSAwMDAwIDAwMDAgMDAxMSAwMDEwOyA3NSA9IDAwMDAgMDAwMCAwMTAwIDEwMTEuIHVuc2lnbmVkOiAwLTY1NTM1LCBzaWduZWQ6IC0zMjc2OCBhIDMyNzY3Lg==',
    'Q0Y9MSAoYm9ycm93OiA1MCA8IDc1KS4gU0Y9MSAoTVNCPTEsIHJlc3VsdGFkbyBpbnRlcnByZXRhZG8gY29tbyBuZWdhdGl2bykuIFJlc3VsdGFkbyA9IDY1NTExICh1bnNpZ25lZCkgb3UgLTI1IChzaWduZWQpLg==',
    'TU9WIFIwLCAjNTAgLyBNT1YgUjEsICM3NSAvIFNVQlMgUjIsIFIwLCBSMS4gTyAiUyIgZW0gU1VCUyBhdHVhbGl6YSBvIENQU1IgKE4sIFosIEMsIFYpLg==',
    'Tk9UKDc1KSA9IDExMTEgMTExMSAxMDExIDAxMDA7ICsxID0gMTExMSAxMTExIDEwMTEgMDEwMSAoLTc1KS4gNTAgKyAoLTc1KSA9IDExMTEgMTExMSAxMTEwIDAxMTEgPSAtMjUu',
    'TERSIFIxLCA9cXRkIC8gTU9WIFIyLCAjMCAvIGxvb3A6IExEUiBSMCwgW1IxLCBSMiwgTFNMICMyXSAvIEFERCBSMiwgUjIsICMxIC8gQ01QIFIyLCAjNCAvIEJMVCBsb29wLg=='
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
    'MHhERUFEID0gNTcwMDUgZGVjaW1hbC4gQmluw6FyaW8gMTYgYml0czogMTEwMSAxMTEwIDEwMTAgMTEwMS4=',
    'WkY9MSAocmVzdWx0YWRvIHplcm8pLiBSSVNDLVYgdXNhIEJFUSBhMCwgYTEsIGxhYmVsIOKAlCBjb21wYXJhIGRvaXMgcmVnaXN0cmFkb3JlcyBkaXJldGFtZW50ZS4=',
    'TEkgYTAsIDB4REVBRCAvIExJIGExLCAweERFQUQgLyBCRVEgYTAsIGExLCAuaWd1YWwuIFNlbSBDTVAgcG9ycXVlIFJJU0MtViDDqSBSSVNDIHB1cm86IGJyYW5jaCBqw6EgY29tcGFyYS4=',
    'eDg2OiBDTVAgYXR1YWxpemEgUkZMQUdTLCBKRSBsw6ogWkYuIFJJU0MtVjogQkVRIGNvbXBhcmEgZSBzYWx0YSBlbSAxIGluc3RydcOnw6NvLCBzZW0gcmVnaXN0cmFkb3IgZGUgZmxhZ3Mu',
    'TEkgdDIsIDB4REVBRCAvIExJIHQzLCAwIC8gbG9vcDogTFcgdDAsIDAoYTApIC8gQkVRIHQwLCB0MiwgLmFjaG91IC8gQURESSBhMCwgYTAsIDQgLyBBRERJIHQzLCB0MywgMSAvIExJIHQ0LCA0IC8gQkxUIHQzLCB0NCwgbG9vcC4='
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
    'MTUgPSAweDAwMDAwMDBGLCA4ID0gMHgwMDAwMDAwOC4gUmVzdWx0YWRvID0gMTIwID0gMHgwMDAwMDA3OC4=',
    'SEkgPSBwYXJ0ZSBhbHRhIGRvIHByb2R1dG8gKGJpdHMgNjMtMzIpLiBMTyA9IHBhcnRlIGJhaXhhIChiaXRzIDMxLTApLiBQYXJhIHJlc3VsdGFkb3MgcXVlIGNhYmVtIGVtIDMyIGJpdHMsIHPDsyBMTyBpbXBvcnRhLg==',
    'TEkgJHQwLCAxNSAvIExJICR0MSwgOCAvIE1VTFQgJHQwLCAkdDEgLyBOT1AgKGRlbGF5IHNsb3QpIC8gTUZMTyAkdDIuIERlbGF5IHNsb3Q6IGluc3RydcOnw6NvIGFww7NzIE1VTFQgc2VtcHJlIGV4ZWN1dGEgYW50ZXMgZG8gcmVzdWx0YWRvIHNlciBkaXNwb27DrXZlbC4=',
    'TUlQUyDDqSBSSVNDIOKAlCBzZW0gRUZMQUdTLiBPdmVyZmxvdyBlbSBNVUxUOiB2ZXJpZmljYXIgc2UgSEkg4omgIDAgKHJlc3VsdGFkbyBtYWlvciBxdWUgMzIgYml0cyku',
    'U0xMICR0NCwgJHQzLCAxIC8gU0xMICR0NSwgJHQ0LCAyIC8gQUREVSAkdDYsICRhMCwgJHQ1IC8gTFcgJHQwLCAwKCR0NikgLyBMVyAkdDEsIDQoJHQ2KSAvIE1VTFQgJHQwLCAkdDEgLyBNRkxPICR2MC4='
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
    'NDIgPSAwMDEwIDEwMTAuIE5PVCA9IDExMDEgMDEwMS4gKzEgPSAxMTAxIDAxMTAgPSAtNDIgZW0gOCBiaXRzLg==',
    'U0VYVCByZXBsaWNhIG8gTVNCIChiaXQgNyA9IDEpIG5vcyA1NiBiaXRzIHN1cGVyaW9yZXM6IDExMTEuLi4xMTExIDExMDEgMDExMC4gNTYgYml0cyAxIHJlcGxpY2Fkb3MgKyA4IGJpdHMgb3JpZ2luYWlzLg==',
    'U1hUQiBYMCwgVzEuIFNYVEI6IFgwID0gLTQyIChzaWduIGV4dGVuZCkuIFVYVEI6IFgwID0gMjE0ICh6ZXJvIGV4dGVuZCwgaW50ZXJwcmV0YSBjb21vIHVuc2lnbmVkKS4=',
    'U0VYVCBwcmVzZXJ2YSBvIHZhbG9yIG51bcOpcmljbyBjb20gc2luYWwuIFpFWFQgZGUgLTQyIGRhcmlhIDIxNCwgaW50ZXJwcmV0YcOnw6NvIGVycmFkYSBwYXJhIGFyaXRtw6l0aWNhIGRlIHBvbnRlaXJvcy4=',
    'TERSQiBXMCwgW1gxLCAjMV0gLyBTWFRCIFgwLCBXMCA7IC0xIC8gTERSQiBXMSwgW1gxLCAjMl0gLyBTWFRCIFgxLCBXMSA7ICsxMjcgLyBBREQgWDAsIFgwLCBYMSA7IHJlc3VsdGFkbyA9IDEyNi4='
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
    'MHg4QSA9IDEwMDAgMTAxMC4gQml0cyBhdGl2b3M6IDEgKGJpdCAxKSwgMyAoYml0IDMpLCA3IChiaXQgNyku',
    'MTAwMCAxMDEwIEFORCAwMDAwIDEwMDAgPSAwMDAwIDEwMDAgPSA4IOKJoCAwLiBCaXQgU1lOIGVzdMOhIEFUSVZPLg==',
    'VEVTVCBFQVgsIDB4MDggKHZlcmlmaWNhIFNZTikgLyBBTkQgRUFYLCAweDdGIChsaW1wYSBiaXQgNzogTk9UKDB4ODApPTB4N0YpIC8gT1IgRUFYLCAweDA0IChhdGl2YSBiaXQgMiku',
    'QU5EL09SOiBaRj0xIHNlIHJlc3VsdGFkbz0wLCBTRj0xIHNlIE1TQj0xLiBDRj1PRj0wIHNlbXByZSAob3BlcmHDp8O1ZXMgbMOzZ2ljYXMgbnVuY2EgZ2VyYW0gY2Fycnkvb3ZlcmZsb3cpLg==',
    'WE9SIFJDWCwgUkNYIC8gTU9WIFJTSSwgZmxhZ3MgLyBNT1YgUjgsIDggLyBsb29wOiBNT1YgRUFYLCBbUlNJXSAvIFRFU1QgRUFYLCAweDA4IC8gSlogLnNraXAgLyBJTkMgUkNYIC8gLnNraXA6IEFERCBSU0ksIDQgLyBERUMgUjggLyBKTlogbG9vcC4='
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
    'MTMgPSAwMDAwIDExMDEuIExTTCAjMiA9IDAwMTEgMDEwMCA9IDUyLiBFcXVpdmFsZSBhIDEzIMOXIDQu',
    'TFNSICMxOiAwMDAwIDAxMTAgPSA2LiBBU1IgIzE6IGlndWFsIHBhcmEgcG9zaXRpdm9zIChyZXBsaWNhIG8gMCkuIERpZmVyZW7Dp2EgYXBhcmVjZSBlbSBuZWdhdGl2b3M6IEFTUiByZXBsaWNhIGJpdCBkZSBzaW5hbC4=',
    'TU9WIFIwLCAjMTMgLyBMU0wgUjEsIFIwLCAjMiAvIExTUiBSMiwgUjAsICMxLiBMU0wgw6kgMSBjaWNsbywgTVVMIHBvZGUgc2VyIG11bHRpLWNpY2xvIGVtIEFSTSBzaW1wbGVzLg==',
    'MTMgPSAwMDAwIDExMDEuIDEzIDw8IDI4OiBvIGJpdCAzICg9MSkgZXZlbnR1YWxtZW50ZSDDqSBkZXNsb2NhZG8gcGFyYSBmb3JhIOKAlCBDRj0xIHF1YW5kbyBpc3NvIG9jb3JyZS4=',
    'TERSIFIxLCA9YW1vc3RyYXMgLyBNT1YgUjIsICMwIC8gbG9vcDogTERSIFIwLCBbUjEsIFIyLCBMU0wgIzJdIC8gTFNMIFIwLCBSMCwgIzIgLyBTVFIgUjAsIFtSMSwgUjIsIExTTCAjMl0gLyBBREQgUjIsICMxIC8gQ01QIFIyLCAjOCAvIEJMVCBsb29wLg=='
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
    'OSA9IDEwMDEsIDcgPSAwMTExLiA5Kzc9MTYgPSAxMDAwMCDigJQgbsOjbyBjYWJlIGVtIDQgYml0cyAoY2Fycnktb3V0ID0gMSku',
    'Qml0MDogQT0xLEI9MSxDaW49MCwgWE9SMT0wLCBTPTAsIEFORDE9MSwgQU5EMj0wLCBDb3V0PTEuIEJpdDE6IEE9MCxCPTEsQ2luPTEsIFhPUjE9MSwgUz0wLCBBTkQxPTAsIEFORDI9MSwgQ291dD0xLiBCaXQyOiBBPTAsQj0xLENpbj0xLCBYT1IxPTEsIFM9MCwgQ291dD0xLiBCaXQzOiBBPTEsQj0wLENpbj0xLCBYT1IxPTEsIFM9MCwgQ291dD0xLg==',
    'Qml0MzogWE9SMT0xKHNhw61kYT0xKSwgQU5EMj0xKHNhw61kYT0xKSwgT1I9MShzYcOtZGE9MSkuIENhcnJ5LW91dCBmaW5hbCA9IDEu',
    'TEkgYTAsIDkgLyBMSSBhMSwgNyAvIEFERCBhMiwgYTAsIGExLiBBcMOzczogYTA9OSwgYTE9NywgYTI9MTYu',
    'TEkgdDAsIDAgLyBsb29wOiBMVyB0MSwgMChhMCkgLyBMVyB0MiwgMChhMSkgLyBBREQgdDMsIHQxLCB0MiAvIFNXIHQzLCAwKGEyKSAvIEFEREkgYTAsYTAsNCAvIEFEREkgYTEsYTEsNCAvIEFEREkgYTIsYTIsNCAvIEFEREkgdDAsdDAsMSAvIExJIHQ0LDQgLyBCTFQgdDAsdDQsbG9vcC4='
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
    'QT0weEI0PTE4MGRlYz0xMDExIDAxMDAuIEI9MHg0Qz03NmRlYz0wMTAwIDExMDAuIFM9MjU2PTB4MTAw4oaSd3JhcC1hcm91bmQ9MHgwMC4gQ0Y9MShvdmVyZmxvdyB1bnNpZ25lZCksIFpGPTEocmVzdWx0YWRvPTApLg==',
    'QT0xMDExMDEwMDogVDA9SElHSCgxKSwgVDE9TE9XKDApLCBUMj1ISUdIKDEpLCBUMz1ISUdIKDEpLCBUND1MT1coMCksIFQ1PUhJR0goMSksIFQ2PUxPVygwKSwgVDc9TE9XKDApLg==',
    'Uz0weDAwLCBNU0IoVDApPUxPVygwVikuIFNGPTAg4oCUIHJlc3VsdGFkbyB6ZXJvLCBuw6NvIG5lZ2F0aXZvLiBNYXMgQ0Y9MSBpbmRpY2EgZXN0b3VybyB1bnNpZ25lZC4=',
    'QWJhaXhvIGRlIDAuOFY9TE9XIGNlcnRvLiBBY2ltYSBkZSAyVj1ISUdIIGNlcnRvLiBFbnRyZSAwLjhWLTJWID0gem9uYSBwcm9pYmlkYS4gMS4yLTEuOFYgPSBpbmRldGVybWluYWRvLCBnbGl0Y2gsIG1ldGFlc3RhYmlsaWRhZGUu',
    'MHhCND1ISUdILCAweDRDPUxPVywgMHhGRj1ISUdILCAweDAwPUxPVywgMHg4MD1ISUdILCAweDdGPUxPVywgMHhBQT1ISUdILCAweDU1PUxPVy4gU2VxdcOqbmNpYTogSCBMIEggTCBIIEwgSCBMLg=='
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
    'cj0xMTExIDExMTEsIGc9MTAwMCAwMDAwLCBiPTAxMDAgMDAwMC4gTVNCczogcj0xLCBnPTEsIGI9MC4gQ29tbyB1bnNpZ25lZDogWkVYVCAobsOjbyBTRVhUKS4=',
    'U0VYVCBkZSAweEZGID0gMHhGRkZGRkZGRiA9IC0xIGRlY2ltYWwuIEVycmFkbyDigJQgcGl4ZWwgMjU1IGRldmUgc2VyICsyNTUsIG7Do28gLTEu',
    'TEJVICR0MCwgciAvIExCVSAkdDEsIGcgLyBMQlUgJHQyLCBiIC8gQUREVSAkdDMsICR0MCwgJHQxIC8gQUREVSAkdDMsICR0MywgJHQyIC8gTEkgJHQ0LCAzIC8gRElWICR0MywgJHQ0IC8gTUZMTyAkdjAu',
    'MTExMSAxMTExICsgMTAwMCAwMDAwID0gMDExMSAxMTExIGNvbSBDRj0xLiBFbSA4IGJpdHMgYmxlbmQgc2F0dXJhdGlvbjogY2xpcCBhIDI1NSBvdSB1c2EgMTYgYml0cy4=',
    'TEJVICR0MCwgMCgkYTApIC8gTEJVICR0MSwgMSgkYTApIC8gTEJVICR0MiwgMigkYTApIC8gQUREVSAkdDMsJHQwLCR0MSAvIEFERFUgJHQzLCR0MywkdDIgLyBMSSAkdDQsMyAvIERJViAkdDMsJHQ0IC8gTUZMTyAkdjAu'
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
    'TUFYIHVpbnQzMiA9IDQuMjk0Ljk2Ny4yOTUuIDNCICsgMkIgPSA1QiA+IDQuMjlCLiBXcmFwLWFyb3VuZDogNS4wMDAuMDAwLjAwMCAtIDQuMjk0Ljk2Ny4yOTYgPSA3MDUuMDMyLjcwNC4=',
    'M0I9MHhCMkQwNUUwMCwgMkI9MHg3NzM1OTQwMC4gU29tYT0weDEyQTA1RjIwMOKGknRydW5jYSBwYXJhIDB4MkEwNUYyMDAuIENGPTEob3ZlcmZsb3cgdW5zaWduZWQpLiBPRiBkZXBlbmRlIGRlIGludGVycHJldGHDp8OjbyBzaWduZWQu',
    'TU9WIFcwLCAjLi4uIC8gTU9WIFcxLCAjLi4uIC8gQUREIFcyLCBXMCwgVzEuIFc9MzIgYml0cywgdHJ1bmNhIGF1dG9tYXRpY2FtZW50ZS4gdW5zaWduZWQgaW50IMOpIDMyIGJpdHMu',
    'Q29tIFgwL1gxICg2NCBiaXRzKTogNS4wMDAuMDAwLjAwMCBjYWJlIHBlcmZlaXRhbWVudGUsIHNlbSBvdmVyZmxvdy4gVXNhciBvIHRpcG8gY29ycmV0byDDqSBmdW5kYW1lbnRhbC4=',
    'TERSIFgxLFtYMF0gLyBMRFIgWDIsW1gwLCM0XSAvIFVYVFcgWDIsVzIgLyBBREQgWDEsWDEsWDIgLyBMRFIgWDMsW1gwLCM4XSAvIFVYVFcgWDMsVzMgLyBBREQgWDEsWDEsWDMgLyBMRFIgWDQsW1gwLCMxMl0gLyBVWFRXIFg0LFc0IC8gQUREIFgwLFgxLFg0Lg=='
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
    'MTAxMTAxMDE6IGJpdHMgMSBuYXMgcG9zacOnw7VlcyAwLDIsNCw1LDcgPSA1IGJpdHMuIE7Dum1lcm8gw41NUEFSIOKGkiBQRj0wIChQRj0xIHNvbWVudGUgc2UgcGFyKS4=',
    'UEYgaW5kaWNhIHBhcmlkYWRlIGRvIGJ5dGUgYmFpeG8gZG8gcmVzdWx0YWRvLiBVc2FkbyBlbSBjb211bmljYcOnw6NvIHNlcmlhbCAoUlMtMjMyKSBlIG1lbcOzcmlhcyBFQ0MuIFJhcm8gaG9qZSBlbSBzb2Z0d2FyZS4=',
    'TU9WIEFMLCAwYjEwMTEwMTAxIC8gQUREIEFMLCAwIC8gSlBFIC5wYXJpZGFkZV9wYXIgLyBKUE8gLnBhcmlkYWRlX2ltcGFyLg==',
    'MGIxMDExMDExMTogYml0cyAxID0gMCwxLDIsNCw1LDcgPSA2IGJpdHMuIFBhciDihpIgUEY9MS4gU2ltLCBQRiBtdWRhIOKAlCBkZXRlY8Onw6NvIGRlIGVycm8gZGUgMSBiaXQgZnVuY2lvbmEu',
    'WE9SIFJDWCxSQ1ggLyBNT1YgUlNJLGJ5dGVzIC8gTU9WIFI4LDggLyBsb29wOiBNT1YgQUwsW1JTSV0gLyBBREQgQUwsMCAvIEpQRSAuc2tpcCAvIElOQyBSQ1ggLyAuc2tpcDogSU5DIFJTSSAvIERFQyBSOCAvIEpOWiBsb29wLg=='
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
    'NDI9MHgwMDAwMDAyQSwgMTc9MHgwMDAwMDAxMS4gNDItMTc9MjUsIENGPTAoc2VtIGJvcnJvdyksIE9GPTAoc2VtIG92ZXJmbG93KS4gUmVzdWx0YWRvPTI1Lg==',
    'QkxFIHQwLHQxLC5uYW9fdHJvY2Egb3UgdXNhciBCR1QgdDAsdDEsLnRyb2NhciDigJQgQkdUIGNvbXBhcmEgZGlyZXRhbWVudGUgdDA+dDEu',
    'TFcgdDAsMChhMCkgLyBMVyB0MSw0KGEwKSAvIEJHVCB0MCx0MSwuc3dhcCAvIEogLmZpbSAvIC5zd2FwOiBTVyB0MSwwKGEwKSAvIFNXIHQwLDQoYTApIC8gLmZpbS4=',
    'UklTQy1WOiB+NiBpbnN0cnXDp8O1ZXMuIHg4NjogfjQgY29tIENNT1YuIFJJU0MtViDDqSBlZmljaWVudGUgcG9ycXVlIHRvZGFzIHPDo28gMzIgYml0cyBmaXhvcywgcGlwZWxpbmUgc2ltcGxlcy4=',
    'TEkgdDIsMCAvIGxvb3A6IExXIHQwLDAoYTApIC8gTFcgdDEsNChhMCkgLyBCTEUgdDAsdDEsLnNraXAgLyBTVyB0MSwwKGEwKSAvIFNXIHQwLDQoYTApIC8gLnNraXA6IEFEREkgYTAsYTAsNCAvIEFEREkgdDIsdDIsMSAvIExJIHQzLDMgLyBCTFQgdDIsdDMsbG9vcC4='
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
    'Mzc9MHgyNT0wMDAwLi4uMDAxMCAwMTAxLiBOT1Q9MTExMS4uLjExMDEgMTAxMC4gKzE9MTExMS4uLjExMDEgMTAxMSA9IDB4RkZGRkZGREIgPSAtMzcu',
    'Q01QIFIwLCMwOiBOPTEobmVnYXRpdm8pLCBaPTAsIEM9MCwgVj0wLiBOPTEgaW5kaWNhIHJlc3VsdGFkbyBuZWdhdGl2by4=',
    'Q01QIFIwLCAjMCAvIFJTQkxUIFIwLCBSMCwgIzAgOyBpZihSMDwwKSBSMCA9IDAgLSBSMC4gQXBlbmFzIDIgaW5zdHJ1w6fDtWVzLCBzZW0gYnJhbmNoIQ==',
    'eDg2OiBDTVAgRUFYLDAgLyBKR0UgLnBvcyAvIE5FRyBFQVggLyAucG9zOiDigJQgMyBpbnN0cnXDp8O1ZXMgKyAxIGJyYW5jaC4gQVJNIHVzYSAyIGluc3RydcOnw7VlcyBzZW0gYnJhbmNoLg==',
    'TERSIFIxLD12YWxvcmVzIC8gTU9WIFIyLCMwIC8gbG9vcDogTERSIFIwLFtSMSxSMixMU0wjMl0gLyBDTVAgUjAsIzAgLyBSU0JMVCBSMCxSMCwjMCAvIFNUUiBSMCxbUjEsUjIsTFNMIzJdIC8gQUREIFIyLCMxIC8gQ01QIFIyLCM4IC8gQkxUIGxvb3Au'
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
    'TUFYPTB4RkZGRkZGRkY9NDI5NDk2NzI5NS4gNDI5NDk2NzI5MCsxMD00Mjk0OTY3MzAwLiBXcmFwOiA0Mjk0OTY3MzAwLTQyOTQ5NjcyOTY9NC4gTm92byB2YWxvcj00Lg==',
    'NDI5NDk2NzI5MD0weEZGRkZGRkZBLiBCeXRlIGJhaXhvPTB4RkE9MTExMSAxMDEwLiBCaXRzIDE6IHBvc2nDp8O1ZXMgMSwzLDQsNSw2LDcgPSA2IGJpdHMg4oaSIHBhciDihpIgUEY9MS4=',
    'TU9WIEVBWCxbY29udGFkb3JdIC8gTU9WIEVCWCxbcGFjb3Rlc10gLyBBREQgRUFYLEVCWC4gQ0Y9MSBhcMOzcyB3cmFwLWFyb3VuZC4gSkMgLnJvbGxvdmVyIGRldGVjdGEu',
    'QyBwYWRyw6NvOiB1bnNpZ25lZCBvdmVyZmxvdyDDqSBtw7NkdWxvIDJeTiDigJQgY29tcG9ydGFtZW50byBkZWZpbmlkby4gU2lnbmVkIG92ZXJmbG93IMOpIFVCIHBvaXMgY29tcGlsYWRvciBwb2RlIGFzc3VtaXIgcXVlIG7Do28gb2NvcnJlLg==',
    'WE9SIFI5LFI5IC8gTU9WIFJTSSxjb250YWRvcmVzIC8gTU9WIFJDWCw0IC8gbG9vcDogTU9WIEVBWCxbUlNJXSAvIEFERCBFQVgsMTAgLyBNT1YgW1JTSV0sRUFYIC8gSk5DIC5za2lwIC8gSU5DIFI5IC8gLnNraXA6IEFERCBSU0ksNCAvIERFQyBSQ1ggLyBKTlogbG9vcC4='
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
    'SU5UMzIgbWF4ID0gMjE0NzQ4MzY0NyDiiYggMi4xQi4gVU5JWCB0aW1lc3RhbXAgMjAyNCA+IDEuN1Qg4oCUIG7Do28gY2FiZS4gTE9ORyBMT05HIG1heCA9IDkuMiDDlyAxMF4xOC4=',
    'ODY0MDAwMDAgPSAweDA1MjRGODAwIOKAlCBjYWJlIGVtIDMyIGJpdHMgKDwgMHhGRkZGRkZGRikuIE7Do28gY2FiZSBlbSAxNiBiaXRzIChtYXggNjU1MzUpLg==',
    'TU9WIFgwLCAjMHhGODAwIC8gTU9WSyBYMCwgIzB4NTI0LCBMU0wgIzE2IC8gKG1haXMgTU9WSyBwYXJhIGJpdHMgYWx0b3MpLiBBUk02NCBNT1Ygw6kgMTYgYml0cyBwb3IgdmV6LCBNT1ZLICJtb3ZlIHdpdGgga2VlcCIgcHJlc2VydmEgb3Mgb3V0cm9zIGJpdHMu',
    'dHMxK3RzMiDiiYggMS43VCs4Nk06IHJlc3VsdGFkbyBwb3NpdGl2byBwZXF1ZW5vIHZzIG1heC4gTj0wKHBvc2l0aXZvKSwgWj0wLCBDPTAoc2VtIG92ZXJmbG93IDY0YiksIFY9MC4gTmVuaHVtIGZsYWcgYXRpdmFkby4=',
    'TU9WIFgyLCAjODY0MDAwMDAgLyBNT1YgWDMsICMwIC8gbG9vcDogTERSIFgwLCBbWDEsIFgzLCBMU0wgIzNdIC8gQUREIFgwLCBYMCwgWDIgLyBTVFIgWDAsIFtYMSwgWDMsIExTTCAjM10gLyBBREQgWDMsIFgzLCAjMSAvIENNUCBYMywgIzQgLyBCTFQgbG9vcC4='
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
    'OTk9MHg2Mz0wMTEwIDAwMTEsIDIyPTB4MTY9MDAwMSAwMTEwLiA5OS0yMj03Nz4wLiBDRj0wKHNlbSBib3Jyb3cpLCBTRj0wKHBvc2l0aXZvKS4=',
    'QkVRICR0MCwkdDEsaWd1YWwg4oCUIGNvbXBhcmEgZGlyZXRhbWVudGUuIEFsdGVybmF0aXZhOiBTVUJVICR0MiwkdDAsJHQxIC8gQkVRICR0MiwkemVybyxpZ3VhbC4=',
    'TEkgJHQwLDAgLyBMSSAkdjAsLTEgLyBMQSAkdDEsdiAvIGxvb3A6IExXICR0MiwwKCR0MSkgLyBCRVEgJHQyLCRhMCwuYWNoYSAvIE5PUCAvIEFEREkgJHQxLCR0MSw0IC8gQURESSAkdDAsJHQwLDEgLyBTTFRJICR0MywkdDAsNSAvIEJORSAkdDMsJHplcm8sbG9vcCAvIE5PUCAvIEogLmZpbSAvIC5hY2hhOiBNT1ZFICR2MCwkdDAgLyAuZmltLg==',
    'Tk9QIGFww7NzIEJFUSBlIEJORSDigJQgaW5zdHJ1w6fDo28gc2VndWludGUgYW8gYnJhbmNoIGV4ZWN1dGEgc2VtcHJlLiBTZW0gTk9QIG8gcHLDs3hpbW8gTFcgZXhlY3V0YXJpYSBhbnRlcyBkbyBicmFuY2ggc2VyIHJlc29sdmlkby4=',
    'TG9vcCBpZ3VhbCBtYXMgbsOjbyB1c2EgYnJlYWsuIFF1YW5kbyBlbmNvbnRyYTogTU9WRSAkdjAsJHQwIGUgY29udGludWEgbyBsb29wLiBBbyBmaW5hbCAkdjAgdGVtIGEgw7psdGltYSBwb3Npw6fDo28u'
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
    'MjAwPTB4QzgsIDIzNz0weEVELiBOT1QoMjM3KSsxPTB4RkZGRkZGMTMgKC0yMzcpLiAyMDArKC0yMzcpPTB4RkZGRkZGREI9LTM3LiBTRj0xKG5lZ2F0aXZvKSwgQ0Y9MChzZW0gYm9ycm93IGVtIHNpZ25lZCku',
    'TkVHIEVBWCA9IFNVQiAwLEVBWCA9IGNvbXBsZW1lbnRvIGRlIDIuIE5FRygtMzcpID0gMHgyNSA9IDM3Lg==',
    'TU9WIEVBWCwyMDAgLyBNT1YgRUJYLDIzNyAvIFNVQiBFQVgsRUJYIC8gSk5TIC5wb3MgLyBORUcgRUFYIC8gLnBvczogTU9WIFthYnNfZGlmZl0sRUFYLg==',
    'Qml0MzEgZGUgMjAwOiAwLiBCaXQzMSBkZSBOT1QoMjM3KTogMS4gQ2luIChjYXJyeSk6IGRlcGVuZGUgZG9zIGJpdHMgaW5mZXJpb3Jlcy4gQ2Fycnktb3V0IGJpdDMxPTDihpJDRj0wIGNvbmZpcm1hZG8u',
    'WE9SIFJDWCxSQ1ggLyBsb29wOiBNT1YgRUFYLFtSU0krUkNYKjRdIC8gU1VCIEVBWCxbUkRJK1JDWCo0XSAvIEpOUyAucG9zIC8gTkVHIEVBWCAvIC5wb3M6IE1PViBbUkRYK1JDWCo0XSxFQVggLyBJTkMgUkNYIC8gQ01QIFJDWCw4IC8gSkwgbG9vcC4='
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
    'MHhGRjgwNDBDMCA9IDExMTEgMTExMSAxMDAwIDAwMDAgMDEwMCAwMDAwIDExMDAgMDAwMC4gQT0weEZGPTI1NSwgUj0weDgwPTEyOCwgRz0weDQwPTY0LCBCPTB4QzA9MTkyLg==',
    'QWxwaGE6IFNSTEkgdDAsYTAsMjQgLyBBTkRJIHQwLHQwLDB4RkYuIFI6IFNSTEkgdDEsYTAsMTYgLyBBTkRJIHQxLHQxLDB4RkYuIEc6IFNSTEkgdDIsYTAsOCAvIEFOREkgdDIsdDIsMHhGRi4gQjogQU5ESSB0MyxhMCwweEZGLg==',
    'TFcgYTAsIGNvciAvIFNSTEkgdDAsYTAsMjQgLyBBTkRJIHQwLHQwLDI1NSAvIFNSTEkgdDEsYTAsMTYgLyBBTkRJIHQxLHQxLDI1NSAvIFNSTEkgdDIsYTAsOCAvIEFOREkgdDIsdDIsMjU1IC8gQU5ESSB0MyxhMCwyNTUu',
    'U0xMSSB0MV9zLHQxLDE2IC8gU0xMSSB0Ml9zLHQyLDggLyBTTExJIHQwX3MsdDAsMjQgLyBPUiByZXMsdDBfcyx0MV9zIC8gT1IgcmVzLHJlcyx0Ml9zIC8gT1IgcmVzLHJlcyx0My4=',
    'TG9vcDogTFcgdDAsMChhMCkgLyBBTkRJIHQxLHQwLDB4RkYgKEIpIC8gU1JMSSB0Mix0MCwxNiAvIEFOREkgdDIsdDIsMHhGRiAoUikgLyBTTExJIHQxcyx0MSwxNiAvIE9SIHQwLHQwLHQxcyAvIEFORCB0MCx0MCwweEZGMDBGRkZGX21hc2sgLyBTTExJIHQycyx0MiwwIC8gT1IgdDAsdDAsdDJzIC8gU1cgdDAsMChhMCkgLyBBRERJIGEwLGEwLDQu'
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
    'LTMyNzY4PTEwMDAgMDAwMCAwMDAwIDAwMDAgKHPDsyBiaXQgMTUgPSAxKS4gMzI3Njc9MDExMSAxMTExIDExMTEgMTExMS4gU2ltIOKAlCBleHRyZW1vcyBkbyBzaWduZWQgc2hvcnQu',
    'LTMyNzY4w5czPS05ODMwNC4gTsOjbyBjYWJlIGVtIDE2IGJpdHMgKG1heD0tMzI3NjgpLiBDYWJlIGVtIDMyIGJpdHMuIEVtIDE2IGJpdHM6IE9GPTEob3ZlcmZsb3cgc2lnbmVkKS4=',
    'TU9WU1ggRUFYLCBXT1JEIFBUUltSREldIC8gSU1VTCBFQVgsIDMgLyBTQVIgRUFYLCAyIC8gTU9WIFdPUkQgUFRSW1JESV0sIEFYLg==',
    'U0FSIHJlcGxpY2EgbyBiaXQgZGUgc2luYWw6IC00IFNBUiAxID0gLTIgKGNvcnJldG8pLiBTSFIgZGUgLTQgZGFyaWEgdW0gbsO6bWVybyBwb3NpdGl2byBlbm9ybWUgKGluY29ycmV0byBwYXJhIMOhdWRpbyku',
    'WE9SIFJDWCxSQ1ggLyBsb29wOiBNT1ZTWCBFQVgsV09SRCBQVFJbUlNJK1JDWCoyXSAvIElNVUwgRUFYLDMgLyBTQVIgRUFYLDIgLyBNT1YgV09SRCBQVFJbUlNJK1JDWCoyXSxBWCAvIElOQyBSQ1ggLyBDTVAgUkNYLDggLyBKTCBsb29wLg=='
  ],
  },
]
