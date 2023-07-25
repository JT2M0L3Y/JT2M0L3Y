require("isomorphic-unfetch");
const { promises: fs } = require("fs");
const path = require("path");

async function main() {
  const readmeTemplate = (
    await fs.readFile(path.join(process.cwd(), "./README.template.md"))
  ).toString("utf-8");
  
  const quote_data = await (
    await fetch("https://zenquotes.io/api/random/")
       .catch (error => { console.log("Fetch failed"); })
  ).json()
   .catch (error => { console.log("Get data failed"); });

  const readme = readmeTemplate
    .replace("{quote}", quote_data[0].q)
    .replace("{author}", quote_data[0].a)
  
  await fs
    .writeFile("README.md", readme)
    .catch (error => { console.log("Write file failed"); });
}

main();