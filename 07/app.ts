import * as fs from "fs";
import * as path from "path";

const EXAMPLE_FILE_NAME = "example_input.txt";

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

const log = (arg: unknown) => console.log(JSON.stringify(arg, undefined, 2));

const DOT = ".";
const PRISM = "^";
const START = "S";
const BEAM = "|";

const main = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const lines = content.split("\n").filter(Boolean)
  log(lines);

  // if you are a dot and there is a beam,start above you, lit yourself.
  // if you are a prism and there is a beam,start above you, lit the neighbor positions.
  for (let lineIndex = 1; lineIndex < lines.length; lineIndex++) {
    for (
      let positionIndex = 0;
      positionIndex < lines[lineIndex].length;
      positionIndex++
    ) {
      const char = lines[lineIndex][positionIndex];

      if (char === DOT) {
        if ([BEAM, START].includes(lines[lineIndex - 1][positionIndex])) {
          lines[lineIndex] =
            lines[lineIndex].slice(0, positionIndex) +
            BEAM +
            lines[lineIndex].slice(positionIndex + 1);
        }
      }

      if (char === PRISM) {
        if ([BEAM, START].includes(lines[lineIndex - 1][positionIndex])) {
          if (positionIndex) {
            lines[lineIndex] =
              lines[lineIndex].slice(0, positionIndex - 1) +
              BEAM +
              lines[lineIndex].slice(positionIndex);
          }

          if (positionIndex < lines[lineIndex].length - 1) {
            lines[lineIndex] =
              lines[lineIndex].slice(0, positionIndex + 1) +
              BEAM +
              lines[lineIndex].slice(positionIndex + 2);
          }
        }
      }
    }
  }
  log(lines);

  // Util: Evaluate prism score.
  // Take a prism. Initiate sum at 0. While the position above is not DOT, take position above and add possible adjacent prism values to sum.
  // Store result in structure.

  const getPrismId = (lineIndex: number, positionIndex: number) =>
    `${lineIndex}-${positionIndex}`;

  const prismScoreStore: Record<string, number> = {};

  const evaluatePosition = (
    lineIndex: number,
    positionIndex: number,
    lines: string[]
  ) => {
    let adjustedLineIndex = 1;
    let sum = 0;
    while (true) {
      const centerChar = lines[lineIndex - adjustedLineIndex][positionIndex];
    
      if (centerChar === START) {
        prismScoreStore[getPrismId(lineIndex, positionIndex)] = 1;
        return;
      }
      if (centerChar !== BEAM) {
        break;
      }

      const leftChar = lines[lineIndex - adjustedLineIndex][positionIndex - 1];
      const rightChar = lines[lineIndex - adjustedLineIndex][positionIndex + 1];

      if (leftChar === PRISM) {
        const score =
          prismScoreStore[
            getPrismId(lineIndex - adjustedLineIndex, positionIndex - 1)
          ];
        sum += score;
      }
      if (rightChar === PRISM) {
        const score =
          prismScoreStore[
            getPrismId(lineIndex - adjustedLineIndex, positionIndex + 1)
          ];
        sum += score;
      }
      adjustedLineIndex = adjustedLineIndex + 1;
    }
    console.log
    prismScoreStore[getPrismId(lineIndex, positionIndex)] = sum;
  };

  // Part 2.
  // Part A. Evaluate Prisms
  // Go over every line from start and evaluate score for every prism.

  for (let lineIndex = 2; lineIndex < lines.length; lineIndex++) {
    for (
      let positionIndex = 0;
      positionIndex < lines[lineIndex].length;
      positionIndex++
    ) {
      evaluatePosition(lineIndex, positionIndex, lines);
    }
  }


  // Part B. Evaluate Path Ends
  // At the last line, change all BEAMS to PRISMs and evaluate them and sum them up.
  let result = 0

  const lastLineIndex = lines.length;
  const lastLinePositions = lines[lines.length-1].length;
  for(let lastLinePositionIndex = 0;lastLinePositionIndex<lastLinePositions; lastLinePositionIndex++ ){


    const score = prismScoreStore[getPrismId(lastLineIndex-1, lastLinePositionIndex)];
   result += score;
  }
  console.log(result)
};

main();

//   ".......1.......",
//   ".......|.......",
//   "......|1|......",
//   "......|.|......",
//   ".....|1|1|.....",
//   ".....|.|.|.....",
//   "....|1|2|1|....",
//   "....|.|.|.|....",
//   "...|1|3|||1|...",
//   "...|.|.|||.|...",
//   "..|1|4|||1|1|..",
//   "..|.|.|||.|.|..",
//   ".|1|||4||.||1|.",
//   ".|.|||.||.||.|.",
//   "|1|1|4|7|0|||1|",
//   "|.|.|.|.|.|||.|"
// 1 2 10 11 11 2 1 1 1 = 40
