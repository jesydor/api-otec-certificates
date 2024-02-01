import pino from 'pino';

export const loggerPino = pino({
  name: process.env.APP_ID || 'api-certificates',
  level: process.env.LOG_LEVEL || 'info',
});
