import s from 'shelljs';
const config = require('./tsconfig.json');
const outDir = config.compilerOptions.outDir;

// Elimina el directorio de salida existente
s.rm('-rf', outDir);

// Crea el directorio de salida
s.mkdir(outDir);

// Utiliza cp recursivo para copiar todos los archivos y directorios desde src/resources a dist/resources
s.cp('-R', 'src/resources/', `${outDir}/`);

// Copia el archivo .env al directorio de salida
s.cp('.env', `${outDir}/.env`);
