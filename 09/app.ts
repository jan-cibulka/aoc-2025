import * as fs from "fs";
import * as path from "path";

const EXAMPLE_FILE_NAME = "example_input.txt";
function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

const log = (arg: unknown) => console.log(JSON.stringify(arg, undefined, 2));

type Point = { x: number; y: number; index?: number };

const parsePoint = (line: string, index: number): Point => {
  const [x, y] = line.split(",");
  return { x: Number(x), y: Number(y), index };
};

const getArea = (pointA: Point, pointB: Point) => {
  return (
    (Math.abs(pointA.x - pointB.x) + 1) * (Math.abs(pointA.y - pointB.y) + 1)
  );
};

const isRectValid = (data: string[], pointA: Point, pointB: Point): boolean => {
  const minX = Math.min(pointA.x, pointB.x);
  const maxX = Math.max(pointA.x, pointB.x);
  const minY = Math.min(pointA.y, pointB.y);
  const maxY = Math.max(pointA.y, pointB.y);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (data[y][x] === EMPTY) return false;
    }
  }
  return true;
};
const EMPTY = ".";
const RED = "#";
const GREEN = "X";
const MARK = "O";

const paintRect = (data: string[], pointA: Point, pointB: Point): void => {
  const minX = Math.min(pointA.x, pointB.x);
  const maxX = Math.max(pointA.x, pointB.x);
  const minY = Math.min(pointA.y, pointB.y);
  const maxY = Math.max(pointA.y, pointB.y);

  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      data[y] = replaceChar(data[y], x, MARK);
    }
  }
};

function replaceChar(str: string, index: number, char: string) {
  // first, convert the string to an array
  const array = str.split("");

  // then, replace the character at the specified index
  array[index] = char;

  // finally, convert the array back to a string
  return array.join("");
}

const normalizePoints = (points: Point[]) => {
  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);

  const correctedValuesX = new Set(xValues.sort((a, b) => a - b));
  const correctedValuesY = new Set(yValues.sort((a, b) => a - b));

  const xValueToIndex: Map<number, number> = new Map<number, number>();
  const yValueToIndex: Map<number, number> = new Map<number, number>();
  const xIndexToValue: Map<number, number> = new Map<number, number>();
  const yIndexToValue: Map<number, number> = new Map<number, number>();

  Array.from(correctedValuesX).forEach((x, i) => {
    xIndexToValue.set(i, x);
    xValueToIndex.set(x, i);
  });

  Array.from(correctedValuesY).forEach((y, i) => {
    yIndexToValue.set(i, y);
    yValueToIndex.set(y, i);
  });

  return { xIndexToValue, xValueToIndex, yIndexToValue, yValueToIndex };
};

const main = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const lines = content.split("\n").filter(Boolean);

  const points = lines.map(parsePoint);
  console.log("points parsed", points.length);

  const { xIndexToValue, xValueToIndex, yIndexToValue, yValueToIndex } =
    normalizePoints(points);
  const maxX = Math.max(...Array.from(xIndexToValue.keys()));
  const maxY = Math.max(...Array.from(xIndexToValue.keys()));

  console.log("maxX: ", maxX);
  console.log("maxY: ", maxY);

  let emptyLine = "";
  for (let positionIndex = 0; positionIndex < maxX + 2; positionIndex++) {
    emptyLine = emptyLine.concat(EMPTY);
  }

  const data: string[] = [];
  // Init
  for (let lineIndex = 0; lineIndex < maxY + 2; lineIndex++) {
    data.push(emptyLine);
  }
  // Lay down carpet
  points.forEach((pointA, i) => {
    const pointB = points[i + 1] ?? points[0];

    const translatedA = {
      x: xValueToIndex.get(pointA.x) || 0,
      y: yValueToIndex.get(pointA.y) || 0,
    };

    const translatedB = {
      x: xValueToIndex.get(pointB.x) || 0,
      y: yValueToIndex.get(pointB.y) || 0,
    };

    const xDiff = translatedB.x - translatedA.x;
    const yDiff = translatedB.y - translatedA.y;
    let newX = translatedA.x;
    let newY = translatedA.y;
    data[newY] = replaceChar(data[translatedA.y], translatedA.x, RED);
    while (true) {
      newX = newX + Math.sign(xDiff);
      newY = newY + Math.sign(yDiff);
      if (newX === translatedB.x && newY === translatedB.y) break;
      data[newY] = replaceChar(data[newY], newX, RED);
    }
  });

  log(data);

  // const safePositionInside: Point = {
  //   x: 2,
  //   y:1,
  // };
   const safePositionInside: Point = {
    x: 150,
    y:200,
  };

  const flood = (position: Point): void => {
    const stack = [position];
    // check this position

    while (stack.length) {
      const item = stack.pop();

      if (!item || !data[item.y] || !data[item.y][item.x]) continue;
      if (data[item.y][item.x] === EMPTY) {
        data[item.y] = replaceChar(data[item.y], item.x, GREEN);

        // invoke on up
        stack.push({ ...item, y: item.y - 1 });

        // invoke on down
        stack.push({ ...item, y: item.y + 1 });

        // invoke on left
        stack.push({ ...item, x: item.x - 1 });

        // invoke on right
        stack.push({ ...item, x: item.x + 1 });
      }
    }
  };

  flood(safePositionInside);

  log(data);

  // get largest rect
  let largestArea = 0;
  let largestTranslatedPointA;
  let largestTranslatedPointB;
  let largestPointA;
  let largestPointB;
  
  
  points.forEach((pointA) => {
    points.forEach((pointB) => {
      const area = getArea(pointA, pointB);
      if (area > largestArea) {
        const translatedA = {
          x: xValueToIndex.get(pointA.x) || 0,
          y: yValueToIndex.get(pointA.y) || 0,
        };

        const translatedB = {
          x: xValueToIndex.get(pointB.x) || 0,
          y: yValueToIndex.get(pointB.y) || 0,
        };

        if (isRectValid(data, translatedA, translatedB)) {
          largestArea = area;
          largestTranslatedPointA = translatedA;
          largestTranslatedPointB = translatedB;
          largestPointA = pointA;
          largestPointB= pointB;
        }
      }
    });
  });

  console.log(largestArea, largestTranslatedPointA, largestTranslatedPointB);
  if (largestTranslatedPointA && largestTranslatedPointB) {
    paintRect(data, largestTranslatedPointA, largestTranslatedPointB);
  }
   log(data);
   console.log(largestArea, largestPointA, largestPointB)
};

main();
