import { readLinesFromInput } from '../utils/readFile';
import { range } from 'lodash';
import { intersect } from '../utils/iterables';

const filename = './input/4.txt';

export async function main() {
  const input = (await readLinesFromInput(filename)).map((line) =>
    line.split(',').map((part) => part.split('-').map(Number))
  );

  console.log(
    'Part 1:',
    input.filter(
      ([first, second]) =>
        doFullyOverlap(first, second) || doFullyOverlap(second, first)
    ).length
  );

  console.log(
    'Part 2:',
    input.filter(([first, second]) => doOverlap(first, second)).length
  );
}

function doFullyOverlap(first: number[], second: number[]): boolean {
  if (first[0] <= second[0] && first[1] >= second[1]) {
    return true;
  }

  return false;
}

function doOverlap(first: number[], second: number[]): boolean {
  return (
    intersect(range(first[0], first[1] + 1), range(second[0], second[1] + 1))
      .size > 0
  );
}
