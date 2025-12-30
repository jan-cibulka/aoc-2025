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

const isInInterval = (value: number, interval: Interval) =>
  value >= interval.min && value <= interval.max;

const main = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const lines = content.split("\n");
  const emptyLineIndex = lines.indexOf("");
  const intervalsRaw = lines.slice(0, emptyLineIndex);
  const targets = lines.slice(emptyLineIndex + 1, lines.length).map(Number);

  const intervals = intervalsRaw.map(parseInterval);
  let intervalsSorted = intervals.sort((a, b) => a.min - b.min);
  let result = 0;

  for (let targetIndex = 0; targetIndex < targets.length; targetIndex++) {
    const targetValue = targets[targetIndex];

    for (
      let intervalIndex = 0;
      intervalIndex < intervalsSorted.length;
      intervalIndex++
    ) {
      const intervalValue = intervalsSorted[intervalIndex];
      if (isInInterval(targetValue, intervalsSorted[intervalIndex])) {
        result++;
        break;
      }
      // if (targetValue > intervalValue.max) {
      //   intervalsSorted = intervalsSorted.filter(
      //     (interval) => interval !== intervalValue
      //   );
      // }
    }
  }

  console.log(result);
};

const main2 = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const lines = content.split("\n");
  let intervals = lines.map(parseInterval).sort((a, b) => a.min - b.min);
  let index = 0;
  while (true) {
    let currentInterval = intervals[index];
    let nextInterval = intervals[index + 1];

    console.log("checking", index, intervals, currentInterval, nextInterval);

    if (!nextInterval) break;

    // check if we can merge
    if (currentInterval.max >= nextInterval.min) {
      console.log("merging", currentInterval, nextInterval);
      intervals = [
        ...intervals.slice(0, index),
        {
          min: Math.min(currentInterval.min, nextInterval.min),
          max: Math.max(nextInterval.max, currentInterval.max),
        },
        ...intervals.slice(index + 2),
      ];

      continue;
    }

    index++;
  }

  const result = intervals
    .map((i) => i.max - i.min +1)
    .reduce((acc, val) => {
      return acc + val;
    }, 0);
  console.log(intervals);
  console.log(result);
};
main2();
