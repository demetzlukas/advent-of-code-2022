import { readFileFromInput } from '../utils/readFile';

const filename = './input/1.txt';

export async function main() {
  const input = await readFileFromInput(filename);
  const sumsOfCalories = input
    .split('\r\n\r\n')
    .map((calories) =>
      calories
        .split('\r\n')
        .map((l) => parseInt(l))
        .reduce((sum, current) => sum + current)
    )
    .sort((a, b) => b - a);

  console.log('Part 1:', sumsOfCalories[0]);
  console.log(
    'Part 2:',
    sumsOfCalories.slice(0, 3).reduce((sum, current) => sum + current)
  );
}
