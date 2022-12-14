import { readLinesFromInput } from '../utils/readFile';

const filename = './input/14.txt';
let lowest = -1;

export async function main() {
  const input = (await readLinesFromInput(filename)).map((line) =>
    line.split(' -> ').map((point) => point.split(',').map(Number))
  );

  let blocks = getBlocks(input);
  lowest = getLowest(blocks);

  console.log('Part 1:', getNumberOfSand(blocks));

  blocks = getBlocks(input);
  lowest += 2;
  addBottom(blocks);

  console.log('Part 2:', getNumberOfSand(blocks));
}

function addBottom(blocks: Map<string, string>) {
  const [min, max] = getHorizontalBounds(blocks);
  for (let i = min - 1000; i < max + 1000; i++) {
    blocks.set(`${i}x${lowest}`, '#');
  }
}

function getBlocks(input: number[][][]): Map<string, string> {
  const blocks = new Map<string, string>();

  for (const line of input) {
    let [startX, startY] = line[0];
    blocks.set(`${startX}x${startY}`, '#');
    for (let index = 1; index < line.length; index++) {
      const [endX, endY] = line[index];
      const dx = endX - startX;
      const dy = endY - startY;
      while (true) {
        startX += Math.sign(dx);
        startY += Math.sign(dy);
        blocks.set(`${startX}x${startY}`, '#');
        if (startX === endX && startY === endY) {
          break;
        }
      }
    }
  }

  return blocks;
}

function getLowest(blocks: Map<string, string>): number {
  const y = [...blocks.keys()].map((block) => Number(block.split('x').pop()));

  return Math.max(...y);
}
function placeSand(blocks: Map<string, string>): [number, number] {
  let [x, y] = [500, 0];
  let stop = true;
  const directions = [
    [0, 1],
    [-1, 1],
    [1, 1],
  ];

  while (true) {
    stop = true;
    if (y >= lowest) {
      return [-1, -1];
    }
    for (const [dx, dy] of directions) {
      if (!blocks.has(`${x + dx}x${y + dy}`)) {
        x += dx;
        y += dy;
        stop = false;
        break;
      }
    }
    if (stop) {
      return [x, y];
    }
  }
}

function getHorizontalBounds(blocks: Map<string, string>): [number, number] {
  const bounds = [...blocks.keys()].map((block) =>
    Number(block.split('x').shift())
  );
  return [Math.min(...bounds), Math.max(...bounds)];
}

function getNumberOfSand(blocks: Map<string, string>): number {
  while (!blocks.has('500x0')) {
    const [x, y] = placeSand(blocks);
    if (x !== -1 && y !== -1) {
      blocks.set(`${x}x${y}`, 'o');
    } else {
      break;
    }
  }

  return [...blocks.values()].filter((value) => value === 'o').length;
}
