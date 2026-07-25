const fs = require('fs');
const path = require('path');

const VAULT_ROOT =
  process.env.LUMEN_OBSIDIAN_VAULT ?? "C:\\Users\\fabri\\Desktop\\L'Éclat et l'Ombre";
const DEST_ROOT = path.join(__dirname, '..', 'src', 'app', 'data');
const FOLDERS = ['Canvas from 12 07 26', 'FRAGMENTS'];

let hadError = false;

for (const folder of FOLDERS) {
  const source = path.join(VAULT_ROOT, folder);
  const dest = path.join(DEST_ROOT, folder);

  if (!fs.existsSync(source)) {
    console.error(`✖ Introuvable côté vault Obsidian : ${source}`);
    hadError = true;
    continue;
  }

  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(source, dest, { recursive: true });
  console.log(`✔ Synchronisé : ${folder}`);
}

if (hadError) {
  process.exitCode = 1;
}
