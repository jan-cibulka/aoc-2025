import * as fs from "fs";
import * as path from "path";

const EXAMPLE_FILE_NAME = "example_input.txt";

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

type Interval = { min: number; max: number };

const parseInterval = (intervalRaw: string): Interval => {
  const [min, max] = intervalRaw.split("-");
  return { min: Number(min), max: Number(max) };
};

const isInInterval =(value: number, interval: Interval) => value >= interval.min && value <= interval.max;

const main = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const lines = content.split("\n");
  const emptyLineIndex = lines.indexOf("");
  const intervalsRaw = lines.slice(0, emptyLineIndex);
  const targets = lines.slice(emptyLineIndex + 1, lines.length).map(Number)


  const intervals = intervalsRaw.map(parseInterval)
const intervalsSorted = intervals.sort((a,b) => a.min-b.min);

  console.log(lines);
  console.log(intervalsSorted);
  console.log(targets);


};
console.clear();
main();
