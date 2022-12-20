import { readLinesFromInput } from '../utils/readFile';

const filename = './input/20.txt';

type Element = {
  index: number;
  value: number;
};

export async function main() {
  const input = (await readLinesFromInput(filename)).map(Number);

  console.log('Part 1:', mix(input));
  console.log('Part 2:', mix(input, 10, 811589153));
}

function mix(values: number[], rounds = 1, decryptionKey = 1) {
  const list = values.map(
    (value, index) =>
      ({
        index,
        value: Number(value) * decryptionKey,
      } as Element)
  );

  const newList = [...list];

  for (let index = 0; index < rounds; index++) {
    list.forEach((element) => {
      const { value, index } = element;
      const oldIndex = newList.findIndex((element) => index === element.index);
      let targetIndex =
        value < 0 ? newList.length - 1 + value + oldIndex : oldIndex + value;

      newList.splice(oldIndex, 1);
      targetIndex %= newList.length;

      newList.splice(targetIndex, 0, element);
    });
  }

  const indexZero = newList.findIndex((v) => 0 === v.value);

  return (
    newList[(1000 + indexZero) % newList.length].value +
    newList[(2000 + indexZero) % newList.length].value +
    newList[(3000 + indexZero) % newList.length].value
  );
}
