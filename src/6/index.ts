import { readFileFromInput } from '../utils/readFile';

const filename = './input/6.txt';

export async function main() {
  const input = await readFileFromInput(filename);
  console.log('Part 1:', findFirstUniqueLetters(input, 4));
  console.log('Part 2:', findFirstUniqueLetters(input, 14));
}

function findFirstUniqueLetters(
  string: string,
  numberOfUniqueLetters: number
): number {
  let chars = new Set(string.slice(0, numberOfUniqueLetters));
  for (let index = numberOfUniqueLetters; index < string.length; index++) {
    if (chars.size == numberOfUniqueLetters) {
      return index - 1;
    }

    chars = new Set(string.slice(index - numberOfUniqueLetters, index));
  }

  return -1;
}
