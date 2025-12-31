import * as fs from "fs";
import * as path from "path";

const EXAMPLE_FILE_NAME = "example_input.txt";

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

const main = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const lines = content.split("\n");
  const cells = lines
    .map((line) => line.split(" ").filter((s) => s !== ""))
    .filter((a) => a.length)
    .reverse();

  let result = 0;
  cells[0].forEach((sig, i) => {
    const item = cells
      .map((line) => line[i])
      .filter(Number)
      .reduce(
        (acc, number) => {
          return sig === "+" ? acc + Number(number) : acc * Number(number);
        },
        sig === "+" ? 0 : 1
      );
    result += item;
  });
  console.log(result);
};

const main2 = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const lines = content.split("\n");
  const sigLine = lines[lines.length - 1];
  const sigSegments = sigLine.split(/(?=[+*])/);
  console.log(sigSegments);

  let lenOffset = 0;
  let total = 0;
  sigSegments.forEach((val, i) => {
    const segLength = val.length;
    const sig = val[0];

    const lineValue = [];
    for (let lineIndex = 0; lineIndex < lines.length - 1; lineIndex++) {
      lineValue.push(lines[lineIndex].slice(lenOffset, lenOffset + segLength ));
    }
    lenOffset += segLength;

    const transposedNumbers: number[] = [];

    for (let position = 0; position < segLength; position++) {
      const number = lineValue.reduce((acc, val) => {
        if (val[position] !== " ") {
          return acc + val[position];
        }
        return acc;
      }, "");
      if (Boolean(number)) {
        transposedNumbers.push(Number(number));
      }
    }

    console.log(lineValue,transposedNumbers)

    const product = transposedNumbers.reduce((acc, curr) => {
      return sig === "+" ? acc + curr : acc * curr;
    }, sig === "+" ? 0: 1);
 
    total += product;
  });
  console.log(total);
};
main2();
