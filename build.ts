import s from 'shelljs';
const config = require('./tsconfig.json');
const outDir = config.compilerOptions.outDir;

// Elimina el directorio de salida existente
s.rm('-rf', outDir);

// Crea el directorio de salida
s.mkdir(outDir);

// Copia los archivos y directorios desde src/resources a dist/resources
s.cp('-r', 'src/resources/*', `${outDir}/resources/`);

// Copia el archivo .env al directorio de salida
s.cp('.env', `${outDir}/.env`);
