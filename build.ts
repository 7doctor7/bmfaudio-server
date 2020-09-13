import s from 'shelljs';
import fs from 'fs';

import * as config from './tsconfig.json';

const dev = fs.existsSync('.env');
const { outDir } = config.compilerOptions;

s.rm('-rf', outDir);
s.mkdir(outDir);

if (dev) {
  s.cp('.env', `${outDir}/.env`);
}

s.mkdir('-p', `${outDir}/common/swagger`);
s.cp('server/common/api.yml', `${outDir}/common/api.yml`);
