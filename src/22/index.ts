import { readFileFromInput } from '../utils/readFile';

const filename = './input/22.txt';
const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
let direction = 0;

export async function main() {
  const [layout, foo] = (await readFileFromInput(filename, false)).split(
    '\r\n\r\n'
  );

  const steps = foo.split('');
  const map = new Map<string, string>();
  let [currentX, currentY] = [-Infinity, -Infinity];
  layout.split('\r\n').forEach((line, x) => {
    line.split('').forEach((element, y) => {
      if (currentX === -Infinity && element === '.') {
        currentX = x;
        currentY = y;
      }
      if (element != ' ') {
        map.set(getKey(x, y), element);
      }
    });
  });

  while (true) {
    let temp = '';
    while (true) {
      if (steps[0] === 'R' || steps[0] === 'L' || steps.length === 0) break;
      temp += steps.shift();
    }
    let numberOfSteps = Number(temp);
    for (let s = 0; s < numberOfSteps; s++) {
      let [nextX, nextY] = [
        currentX + directions[direction][0],
        currentY + directions[direction][1],
      ];
      if (!map.has(getKey(nextX, nextY))) {
        [nextX, nextY] = wrap(currentX, currentY, map);
      }
      if (map.get(getKey(nextX, nextY)) === '.') {
        [currentX, currentY] = [nextX, nextY];
      } else if (map.get(getKey(nextX, nextY)) === '#') {
        break;
      }
    }
    if (steps.length === 0) {
      break;
    }
    changeDirection(steps.shift());
  }
  console.log(
    'Part 1:',
    (currentX + 1) * 1000 + 4 * (currentY + 1) + direction
  );
  console.log('Part 2:');
}

function getKey(x: number, y: number): string {
  return `${x}x${y}`;
}

function changeDirection(dir: string) {
  if (dir === 'R') {
    direction++;
    direction %= directions.length;
  } else {
    direction--;
    if (direction < 0) {
      direction = directions.length - 1;
    }
  }
}

function wrap(
  x: number,
  y: number,
  map: Map<string, string>
): [number, number] {
  const newDirection = (direction + 2) % directions.length;
  while (true) {
    const [nextX, nextY] = [
      x + directions[newDirection][0],
      y + directions[newDirection][1],
    ];
    if (!map.has(getKey(nextX, nextY))) {
      return [x, y];
    }
    [x, y] = [nextX, nextY];
  }
}
