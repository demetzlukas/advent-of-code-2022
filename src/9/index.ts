import { readLinesFromInput } from '../utils/readFile';

const filename = './input/9.txt';
const moves = {
  D: [-1, 0],
  U: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

export async function main() {
  const input = (await readLinesFromInput(filename)).map((line) => {
    const words = line.split(' ');
    return [words[0], Number([words[1]])] as [string, number];
  });

  console.log('Part 1:', getVisitedTails(input, 2).size);
  console.log('Part 2:', getVisitedTails(input, 10).size);
}

function areAdjacent([x1, y1]: number[], [x2, y2]: number[]): boolean {
  return Math.abs(x1 - x2) < 2 && Math.abs(y1 - y2) < 2;
}

function adjustPosition([x1, y1]: number[], [x2, y2]: number[]) {
  let result = [0, 0];

  result[0] =
    Math.abs(x1 - x2) === 2 ? x2 + 1 * Math.sign(x1 - x2) : x2 + (x1 - x2);
  result[1] =
    Math.abs(y1 - y2) === 2 ? y2 + 1 * Math.sign(y1 - y2) : y2 + (y1 - y2);

  return result;
}

function getVisitedTails(
  input: [string, number][],
  numberOfKnots: number
): Set<string> {
  const visited: Set<string> = new Set();
  let positions = Array.from({ length: numberOfKnots }, () => [0, 0]);

  input.forEach(([direction, steps]) => {
    const [moveX, moveY] = moves[direction];

    for (let step = 0; step < steps; step++) {
      const oldHead = positions.shift();
      positions.unshift([oldHead[0] + moveX, oldHead[1] + moveY]);

      for (let index = 0; index + 1 < positions.length; index++) {
        // add tail to visited
        if (index + 1 === positions.length - 1) {
          visited.add(`${positions[index + 1][0]}x${positions[index + 1][1]}`);
        }

        if (areAdjacent(positions[index], positions[index + 1])) {
          break;
        }

        positions[index + 1] = adjustPosition(
          positions[index],
          positions[index + 1]
        );
      }
    }
  });

  visited.add(
    `${positions[positions.length - 1][0]}x${
      positions[positions.length - 1][1]
    }`
  );

  return visited;
}
