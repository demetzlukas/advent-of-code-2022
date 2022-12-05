import { readFileFromInput } from '../utils/readFile';
import { cloneDeep, remove } from 'lodash';
import { removeListener } from 'process';

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
    moveElements(stacks, from, to, howMany, true);
  });

  console.log(
    'Part 1:',
    stacks.map((stack) => stack[stack.length - 1]).join('')
  );

  stacks = cloneDeep(startingStacks);
  moves.forEach(([howMany, from, to]) => {
    moveElements(stacks, from, to, howMany);
  });

  console.log(
    'Part 2:',
    stacks.map((stack) => stack[stack.length - 1]).join('')
  );
}

function initStacks(layout: string[]) {
  const stacks: string[][] = Array.from({ length: 9 }, () => []);
  let stackIndex = 0;

  layout.forEach((line) => {
    for (let index = 1; index < line.length; index += 4) {
      const element = line[index];
      if (element !== ' ') {
        stacks[stackIndex].unshift(element);
      }
      stackIndex++;
    }
    stackIndex = 0;
  });

  return stacks;
}

function moveElements(
  stacks: string[][],
  from: number,
  to: number,
  howMany: number,
  reverse = false
) {
  let removed = stacks[from - 1].splice(-1 * howMany);

  if (reverse) {
    removed = removed.reverse();
  }
  stacks[to - 1].push(...removed);
}
