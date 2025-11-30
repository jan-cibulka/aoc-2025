import * as fs from "fs";
import * as path from "path";

const EXAMPLE_FILE_NAME = "example_input.txt";

function readFileContent(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, filename), "utf-8");
}

const main = () => {
  const content = readFileContent(EXAMPLE_FILE_NAME);
  const lines = content.split("\n");

  console.log("lines", lines)
 
};

main();
