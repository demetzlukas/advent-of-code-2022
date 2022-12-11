import { readFileFromInput } from '../utils/readFile';
import { cloneDeep } from 'lodash';

type Monkey = {
  items: number[];
  operation: string[];
  inspections: number;
  divValue: number;
  monkeyIfTrue: number;
  monkeyIfFalse: number;
};

const operations = {
  '+': (a: number, b: number) => a + b,
  '*': (a: number, b: number) => a * b,
};

const filename = './input/11.txt';

export async function main() {
  const input = (await readFileFromInput(filename))
    .split('\r\n\r\n')
    .map((block) => block.split('\r\n'));

  const monkeys = getMonkeys(input);
  const monkeysPartOne = cloneDeep(monkeys);
  let round = 0;

  while (round++ < 20) {
    playRound(monkeysPartOne);
  }

  let sorted = monkeysPartOne
    .map((monkey) => monkey.inspections)
    .sort((a, b) => b - a);

  console.log('Part 1:', sorted[0] * sorted[1]);

  const monkeysPartTwo = cloneDeep(monkeys);
  round = 0;

  while (round++ < 10000) {
    playRound(monkeysPartTwo, false);
  }

  sorted = monkeysPartTwo
    .map((monkey) => monkey.inspections)
    .sort((a, b) => b - a);

  console.log('Part 2:', sorted[0] * sorted[1]);
}

function getMonkeys(lines: string[][]): Monkey[] {
  const monkeys: Monkey[] = [];
  lines.forEach(([_, items, operation, divValue, ifTrue, ifFalse]) => {
    const monkey: Monkey = {
      items: items.split(':')[1].trim().split(', ').map(Number),
      inspections: 0,
      operation: operation.split(':')[1].split(' = ')[1].split(' '),
      divValue: Number(divValue.trim().split(' ').pop()),
      monkeyIfTrue: Number(ifTrue.trim().split(' ').pop()),
      monkeyIfFalse: Number(ifFalse.trim().split(' ').pop()),
    };
    monkeys.push(monkey);
  });

  return monkeys;
}

function doOperation([x, op, y]: string[], old: number): number {
  const x1 = x === 'old' ? old : Number(x);
  const y1 = y === 'old' ? old : Number(y);

  return operations[op](x1, y1);
}

function playRound(monkeys: Monkey[], partOne = true) {
  const lcm = monkeys
    .map((monkey) => monkey.divValue)
    .reduce((lcm, current) => lcm * current, 1);

  for (const monkey of monkeys) {
    monkey.inspections += monkey.items.length;

    while (monkey.items.length > 0) {
      const item = monkey.items.shift();
      let newValue = doOperation(monkey.operation, item);
      newValue = partOne ? Math.floor(newValue / 3) : (newValue %= lcm);
      const toMonkey =
        newValue % monkey.divValue === 0
          ? monkey.monkeyIfTrue
          : monkey.monkeyIfFalse;
      monkeys[toMonkey].items.push(newValue);
    }
  }
}
