import { readLinesFromInput } from '../utils/readFile';

const filename = './input/16.txt';
type Valve = {
  name: string;
  rate: number;
  tunnels: string[];
};

const regex =
  /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)/;

export async function main() {
  const valves: Valve[] = (await readLinesFromInput(filename))
    .map((line) => line.match(regex).slice(1))
    .map(([name, rate, tunnels]) => ({
      name,
      rate: Number(rate),
      tunnels: tunnels.split(', '),
    }));

  const map = new Map<string, Valve>();
  valves.forEach((valve) => map.set(valve.name, valve));
  const valvesToOpen = valves.filter((valve) => valve.rate > 0);
  const distances = getAllDistances(valves, map);

  console.log(
    'Part 1:',
    getMaximumPressure(map.get('AA'), valvesToOpen, distances, 30)
  );
}

function getAllDistances(valves: Valve[], map: Map<string, Valve>) {
  const distances = {};

  valves.forEach((from) => {
    distances[from.name] = {};
    valves.forEach(
      (to) => (distances[from.name][to.name] = getDistance(from, to, map))
    );
  });

  return distances;
}

function getDistance(
  from: Valve,
  to: Valve,
  valves: Map<string, Valve>
): number {
  const queue: [number, Valve, string[]][] = [[0, from, []]];

  while (queue.length > 0) {
    const [distance, valve, visited] = queue.shift();
    if (valve.name === to.name) {
      return distance;
    }
    valve.tunnels.forEach((n) => {
      if (!visited.includes(n))
        queue.push([distance + 1, valves.get(n), [...visited, valve.name]]);
    });
  }

  return -1;
}

function getMaximumPressure(
  startValve: Valve,
  valvesToOpen: Valve[],
  distances,
  time: number
): number {
  let maxPressure = 0;
  let paths = 1;

  // time, valve, opened, pressure
  const queue: [number, Valve, string[], number][] = [];

  queue.push([time, startValve, [], 0]);

  while (queue.length > 0) {
    paths++;
    const [time, valve, opened, currentPressure] = queue.shift();
    opened.push(valve.name);

    let newCreated = false;
    for (const nextValve of valvesToOpen) {
      if (
        nextValve.name === valve.name ||
        opened.includes(nextValve.name) ||
        time - 1 - distances[valve.name][nextValve.name] < 1
      ) {
        continue;
      }
      // time, valve, opened, pressure
      queue.push([
        time - 1 - distances[valve.name][nextValve.name],
        nextValve,
        [...opened],
        currentPressure +
          (time - 1 - distances[valve.name][nextValve.name]) * nextValve.rate,
      ]);
      newCreated = true;
    }

    if (!newCreated) {
      maxPressure = Math.max(maxPressure, currentPressure);
    }
  }

  return maxPressure;
}
