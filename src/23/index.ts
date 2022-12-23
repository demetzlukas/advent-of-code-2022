import { readLinesFromInput } from '../utils/readFile';
import { isEqual } from 'lodash';

const filename = './input/23.txt';

export async function main() {
  const input = (await readLinesFromInput(filename)).map((line) =>
    line.split('')
  );

  let positions = new Map<string, [number, number]>();

  input.forEach((row, rIndex) => {
    row.forEach((element, cIndex) => {
      if (element === '#') {
        positions.set(getKey(rIndex, cIndex), [rIndex, cIndex]);
      }
    });
  });

  let steps = 1;
  while (true) {
    const nextMap = step(positions);
    if (steps === 10) {
      console.log('Part 1:', getFieldSize(nextMap) - nextMap.size);
    }
    if (isEqual(positions, nextMap)) {
      console.log('Part 2:', steps);
      break;
    }
    positions = nextMap;
    steps++;
  }
}

function getKey(x: number, y: number): string {
  return `${x}x${y}`;
}

const directionsToCheck = [
  [
    // N, NE, or NW
    [-1, 0],
    [-1, 1],
    [-1, -1],
  ],
  [
    // S, SE, or SW
    [1, 0],
    [1, 1],
    [1, -1],
  ],
  [
    // W, NW, or SW
    [0, -1],
    [-1, -1],
    [1, -1],
  ],
  [
    //E, NE, or SE
    [0, 1],
    [-1, 1],
    [1, 1],
  ],
];

function move([x, y]: [number, number], direction: number): [number, number] {
  const [dx, dy] = directionsToCheck[direction][0];

  return [x + dx, y + dy];
}

function checkMove(
  [x, y]: [number, number],
  direction: number,
  map: Map<string, [number, number]>
): boolean {
  for (const [dx, dy] of directionsToCheck[direction]) {
    if (map.has(getKey(x + dx, y + dy))) {
      return false;
    }
  }

  return true;
}

function step(
  map: Map<string, [number, number]>
): Map<string, [number, number]> {
  const possibleNextMap = new Map<string, [number, number][]>();
  for (const [key, [x, y]] of map.entries()) {
    let moved = false;
    if (!hasAdjacent([x, y], map)) {
      possibleNextMap.set(key, [[x, y]]);
      continue;
    }
    for (let i = 0; i < directionsToCheck.length; i++) {
      if (checkMove([x, y], i, map)) {
        const [nextX, nextY] = move([x, y], i);
        const possibleMoves = possibleNextMap.get(getKey(nextX, nextY)) ?? [];
        possibleMoves.push([x, y]);
        possibleNextMap.set(getKey(nextX, nextY), possibleMoves);
        moved = true;
        break;
      }
    }
    if (!moved) {
      possibleNextMap.set(key, [[x, y]]);
    }
  }

  const nextMap = new Map<string, [number, number]>();

  for (const [key, moves] of possibleNextMap.entries()) {
    if (moves.length === 1) {
      nextMap.set(key, key.split('x').map(Number) as [number, number]);
    } else {
      for (const [x, y] of moves) {
        nextMap.set(getKey(x, y), [x, y]);
      }
    }
  }

  rotateDirection();

  return nextMap;
}
function rotateDirection() {
  directionsToCheck.push(directionsToCheck.shift());
}

function print(map: Map<string, [number, number]>) {
  const [minRow, maxRow, minColumn, maxColumn] = getBounds(map);

  for (let i = minRow; i < maxRow + 1; i++) {
    const line: string[] = [];
    for (let j = minColumn; j < maxColumn + 1; j++) {
      line.push(map.has(getKey(i, j)) ? '#' : '.');
    }
    console.log(line.join(''));
  }
}

function hasAdjacent(
  [x, y]: [number, number],
  map: Map<string, [number, number]>
): boolean {
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      if (map.has(getKey(x + dx, y + dy))) {
        return true;
      }
    }
  }
  return false;
}

function getBounds(
  map: Map<string, [number, number]>
): [number, number, number, number] {
  const minRow = Math.min(...[...map.values()].map(([x, y]) => x));
  const maxRow = Math.max(...[...map.values()].map(([x, y]) => x));
  const minColumn = Math.min(...[...map.values()].map(([x, y]) => y));
  const maxColumn = Math.max(...[...map.values()].map(([x, y]) => y));

  return [minRow, maxRow, minColumn, maxColumn];
}

function getFieldSize(map: Map<string, [number, number]>): number {
  const [minRow, maxRow, minColumn, maxColumn] = getBounds(map);

  return (maxRow - minRow + 1) * (1 + maxColumn - minColumn);
}
