import * as fs from "fs";
import * as path from "path";

const EXAMPLE_FILE_NAME = "example_input.txt";
function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

const log = (arg: unknown) => console.log(JSON.stringify(arg, undefined, 2));

const getConnectionId = (p1: Point, p2: Point, dist: number) =>
  `${dist}-${p1.index}-${p2.index}`;

type Point = { x: number; y: number; z: number; index: number };
const getDistance = (p1: Point, p2: Point) => {
  return (
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2) +
    Math.pow(p1.z - p2.z, 2)
  );
};

const parsePoint = (line: string, index: number): Point => {
  const [x, y, z] = line.split(",");
  return { x: Number(x), y: Number(y), z: Number(z), index };
};
const main = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const lines = content.split("\n").filter(Boolean);

  const points = lines.map(parsePoint);

  let distancesSet: Set<string> = new Set<string>();

  points.forEach((pointA, i) => {
    console.log("ai", i);
    points.forEach((pointB) => {
      if (pointA === pointB) return;
      const distance = getDistance(pointA, pointB);
      const id = getConnectionId(pointA, pointB, distance);
      const mirrorId = getConnectionId(pointB, pointA, distance);
      if (!distancesSet.has(mirrorId)) {
        distancesSet.add(id);
      }
    });
  });

  let distances = Array.from(distancesSet).sort((a: string, b: string) => {
    return Number(a.split("-")[0]) - Number(b.split("-")[0]);
  });

  const groupsByPoints: Record<string, number> = {};
  points.forEach((point) => {
    groupsByPoints[point.index] = point.index;
  });

  let additionCounter = 0;
  let connectionIndex = 0;
  let lastConnectedPointA = null;
  let lastConnectedPointB = null;
  while (true) {
    console.log(connectionIndex, "/", distances.length);
    const connection = distances[connectionIndex];
    const [_, indexA, indexB] = connection.split("-").map(Number);

    const pAGroup = groupsByPoints[indexA];
    const pBGroup = groupsByPoints[indexB];
    if (pAGroup !== pBGroup) {
      console.log("join: ", additionCounter, pBGroup, " to ", pAGroup);
      Object.keys(groupsByPoints).forEach((key) => {
        if (groupsByPoints[key] === pBGroup) {
          groupsByPoints[key] = pAGroup;
        }
      });
      lastConnectedPointA = indexA;
      lastConnectedPointB = indexB;
    }
    additionCounter++;
    connectionIndex++;
    if (connectionIndex === distances.length) break;
  }

  log(groupsByPoints);
  const groupMembers: Record<string, number> = {};

  // get points by groups
  Object.keys(groupsByPoints).forEach((key) => {
    const value = groupsByPoints[key];
    groupMembers[value] = groupMembers[value] ? groupMembers[value] + 1 : 1;
  });
  log(groupMembers);

  const largestIndexes = Object.keys(groupMembers)
    .sort((keyA, keyB) => groupMembers[keyB] - groupMembers[keyA])
    .slice(0, 3);
  const largestValues = largestIndexes.map((k) => groupMembers[k]);
  log(largestValues);
  const result = largestValues.reduce((acc, curr) => acc * curr, 1);
  log(result);

  log(lastConnectedPointA);
  log(lastConnectedPointB);

  const pointA = points[lastConnectedPointA!];
  const pointB = points[lastConnectedPointB!];
  log(pointA);
  log(pointB);
  log(pointA.x * pointB.x);
};

main();
