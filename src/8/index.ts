import { readLinesFromInput } from '../utils/readFile';

const filename = './input/8.txt';

export async function main() {
  const trees = (await readLinesFromInput(filename)).map((line) =>
    line.split('').map(Number)
  );

  const seenTrees = getSeenTrees(trees);
  console.log(
    'Part 1:',
    seenTrees.size + trees.length * 2 + (trees[0].length - 2) * 2
  );

  console.log(
    'Part 2:',
    [...seenTrees]
      .map((tree) => {
        const [x, y] = tree.split('x');
        return [Number(x), Number(y)];
      })
      .map(([x, y]) => calculateViewDistance(trees, x, y))
      .sort((a, b) => b - a)
      .shift()
  );
}

function isTreeSeen(
  trees: number[][],
  row: number,
  column: number,
  highestTree: number,
  highestTrees: Set<string>
): number {
  const height = trees[row][column];
  if (height > highestTree) {
    highestTrees.add(`${row}x${column}`);
    highestTree = height;
  }

  return highestTree;
}

function getSeenTrees(input: number[][]): Set<string> {
  const trees: Set<string> = new Set();
  const numberOfRows = input.length;
  const numberOfColumns = input[0].length;

  // ltr
  for (let row = 1; row < numberOfRows - 1; row++) {
    let max = input[row][0];
    for (let column = 1; column < numberOfColumns - 1; column++) {
      max = isTreeSeen(input, row, column, max, trees);
    }
  }

  // rtl
  for (let row = numberOfRows - 2; row > 0; row--) {
    let max = input[row][numberOfColumns - 1];
    for (let column = numberOfColumns - 2; column > 0; column--) {
      max = isTreeSeen(input, row, column, max, trees);
    }
  }

  // ttb
  for (let column = 1; column < numberOfColumns - 1; column++) {
    let max = input[0][column];
    for (let row = 1; row < numberOfRows - 1; row++) {
      max = isTreeSeen(input, row, column, max, trees);
    }
  }

  // btt
  for (let column = 1; column < numberOfColumns - 1; column++) {
    let max = input[numberOfRows - 1][column];
    for (let row = numberOfRows - 1; row > 0; row--) {
      max = isTreeSeen(input, row, column, max, trees);
    }
  }

  return trees;
}

function calculateViewDistance(
  input: number[][],
  x: number,
  y: number
): number {
  const numberOfRows = input.length;
  const numberOfColumns = input[0].length;
  const height = input[x][y];

  let distance = 1;
  let numberOfSmallerTrees = 1;

  // ltr
  for (let index = y + 1; index < numberOfColumns - 1; index++) {
    if (height <= input[x][index]) {
      break;
    }
    numberOfSmallerTrees++;
  }

  distance *= numberOfSmallerTrees;
  numberOfSmallerTrees = 1;

  // rtl
  for (let index = y - 1; index > 0; index--) {
    if (height <= input[x][index]) {
      break;
    }
    numberOfSmallerTrees++;
  }

  distance *= numberOfSmallerTrees;
  numberOfSmallerTrees = 1;

  // ttb
  for (let index = x + 1; index < numberOfRows - 1; index++) {
    if (height <= input[index][y]) {
      break;
    }
    numberOfSmallerTrees++;
  }

  distance *= numberOfSmallerTrees;
  numberOfSmallerTrees = 1;

  // btt
  for (let index = x - 1; index > 0; index--) {
    if (height <= input[index][y]) {
      break;
    }
    numberOfSmallerTrees++;
  }

  return (distance *= numberOfSmallerTrees);
}
