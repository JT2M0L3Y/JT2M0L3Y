import { promises as fs } from "fs";

const main = async () => {
  const readmeTemp = (await fs.readFile('README.template.md')).toString("utf-8");

  // Fetch a random quote
  const quote = await fetch("https://zenquotes.io/api/random/")
    .then(res => res.json())
    .then(data => ({
      content: data[0].q,
      author: data[0].a
    }))
    .catch(e => console.error(e.message));

  // Build the README
  const readme = readmeTemp
    .replace("{quote}", quote.content)
    .replace("{author}", quote.author);

  await fs.writeFile("README.md", readme);
};

main()
