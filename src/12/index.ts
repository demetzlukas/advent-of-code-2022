import { readLinesFromInput } from '../utils/readFile';

const filename = './input/12.txt';

export async function main() {
  const input = (await readLinesFromInput(filename)).map((line) =>
    line.split('')
  );

  const costs = getCosts(input);
  console.log('Part 1:', findPaths(input, costs));
  console.log('Part 2:', findPaths(input, costs, 2));
}

function findPaths(map: string[][], distances: number[][], part = 1): number {
  const nodes: [number, number, number][] = [];
  const visited: Set<string> = new Set();

  map.forEach((row, rowIndex) => {
    row.forEach((element, columnIndex) => {
      if (
        (part === 1 && element === 'S') ||
        (part === 2 && distances[rowIndex][columnIndex] === 1)
      ) {
        nodes.push([0, rowIndex, columnIndex]);
      }
    });
  });

  while (nodes.length > 0) {
    const [distance, row, column] = nodes.shift();
    if (visited.has(`${row}x${column}`)) {
      continue;
    }
    visited.add(`${row}x${column}`);

    if (map[row][column] === 'E') {
      return distance;
    }

    getAdjacentIndices(map, row, column).forEach(([x, y]) => {
      if (distances[x][y] <= distances[row][column] + 1) {
        nodes.push([distance + 1, x, y]);
      }
    });
  }

  return -1;
}

function getAdjacentIndices(
  field: string[][],
  row: number,
  column: number
): number[][] {
  const indices = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  return indices
    .map(([x, y]) => [row + x, column + y])
    .filter(
      ([x, y]) => x > -1 && x < field.length && y > -1 && y < field[row].length
    );
}

function getCosts(input: any[][]): number[][] {
  return input.map((row) =>
    row.map((element) => {
      if (element === 'S') return 1;
      if (element === 'E') return 26;
      return element.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    })
  );
}
