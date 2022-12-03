import { readLinesFromInput } from '../utils/readFile';
import { intersect } from '../utils/iterables';

const filename = './input/3.txt';

export async function main() {
  const input = await readLinesFromInput(filename);

  console.log(
    'Part 1:',
    input
      .map((line) =>
        intersect(
          new Set(line.slice(0, line.length / 2)),
          new Set(line.slice(line.length / 2))
        )
      )
      .map((set) => getScoreForCharacters(set))
      .reduce((sum, current) => sum + current)
  );

  console.log(
    'Part 2:',
    splitIntoGroups(input)
      .map(([first, second, third]) =>
        intersect(intersect(first, second), third)
      )
      .map((set) => getScoreForCharacters(set))
      .reduce((sum, current) => sum + current)
  );
}

function getScoreForCharacters(set: Set<string>): number {
  let sum = 0;
  for (const char of set) {
    if (char === char.toLowerCase()) {
      sum += char.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    } else {
      sum += char.charCodeAt(0) - 'A'.charCodeAt(0) + 1 + 26;
    }
  }

  return sum;
}

function splitIntoGroups(lines: string[]): Set<string>[][] {
  const groups: Set<string>[][] = [];
  for (let i = 0; i < lines.length - 2; i += 3) {
    const group = [];
    group.push(new Set(lines[i]));
    group.push(new Set(lines[i + 1]));
    group.push(new Set(lines[i + 2]));

    groups.push(group);
  }

  return groups;
}
