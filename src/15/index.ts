import { isConstructorDeclaration } from 'typescript';
import { readLinesFromInput } from '../utils/readFile';

const filename = './input/15.txt';

const regex =
  /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;
const bound = 2000000;
export async function main() {
  const input = (await readLinesFromInput(filename)).map((line) =>
    line.match(regex).slice(1).map(Number)
  );

  const covered = new Set<string>();
  const beacons = new Set<string>();
  const sender: [number, number, number][] = [];

  for (const [sx, sy, bx, by] of input) {
    const distance = getManhattanDistance([sx, sy], [bx, by]);
    sender.push([sx, sy, distance]);
    beacons.add(`${bx}x${by}`);
  }

  let sum = 0;
  for (let x = -5000000; x < 5000000; x++) {
    if (!beacons.has(`${x}x${bound}`) && isCovered([x, bound], sender)) {
      sum++;
    }
  }

  console.log('Part 1:', sum);

  console.log('Part 2:');
}

function getManhattanDistance(
  [ax, ay]: [number, number],
  [bx, by]: [number, number]
): number {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

function isCovered(
  [x, y]: [number, number],
  sender: [number, number, number][]
): boolean {
  for (const [sx, sy, distance] of sender) {
    if (getManhattanDistance([sx, sy], [x, y]) <= distance) {
      return true;
    }
  }

  return false;
}
