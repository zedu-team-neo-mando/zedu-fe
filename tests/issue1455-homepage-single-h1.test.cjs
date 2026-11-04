const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const homepageDir = path.join(__dirname, "..", "src", "app", "(homepage)");
const pageSource = fs.readFileSync(path.join(homepageDir, "page.tsx"), "utf8");

// Every section the homepage renders, taken from its own imports so a new
// section is covered automatically.
const sectionFiles = [
  ...pageSource.matchAll(/from "\.\/(_components\/[^"]+)"/g),
]
  .map((match) => path.join(homepageDir, `${match[1]}.tsx`))
  .filter((file) => fs.existsSync(file));

assert.ok(sectionFiles.length >= 5, "homepage sections not found");

const h1Tags = (source) => source.match(/<h1[\s>]/g) || [];

test("the homepage renders exactly one h1, the hero heading", () => {
  const h1Files = sectionFiles.filter(
    (file) => h1Tags(fs.readFileSync(file, "utf8")).length > 0
  );
  assert.deepEqual(
    h1Files.map((file) => path.basename(file)),
    ["Herosection.tsx"]
  );
  const hero = fs.readFileSync(
    path.join(homepageDir, "_components", "home", "Herosection.tsx"),
    "utf8"
  );
  assert.equal(h1Tags(hero).length, 1);
});

test("the articles section heading is a level-2 heading with its styles", () => {
  const articles = fs.readFileSync(
    path.join(homepageDir, "_components", "home", "ArticlesSection.tsx"),
    "utf8"
  );
  assert.equal(h1Tags(articles).length, 0);
  assert.match(
    articles,
    /<h2 className="[^"]*text-2xl font-semibold[^"]*">\s*The Platform for Every Type of Learning\s*<\/h2>/
  );
});
