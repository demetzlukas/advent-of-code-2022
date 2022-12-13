import { isEqual } from 'lodash';
import { readFileFromInput } from '../utils/readFile';

const filename = './input/13.txt';

export async function main() {
  const pairs = (await readFileFromInput(filename)).split('\r\n\r\n');

  let sum = 0;
  pairs.forEach((pair, index) => {
    const [left, right] = pair.split('\r\n');
    if (compare(eval(left), eval(right)) === -1) {
      sum += index + 1;
    }
  });

  console.log('Part 1:', sum);

  const lines = pairs
    .flatMap((line) => line.split('\r\n'))
    .map((line) => eval(line));
  lines.push(eval('[[2]]'));
  lines.push(eval('[[6]]'));
  const sorted = lines.sort(compare);

  let product = 1;
  sorted.forEach((element, index) => {
    if (isEqual(element, eval('[[2]]')) || isEqual(element, eval('[[6]]'))) {
      product *= index + 1;
    }
  });

  console.log('Part 2:', product);
}

function compare(left: any, right: any): number {
  if (Array.isArray(left) && Array.isArray(right)) {
    let index = 0;
    while (index < left.length && index < right.length) {
      const comp = compare(left[index], right[index]);
      if (comp === 1) {
        return 1;
      } else if (comp == -1) {
        return -1;
      }
      index++;
    }
    if (index === left.length && index < right.length) {
      return -1;
    } else if (index < left.length && index === right.length) {
      return 1;
    }
    return 0;
  } else if (Array.isArray(left) && !Array.isArray(right)) {
    return compare(left, [right]);
  } else if (!Array.isArray(left) && Array.isArray(right)) {
    return compare([left], right);
  } else {
    if (left > right) {
      return 1;
    }
    if (left < right) {
      return -1;
    } else {
      return 0;
    }
  }
}
