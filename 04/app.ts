import * as fs from "fs";
import * as path from "path";

const EXAMPLE_FILE_NAME = "example_input.txt";

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

const EMPTY = ".";
const FULL = "@";

const countFullNeighbours = (
  data: string[],
  lineIndex: number,
  position: number
): number => {
  let count = 0;
  if (data[lineIndex - 1]?.[position + 1] === FULL) {
    count++;
  }
  if (data[lineIndex - 1]?.[position] === FULL) {
    count++;
  }

  if (data[lineIndex - 1]?.[position - 1] === FULL) {
    count++;
  }

  if (data[lineIndex]?.[position + 1] === FULL) {
    count++;
  }
  if (data[lineIndex]?.[position - 1] === FULL) {
    count++;
  }

  if (data[lineIndex + 1]?.[position + 1] === FULL) {
    count++;
  }
  if (data[lineIndex + 1]?.[position] === FULL) {
    count++;
  }
  if (data[lineIndex + 1]?.[position - 1] === FULL) {
    count++;
  }

  return count;
};
const main = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const data = content.split("\n");

  const lineCount = data.length;
  const positionCount = data[0].length;
  let changeCounter = 0;

  let didChange = true;
  while (didChange) {
    didChange = false;
    for (let line = 0; line < lineCount; line++) {
      for (let position = 0; position < positionCount; position++) {
        const value = data[line][position];
        if (value === EMPTY) continue;
        const neighbors = countFullNeighbours(data, line, position);

        if (neighbors < 4) {
          didChange= true;
          const newLine =
            data[line].substring(0, position) +
            EMPTY +
            data[line].substring(position + 1);
          data[line] = newLine;
          changeCounter++;
        }
      }
    }
  }

  console.log(changeCounter);
};
console.clear();
main();
