import s from 'shelljs';
import fs from 'fs';

const config = require('./tsconfig.json');
const outDir = config.compilerOptions.outDir;

s.rm('-rf', outDir);
s.mkdir(outDir);

if (fs.existsSync('.env')) {
  s.cp('.env', `${outDir}/.env`);
}

s.mkdir('-p', `${outDir}/common/swagger`);
s.cp('server/common/api.yml', `${outDir}/common/api.yml`);
