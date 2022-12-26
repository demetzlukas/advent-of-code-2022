import { cloneDeep } from 'lodash';
import { readLinesFromInput } from '../utils/readFile';
import { isEqual } from 'lodash';

const filename = './input/24.txt';

const directions = {
  '^': [-1, 0],
  v: [1, 0],
  '>': [0, 1],
  '<': [0, -1],
};

export async function main() {
  const input = (await readLinesFromInput(filename)).map((line) =>
    line.split('').map((e) => [e])
  );

  let field = cloneDeep(input);

  const start: [number, number] = [0, 1];
  const end: [number, number] = [field.length - 1, field[0].length - 2];

  // minutes, position, field
  let queue: [number, [number, number]][] = [[0, start]];
  let doneFirstPart = false;
  let doneSecondPartFirst = false;
  let doneSecondPartSecond = false;

  const seen = new Set<string>();
  const fields: string[][][][] = [move(field)];

  while (queue.length > 0) {
    const [minutes, pos] = queue.shift();
    if (seen.has(`${minutes}-${pos[0]}-${pos[1]}`)) {
      continue;
    }
    if (fields.length === minutes) {
      fields[minutes] = move(fields[minutes - 1]);
    }

    if (
      !doneFirstPart &&
      !doneSecondPartFirst &&
      !doneSecondPartSecond &&
      isEqual(pos, end)
    ) {
      console.log('Part 1:', minutes);
      doneFirstPart = true;
      queue = [[minutes, pos]];
    }

    if (
      doneFirstPart &&
      !doneSecondPartFirst &&
      !doneSecondPartSecond &&
      isEqual(pos, start)
    ) {
      doneSecondPartFirst = true;
      queue = [[minutes, pos]];
    }

    if (
      doneFirstPart &&
      doneSecondPartFirst &&
      !doneSecondPartSecond &&
      isEqual(pos, end)
    ) {
      console.log('Part 2:', minutes);
      break;
    }

    const newField = fields[minutes];

    if (newField[pos[0]][pos[1]][0] === '.') {
      queue.push([minutes + 1, pos]);
    }
    for (const [nextX, nextY] of getAdjacent(pos, newField)) {
      if (newField[nextX][nextY][0] !== '.') {
        continue;
      }
      queue.push([minutes + 1, [nextX, nextY]]);
    }

    seen.add(`${minutes}-${pos[0]}-${pos[1]}`);
  }
}

function move(field: string[][][]): string[][][] {
  const newField: string[][][] = [];

  for (let row = 0; row < field.length; row++) {
    newField[row] = [];
    for (let column = 0; column < field[0].length; column++) {
      if (
        row === 0 ||
        row === field.length - 1 ||
        column === 0 ||
        column === field[row].length - 1
      ) {
        newField[row][column] = ['#'];
      } else {
        newField[row][column] = ['.'];
      }
    }
  }

  newField[0][1] = ['.'];
  newField[newField.length - 1][newField[0].length - 2] = ['.'];

  for (let row = 1; row < field.length - 1; row++) {
    for (let column = 1; column < field[0].length - 1; column++) {
      for (const element of field[row][column]) {
        if (element === '.') {
          continue;
        }
        const [dx, dy] = directions[element];

        let [newRow, newColumn] = [row + dx, column + dy];

        if (newRow === 0) {
          newRow = field.length - 2;
        } else if (newRow === field.length - 1) {
          newRow = 1;
        } else if (newColumn === 0) {
          newColumn = field[row].length - 2;
        } else if (newColumn === field[row].length - 1) {
          newColumn = 1;
        }

        if (newField[newRow][newColumn][0] === '.') {
          newField[newRow][newColumn] = [];
        }
        newField[newRow][newColumn].push(element);
      }
    }
  }

  return newField;
}

function print(field: string[][][]) {
  for (const row of field) {
    const line = [];
    for (const element of row) {
      if (element.length > 1) {
        line.push(element.length);
      } else {
        line.push(element[0]);
      }
    }
    console.log(line.join(''));
  }
}

function getAdjacent(
  [x, y]: [number, number],
  field: string[][][]
): [number, number][] {
  const adjacent = [];
  for (const [dx, dy] of [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0],
  ]) {
    const [nextX, nextY] = [x + dx, y + dy];

    // start and end
    if (
      (nextX === 0 && nextY === 1) ||
      (nextX == field.length - 1 && nextY === field[0].length - 2)
    ) {
      adjacent.push([nextX, nextY]);
    } else if (
      nextX <= 0 ||
      nextX >= field.length - 1 ||
      nextY <= 0 ||
      nextY >= field[0].length - 1
    ) {
      continue;
    }
    adjacent.push([nextX, nextY]);
  }

  return adjacent;
}
