// Copies the ONNX Runtime Web WebAssembly files into public/ort/ so the site can serve them itself.
// Runs automatically before `npm run dev` and `npm run build`.
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const from = 'node_modules/onnxruntime-web/dist';
const to = 'public/ort';

if (!existsSync(from)) {
  console.warn('[prepare-ai] onnxruntime-web is not installed. Run "npm install" first.');
  process.exit(0);
}
mkdirSync(to, { recursive: true });
const wanted = readdirSync(from).filter(
  (f) => /^ort-wasm-simd-threaded(\.mjs|\.wasm)$/.test(f),
);
if (!wanted.length) console.warn('[prepare-ai] No ort-wasm-simd-threaded files found in ' + from);
for (const f of wanted) {
  cpSync(join(from, f), join(to, f));
  console.log(`[prepare-ai] ${f} (${(statSync(join(to, f)).size / 1048576).toFixed(1)} MB)`);
}
if (!existsSync('public/models/u2netp.onnx')) {
  console.warn('[prepare-ai] public/models/u2netp.onnx is missing. The AI method will not work until you add it (see README).');
}
