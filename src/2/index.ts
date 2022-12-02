import { readLinesFromInput } from '../utils/readFile';

const filename = './input/2.txt';

const score = {
  x: 1,
  y: 2,
  z: 3,
};

// 0 -> lose
// 1 -> draw
// 2 -> win
const rules = {
  a: { x: 1, y: 2, z: 0 },
  b: { x: 0, y: 1, z: 2 },
  c: { x: 2, y: 0, z: 1 },
};
const rulesTwo = { x: 0, y: 1, z: 2 };
const scoreForResult = { 0: 0, 1: 3, 2: 6 };

export async function main() {
  const input = (await readLinesFromInput(filename)).map((line) =>
    line.toLowerCase().split(' ')
  );

  console.log(
    'Part 1:',
    input
      .map(
        ([first, second]) =>
          scoreForResult[rules[first][second]] + score[second]
      )
      .reduce((sum, current) => sum + current)
  );

  console.log(
    'Part 2:',
    input
      .map(([first, second]) => {
        const result = rulesTwo[second];
        const choice = findChoiceForResult(first, result);
        return score[choice] + scoreForResult[result];
      })
      .reduce((sum, current) => sum + current)
  );
}

function findChoiceForResult(
  firstChoice: string,
  neededResult: number
): string {
  const choices = rules[firstChoice];

  for (const choice in choices) {
    if (Object.prototype.hasOwnProperty.call(choices, choice)) {
      const result = choices[choice];
      if (result === neededResult) {
        return choice;
      }
    }
  }

  throw new Error('No choice found');
}
