const dotenv = require('dotenv');
dotenv.config();

export interface Environments {
  development: Config;
}

export interface Config {
  exampleEnvSpecificURL: string;
  logLevel: string;
}

const development: Config = {
  exampleEnvSpecificURL: 'https://some-url.com',
  logLevel: 'debug'
}

export const environment: Environments = {
  development,
};