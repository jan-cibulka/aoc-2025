import * as fs from "fs";
import * as path from "path";

const EXAMPLE_FILE_NAME = "example_input.txt";

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

type Item = {
  batteries: number[];
};

const getItem = (input: string): Item => {
  return { batteries: input.split("").map(Number) };
};

const BATTERY_COUNT = 12;

const getMaxValue = (item: Item): number => {
  const batteryIndexes: number[] = [];
  const batteryValues: number[] = [];

  for (let i = 0; i < BATTERY_COUNT; i++) {
    let batteryValue = 0;
    let batteryIndex = batteryIndexes[batteryIndexes.length - 1] || 0;

    const remainingBatteryCount = BATTERY_COUNT - i;

    for (
      let j = batteryIndex + (i === 0 ? 0 : 1);
      j < item.batteries.length - remainingBatteryCount +1;
      j++
    ) {
      if (item.batteries[j] > batteryValue) {
        batteryValue = item.batteries[j];
        batteryIndex = j;
      }
    }

    batteryValues.push(batteryValue);
    batteryIndexes.push(batteryIndex);
  }

  const result = Number(batteryValues.join(""));

  return result;
};
const main = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const items = content.split("\n").map(getItem);

  const maxValues = items.map(getMaxValue);
  const sum = maxValues.reduce((prev, curr) => prev + curr, 0);
  console.log(sum);
};

const main2 = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const items = content.split("\n").map(getItem);

  const maxValues = items.map(getMaxValue);

  const sum = maxValues.reduce((prev, curr) => prev + curr, 0);
  console.log("sum", sum);
};

main2();
