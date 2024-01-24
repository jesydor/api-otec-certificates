import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'BASE_PATH',
  'PORT',
  'LOG_LEVEL',
];

requiredVariables.forEach(function(envVariable) {
  if (!process.env[envVariable]) {
    throw new Error(`The env variables ${envVariable} is not set`);
  }
});
