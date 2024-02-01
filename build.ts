import s from 'shelljs';
const config = require('./tsconfig.json');
const outDir = config.compilerOptions.outDir;

s.rm('-rf', outDir);
s.mkdir(outDir);
// Copiar archivos y directorios específicos con rsync
s.exec(`rsync -a src/resources/ ${outDir}/resources/`);
s.cp('.env', `${outDir}/.env`);
