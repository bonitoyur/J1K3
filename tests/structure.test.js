import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { mountains } from '../src/data/mountains.js';
import { regionMaps } from '../src/data/region-maps.js';
import { validateVisit } from '../src/features/visit-model.js';

test('103 unique mountain IDs, Firebase rules and regional markers agree', () => {
  assert.equal(mountains.length, 103);
  assert.equal(new Set(mountains.map(m => m.id)).size, 103);
  assert.equal(mountains.filter(m => !m.isAdditional).length, 100);
  assert.deepEqual(mountains.slice(100).map(m => m.id), ['taegisan', 'inwangsan', 'bugaksan']);
  const rules = fs.readFileSync('firebase/firestore.rules', 'utf8');
  const nationalPattern = new RegExp('^' + rules.match(/id\.matches\('([^']+)'\)/)[1] + '$');
  for (const mountain of mountains) {
    assert.ok(rules.includes(`'${mountain.id}'`) || nationalPattern.test(mountain.id), mountain.id);
    if (mountain.group !== '수도권') assert.ok(regionMaps[mountain.group].points.some(p => p[0] === mountain.name), mountain.name);
  }
  assert.equal(nationalPattern.test('national-000'), false);
  assert.equal(nationalPattern.test('national-086'), false);
});

test('templates have unique IDs and cover feature DOM bindings', () => {
  const html = fs.readFileSync('index.html', 'utf8') + fs.readdirSync('src/templates').map(name => fs.readFileSync(`src/templates/${name}`, 'utf8')).join('');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size);
  const code = ['explorer', 'visits'].map(name => fs.readFileSync(`src/features/${name}.js`, 'utf8')).join('');
  for (const match of code.matchAll(/(?:el|byId)\('([^']+)'\)/g)) assert.ok(ids.includes(match[1]), match[1]);
});

test('visit validation rejects impossible dates, future dates and whitespace', () => {
  const valid = { visited_on: '2026-01-01', author: '나', comment: '좋았어요' };
  assert.equal(validateVisit(valid), '');
  for (const visited_on of ['2026-02-30', '2999-01-01', '', '2026-1-1']) assert.ok(validateVisit({ ...valid, visited_on }));
  assert.ok(validateVisit({ ...valid, author: '   ' }));
});
