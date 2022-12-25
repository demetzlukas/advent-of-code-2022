import { readLinesFromInput } from '../utils/readFile';

const filename = './input/25.txt';

export async function main() {
  const input = await readLinesFromInput(filename);

  const sum = input.map((line) => SNAFUToDecimal(line)).reduce((a, b) => a + b);
  console.log('Part 1:', decimalToSNAFU(sum));
}

function SNAFUToDecimal(numberString: string): number {
  let decimalNumber = 0;
  numberString = numberString.split('').reverse().join('');

  for (let index = 0; index < numberString.length; index++) {
    const number = numberString[index];
    let numberValue = 0;
    if ('012'.includes(number)) {
      numberValue = Number(number);
    } else {
      numberValue = number === '-' ? -1 : -2;
    }
    decimalNumber += numberValue * Math.pow(5, index);
  }

  return decimalNumber;
}

function decimalToSNAFU(number: number): string {
  let result = '';

  let carry = 0;
  while (number > 0) {
    const remainder = number % 5;
    carry = 0;
    if (remainder < 3) {
      result = remainder + result;
    } else {
      result = (remainder === 3 ? '=' : '-') + result;
      carry = 1;
    }

    number = Math.floor(number / 5) + carry;
  }

  return result;
}
