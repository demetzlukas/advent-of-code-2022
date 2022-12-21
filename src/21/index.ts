import { readLinesFromInput } from '../utils/readFile';
import { cloneDeep } from 'lodash';

const filename = './input/21.txt';

const ops = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '/': (a: number, b: number) => a / b,
  '*': (a: number, b: number) => a * b,
};

export async function main() {
  const input = (await readLinesFromInput(filename)).map((line) =>
    line.split(': ')
  );
  const operations = new Map<string, [string, string, string]>();
  const numbers = new Map<string, number>();
  input.forEach(([name, result]) => {
    if (result.includes(' ')) {
      operations.set(name, result.split(' ') as [string, string, string]);
    } else {
      numbers.set(name, Number(result));
    }
  });

  console.log('Part 1:', part1(operations, numbers).get('root'));
  console.log('Part 2:', part2(operations, numbers));
}

function part1(
  operations: Map<string, [string, string, string]>,
  numbers: Map<string, number>
): Map<string, number> {
  operations = cloneDeep(operations);
  numbers = cloneDeep(numbers);

  while (operations.size > 0) {
    for (const [name, [x, op, y]] of operations.entries()) {
      if (numbers.has(x) && numbers.has(y)) {
        numbers.set(name, ops[op](numbers.get(x), numbers.get(y)));
        operations.delete(name);
      }
    }
  }

  return numbers;
}

function part2(
  operations: Map<string, [string, string, string]>,
  numbers: Map<string, number>
) {
  let start = 0;
  let end = 1e15;
  let middle = 0;
  while (start <= end) {
    middle = start + Math.round((end - start) / 2);
    const result = isValid(operations, numbers, middle);
    if (result === 0) return middle;
    if (result < 0) {
      end = middle - 1;
    } else {
      start = middle + 1;
    }
  }
  return -Infinity;
}

function isValid(
  operations: Map<string, [string, string, string]>,
  numbers: Map<string, number>,
  start: number
): number {
  operations = cloneDeep(operations);
  numbers = cloneDeep(numbers);
  numbers.set('humn', start);

  while (operations.size > 0) {
    for (const [name, [x, op, y]] of operations.entries()) {
      if (numbers.has(x) && numbers.has(y)) {
        if (name === 'root') {
          return numbers.get(x) - numbers.get(y);
        } else {
          numbers.set(name, ops[op](numbers.get(x), numbers.get(y)));
          operations.delete(name);
        }
      }
    }
  }
  return -1;
}
