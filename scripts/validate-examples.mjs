import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import { glob } from "glob";

const schema = JSON.parse(await readFile("schema/rpf.schema.json", "utf8"));
const ajv = new Ajv2020({ allErrors: true });
const validate = ajv.compile(schema);
const examples = await glob("examples/**/*.json");

if (examples.length === 0) {
  throw new Error("No JSON examples found.");
}

let invalid = false;
for (const file of examples) {
  const example = JSON.parse(await readFile(file, "utf8"));
  if (!validate(example)) {
    invalid = true;
    console.error(`${file}: ${ajv.errorsText(validate.errors)}`);
  } else {
    console.log(`${file}: valid`);
  }
}

if (invalid) {
  process.exitCode = 1;
}
