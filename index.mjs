// import "isomorphic-unfetch";
import { promises as fs } from "fs";
import { join } from "path";

async function main() {
  const readmeTemplate = (
    await fs.readFile(join(process.cwd(), "./README.template.md"))
  ).toString("utf-8");

  const quote_data = await (
    await fetch("https://zenquotes.io/api/random/")
  ).json()
    .catch((e) => { console.error(e.message); });

  const readme = readmeTemplate
    .replace("{quote}", quote_data[0].q)
    .replace("{author}", quote_data[0].a)

  await fs.writeFile("README.md", readme);
};

main().then((res) => console.log(res));
