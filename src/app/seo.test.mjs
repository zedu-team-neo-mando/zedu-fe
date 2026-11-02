import { test } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Register ESM loader hook to resolve '~/*' aliases in Node test runner
const srcBase = new URL('../', import.meta.url).href;
const loaderCode = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('~/')) {
    const rel = specifier.slice(2);
    const target = '${srcBase}' + rel + (rel.endsWith('.ts') ? '' : '.ts');
    return { shortCircuit: true, url: target };
  }
  return nextResolve(specifier, context);
}
`;
register('data:text/javascript,' + encodeURIComponent(loaderCode), import.meta.url);

process.env.NEXT_PUBLIC_CLIENT_URL = 'https://zedu.chat';

const { default: robots } = await import(new URL('./robots.ts', import.meta.url).href);
const { default: sitemap } = await import(new URL('./sitemap.ts', import.meta.url).href);

test('robots returns valid user-agent directives and sitemap URL', () => {
  const result = robots();
  assert.ok(result, 'robots() should return a configuration object');
  assert.ok(result.rules, 'robots() should include rules');

  const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
  assert.equal(rules.userAgent, '*');
  assert.equal(rules.allow, '/');
  assert.deepEqual(rules.disallow, ['/admin/', '/api/', '/auth/', '/login', '/signup']);
  assert.equal(result.sitemap, 'https://zedu.chat/sitemap.xml');
});

test('sitemap returns structured URL list with priorities and change frequencies', () => {
  const result = sitemap();
  assert.ok(Array.isArray(result), 'sitemap() should return an array of sitemap entries');
  assert.ok(result.length >= 30, 'sitemap() should index primary marketing, resource, solution and template pages');

  for (const entry of result) {
    assert.ok(typeof entry.url === 'string', 'each entry should have a string url');
    assert.ok(entry.priority >= 0 && entry.priority <= 1, 'priority must be between 0 and 1');
    assert.equal(entry.changeFrequency, 'weekly', 'changeFrequency should be weekly');
    assert.ok(!entry.url.includes('/auth/'), 'auth routes must be excluded');
    assert.ok(!entry.url.endsWith('/login'), 'login route must be excluded');
    assert.ok(!entry.url.endsWith('/signup'), 'signup route must be excluded');
  }

  const root = result.find((item) => item.url === 'https://zedu.chat');
  assert.ok(root, 'sitemap should include root URL');
  assert.equal(root.priority, 1.0);

  const pricing = result.find((item) => item.url === 'https://zedu.chat/pricing');
  assert.ok(pricing, 'sitemap should include pricing URL');
  assert.equal(pricing.priority, 0.9);
});
