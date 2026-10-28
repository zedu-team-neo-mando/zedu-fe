import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { loadBindings, transform } from "next/dist/build/swc/index.js";

await loadBindings();

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("~/")) {
    return {
      shortCircuit: true,
      url: new URL(`../../../src/${specifier.slice(2)}.ts`, import.meta.url)
        .href,
    };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (!url.endsWith(".ts")) return nextLoad(url, context);

  const output = await transform(await readFile(new URL(url), "utf8"), {
    filename: fileURLToPath(url),
    jsc: { parser: { syntax: "typescript" }, target: "es2022" },
    module: { type: "es6" },
  });
  return { format: "module", shortCircuit: true, source: output.code };
}
