import { readLinesFromInput } from '../utils/readFile';

const filename = './input/18.txt';
const inside = new Set<string>();
const outside = new Set<string>();

export async function main() {
  const cubes = await readLinesFromInput(filename);

  console.log(
    'Part 1:',
    cubes
      .map((cube) => getSidesFacingOutside(cube, cubes))
      .reduce((a, b) => a + b)
  );

  console.log(
    'Part 2:',
    cubes
      .map((cube) => getSidesFacingOutside(cube, cubes, true))
      .reduce((a, b) => a + b)
  );
}

function getKey(x: any, y: any, z: any): string {
  return `${x},${y},${z}`;
}

function getSidesFacingOutside(
  cube: string,
  cubes: string[],
  partTwo = false
): number {
  let sides = 6;

  const [x, y, z] = cube.split(',').map(Number);
  for (const [dx, dy, dz] of [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
  ]) {
    if (cubes.includes(getKey(x + dx, y + dy, z + dz))) {
      sides--;
    } else if (partTwo && isFacingInside(x + dx, y + dy, z + dz, cubes)) {
      sides--;
    }
  }

  return sides;
}

function isFacingInside(x: number, y: number, z: number, cubes: string[]) {
  const queue = [[x, y, z]];
  const seen = new Set<string>();

  if (inside.has(getKey(x, y, z))) {
    return true;
  }
  if (outside.has(getKey(x, y, z))) {
    return false;
  }

  while (queue.length > 0) {
    // just an educated guess about this number
    if (queue.length > 500) {
      outside.add(getKey(x, y, z));

      return false;
    }
    const [qx, qy, qz] = queue.shift();

    if (seen.has(getKey(qx, qy, qz))) {
      continue;
    }

    seen.add(getKey(qx, qy, qz));

    for (const [dx, dy, dz] of [
      [-1, 0, 0],
      [1, 0, 0],
      [0, -1, 0],
      [0, 1, 0],
      [0, 0, -1],
      [0, 0, 1],
    ]) {
      if (cubes.includes(getKey(qx + dx, qy + dy, qz + dz))) {
        continue;
      }
      queue.push([qx + dx, qy + dy, qz + dz]);
    }
  }
  seen.forEach((point) => inside.add(point));
  inside.add(getKey(x, y, z));

  return true;
}
