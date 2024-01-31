import s from 'shelljs';
const config = require('./tsconfig.json');
const outDir = config.compilerOptions.outDir;


// Limpiar el directorio de salida
s.rm('-rf', outDir);

// Crear directorio de salida
s.mkdir(outDir);

// Copiar archivos y directorios específicos con rsync
s.exec(`rsync -a src/resources/ ${outDir}/resources/`);
s.cp('.env', `${outDir}/.env`);
