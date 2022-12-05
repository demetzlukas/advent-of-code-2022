import { readFileFromInput } from '../utils/readFile';
import { cloneDeep } from 'lodash';

const filename = './input/5.txt';

export async function main() {
  const input = (await readFileFromInput(filename, false)).split('\r\n\r\n');
  const regex = /move (\d+) from (\d+) to (\d+)/;

  const layout = input[0].split('\r\n');
  layout.pop();
  const moves = input[1]
    .split('\r\n')
    .filter((move) => move != '')
    .map((move) => move.match(regex).slice(1).map(Number));

  const startingStacks = initStacks(layout);
  let stacks = cloneDeep(startingStacks);

  moves.forEach(([howMany, from, to]) => {
    for (let index = 0; index < howMany; index++) {
      stacks[to - 1].push(stacks[from - 1].pop());
    }
  });

  console.log(
    'Part 1:',
    stacks.map((stack) => stack[stack.length - 1]).join('')
  );

  stacks = cloneDeep(startingStacks);
  moves.forEach(([howMany, from, to]) => {
    stacks[to - 1].push(...stacks[from - 1].slice(-1 * howMany));
    stacks[from - 1] = stacks[from - 1].slice(0, -1 * howMany);
  });

  console.log(
    'Part 2:',
    stacks.map((stack) => stack[stack.length - 1]).join('')
  );
}

function initStacks(layout: string[]) {
  const stacks: string[][] = Array.from({ length: 9 }, () => []);
  let numberOfStack = 0;

  for (const line of layout) {
    for (let index = 1; index < line.length; index += 4) {
      const element = line[index];
      if (element !== ' ') {
        stacks[numberOfStack].unshift(element);
      }
      numberOfStack++;
    }
    numberOfStack = 0;
  }

  return stacks;
}
