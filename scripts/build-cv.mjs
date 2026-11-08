// Generates public/cv.pdf from src/data.js at build time, so the static PDF always matches the site.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jsPDF } from 'jspdf';
import { buildDoc } from '../src/cv.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { doc } = buildDoc(jsPDF);
mkdirSync(resolve(root, 'public'), { recursive: true });
writeFileSync(resolve(root, 'public', 'cv.pdf'), Buffer.from(doc.output('arraybuffer')));
console.log('Wrote public/cv.pdf');
