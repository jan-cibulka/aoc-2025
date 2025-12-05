import * as fs from "fs";
import * as path from "path";

const EXAMPLE_FILE_NAME = "example_input.txt";

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

type Item = {
  end: string;
  start: string;
};

const getItem = (group: string): Item => {
  const split = group.lastIndexOf("-");
  const start = group.slice(0, split);
  const end = group.slice(split + 1);
  return { start, end };
};

const evalItem = (item: Item): number => {
  let result = 0;

  let baseString = item.start.slice(0, Math.floor(item.start.length / 2));
  while (true) {
    const candidateNumber = Number(`${baseString}${baseString}`);
    console.log("candidate", candidateNumber);
    if (
      candidateNumber >= Number(item.start) &&
      candidateNumber <= Number(item.end)
    ) {
      result += candidateNumber;
      console.log("ding", candidateNumber);
    }

    if (candidateNumber > Number(item.end)) {
      console.log("end", candidateNumber);
      break;
    }

    baseString = `${Number(baseString) + 1}`;
  }

  return result;
};

const main = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const items = content.split(",").map(getItem);

  let result = 0;
  items.forEach((item) => {
    result += evalItem(item);
  });
  console.log("xx", result);
};

const range = (start: number, stop: number, step: number) =>
  Array.from(
    { length: Math.ceil((stop - start) / step) },
    (_, i) => start + i * step
  );

const evaluateNumber = (input: number): boolean => {
  const inputString = String(input);
  const numberOfDigits = inputString.length;
  const evaluatedLengths = range(1, Math.floor(numberOfDigits / 2) + 1, 1);
  let foundPattern = false;
  evaluatedLengths.forEach((examinedLength) => {
    const patternString = String(input).slice(0, examinedLength);
    const segments = inputString.match(
      new RegExp(".{1," + examinedLength + "}", "g")
    );


    const isPattern = segments?.every((segment) => segment === patternString);
    if (isPattern) {
      console.log("ding!")
      foundPattern = true
      return;
    }
  });
  return foundPattern;
};

const main2 = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const items = content.split(",").map(getItem);
  let allNumbersInRanges = items.flatMap((item) =>
    range(Number(item.start), Number(item.end), 1)
  );

  console.log(allNumbersInRanges)
  

  const allPatternNumbers = allNumbersInRanges.filter(evaluateNumber);
  const result = allPatternNumbers.reduce((partialSum, a) => partialSum + a, 0);
  console.log(result)
};

main2();
