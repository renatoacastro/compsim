// src/pages/Sim1/exemplos.js
// Banco de exemplos organizados por linguagem.

export const EXEMPLOS = {
  Python: {
    '— selecione —': '',

    'Soma simples (CF=0, OF=0)': [
      '# Soma sem overflow — resultado cabe em 32 bits',
      'a = 25',
      'b = 7',
      'c = a + b',
      'print(c)',
    ].join('\n'),

    'Subtração negativa (CF=1, SF=1)': [
      '# a < b → resultado negativo → CF=1 (borrow) e SF=1',
      'a = 5',
      'b = 20',
      'result = a - b',
      'print(result)',
    ].join('\n'),

    'Overflow de sinal (OF=1)': [
      '# Dois positivos grandes → resultado errado com sinal',
      '# OF=1: a soma ultrapassou INT_MAX',
      'a = 2000000000',
      'b = 2000000000',
      'c = a + b',
      'print(c)',
    ].join('\n'),

    'Zero Flag (ZF=1)': [
      '# Subtração de iguais → resultado zero → ZF=1',
      'a = 42',
      'b = 42',
      'result = a - b',
      'print(result)',
    ].join('\n'),

    'Multiplicação': [
      '# Veja a diferença de instrução por ISA',
      'a = 6',
      'b = 7',
      'c = a * b',
      'print(c)',
    ].join('\n'),

    'Condicional if/else': [
      '# Gera CMP + salto condicional',
      'nota = 75',
      'if nota >= 70:',
      '    aprovado = 1',
      'else:',
      '    aprovado = 0',
      'print(aprovado)',
    ].join('\n'),

    'Overflow 8-bit (CF=1)': [
      '# 200 + 56 = 256 — estoura 8 bits',
      '# CF=1, ZF=1 (resultado = 0 após wrap-around)',
      'a = 200',
      'b = 56',
      'c = a + b',
      'print(c)',
    ].join('\n'),
  },

  C: {
    '— selecione —': '',

    'Soma int (básico)': [
      'int a = 10;',
      'int b = 20;',
      'int c = a + b;',
      'printf("%d", c);',
      'return c;',
    ].join('\n'),

    'short → int (SEXT)': [
      '// short tem 16 bits com sinal',
      '// Ao ampliar para int (32 bits): SEXT',
      'short x = 127;',
      'int y = 300;',
      'int z = x + y;',
      'return z;',
    ].join('\n'),

    'unsigned char → int (ZEXT)': [
      '// unsigned char: 8 bits SEM sinal',
      '// Ao ampliar para int: ZEXT (preenche com zeros)',
      'unsigned char u = 200;',
      'int r = u + 55;',
      'return r;',
    ].join('\n'),

    'Subtração negativa': [
      '// a < b → resultado negativo',
      'int a = 5;',
      'int b = 73;',
      'int diff = a - b;',
      'return diff;',
    ].join('\n'),

    'Overflow com sinal (OF=1)': [
      '// Dois int positivos somados > INT_MAX',
      '// OF=1: undefined behavior em C!',
      'int a = 2000000000;',
      'int b = 2000000000;',
      'int c = a + b;',
      'return c;',
    ].join('\n'),

    'if / else': [
      'int saldo = 150;',
      'int saque = 200;',
      'if (saldo >= saque) {',
      '    saldo = saldo - saque;',
      '} else {',
      '    saldo = saldo;',
      '}',
      'return saldo;',
    ].join('\n'),

    'char com sinal negativo (SEXT)': [
      '// char -1 = 0xFF (8 bits)',
      '// SEXT preenche 24 bits com 1 → 0xFFFFFFFF = -1',
      'char c = -1;',
      'int x = c;',
      'return x;',
    ].join('\n'),
  },

  Assembly: {
    '— selecione —': '',

    'ADD com flags': [
      '; Valores para demonstrar ADD e flags',
      'a = 15',
      'b = 10',
      'c = a + b',
    ].join('\n'),

    'SUB resultado negativo': [
      '; CF=1 (borrow), SF=1 (resultado negativo)',
      'a = 5',
      'b = 12',
      'c = a - b',
    ].join('\n'),

    'Zero Flag': [
      '; ZF=1 quando operandos são iguais',
      'a = 42',
      'b = 42',
      'c = a - b',
    ].join('\n'),

    'Overflow 8-bit': [
      '; 200 + 56 = 256 → CF=1 em 8 bits',
      'a = 200',
      'b = 56',
      'c = a + b',
    ].join('\n'),
  },
}
