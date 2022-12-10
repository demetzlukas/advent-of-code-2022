import { readLinesFromInput } from '../utils/readFile';

const filename = './input/10.txt';

export async function main() {
  const input = (await readLinesFromInput(filename)).flatMap((command) =>
    command === 'noop' ? command : ['noop', command]
  );
  const crt: string[][] = [[]];
  let x = 1;
  let cycle = 1;
  let strength = 0;
  let sprite = 1;
  let pixel = 0;
  let row = 0;

  for (const instruction of input) {
    if (cycle % 40 === 20) {
      strength += cycle * x;
    }

    crt[row].push([sprite - 1, sprite, sprite + 1].includes(pixel) ? '#' : ' ');

    pixel++;

    if (pixel === 40) {
      pixel = 0;
      row++;
      crt.push([]);
    }

    if (instruction.startsWith('add')) {
      x += Number(instruction.split(' ')[1]);
      sprite = x;
    }

    cycle++;
  }

  console.log('Part 1:', strength);
  console.log('Part 2:');
  crt.forEach((row) => console.log(row.join('')));
}
