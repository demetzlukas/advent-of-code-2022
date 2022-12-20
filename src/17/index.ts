import { readFileFromInput } from '../utils/readFile';

const filename = './input/17.txt';
let maxHeight = 0;

export async function main() {
  const input = (await readFileFromInput(filename)).split('');
  const rocks: [number, number][][] = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  ];

  const chamber = new Set<string>([
    '0x1',
    '0x2',
    '0x3',
    '0x4',
    '0x5',
    '0x6',
    '0x7',
  ]);

  let numberOfRocks = 0;
  let oldHeight = 0;

  while (numberOfRocks++ < 1000000000000) {
    const rock = rocks.shift();
    rocks.push(rock);
    placeRock(rock, chamber, input);
    if (numberOfRocks === 2022) {
      console.log('Part 1:', maxHeight);
    }
    if (numberOfRocks === 2666) {
      oldHeight = maxHeight;
      numberOfRocks = 999999999066;
    }
  }

  console.log('Part 2:', 1489 + 588235293 * 2654 + (maxHeight - oldHeight));
}

function placeRock(
  rock: [number, number][],
  chamber: Set<string>,
  input: string[]
) {
  const startLeft = 3;
  rock = rock.map(([x, y]) => [x + maxHeight + 4, y + startLeft]);

  while (true) {
    const direction = input.shift();
    input.push(direction);
    let next = moveWithStream(direction, rock);

    if (isValid(next, chamber)) {
      rock = next;
    }

    next = moveDown(rock);

    if (isValid(next, chamber)) {
      rock = next;
    } else {
      break;
    }
  }
  for (const [x, y] of rock) {
    chamber.add(`${x}x${y}`);
  }

  maxHeight = Math.max(maxHeight, Math.max(...rock.map(([x]) => x)));
}

function printLayout(chamber: Set<string>) {
  for (let i = maxHeight; i > 0; i--) {
    const line = [];

    line.push('|');
    for (let j = 1; j < 8; j++) {
      if (chamber.has(`${i}x${j}`)) {
        line.push('#');
      } else line.push('.');
    }
    line.push('|');
    console.log(line.join(''));
  }
  console.log('+-------+');
}

function moveWithStream(
  direction: string,
  rock: [number, number][]
): [number, number][] {
  const dy = direction === '>' ? 1 : -1;
  return rock.map(([x, y]) => [x, y + dy]);
}

function moveDown(rock: [number, number][]): [number, number][] {
  return rock.map(([x, y]) => [x - 1, y]);
}

function isValid(rock: [number, number][], chamber: Set<string>): boolean {
  for (const [x, y] of rock) {
    if (y === 0 || y === 8 || chamber.has(`${x}x${y}`)) {
      return false;
    }
  }
  return true;
}
