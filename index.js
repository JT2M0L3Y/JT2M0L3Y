require("isomorphic-unfetch");
const { promises: fs } = require("fs");
const path = require("path");

async function main() {
  const readmeTemplate = (
    await fs.readFile(path.join(process.cwd(), "./README.template.md"))
  ).toString("utf-8");
  
  const quote_data = await (
    await fetch("https://zenquotes.io/api/quotes/")
  ).json();
  
  const readme = readmeTemplate
    .replace("{quote}", quote_data.q)
    .replace("{author}", `- ${quote_data.a}`)
  
  await fs.writeFile("README.md", readme);
}

main();