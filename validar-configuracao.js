require('dotenv').config();
const fs = require("fs");
const path = require('path');

if (!fs.existsSync(path.resolve(__dirname, '.env'))) {
  throw new Error('arquivo .env não encontrado');
}

if (!fs.existsSync(path.resolve(__dirname, 'dados.csv'))) {
  throw new Error(`arquivo "dados.csv" não encontrado`);
}

if (!process.env.DB_USER) throw new Error('variavel de amb. DB_USER nao definida no arquivo .env');
if (!process.env.DB_PASSWORD) throw new Error('variavel de amb. DB_PASSWORD nao definida no arquivo .env');
if (!process.env.DB_NAME) throw new Error('variavel de amb. DB_NAME nao definida no arquivo .env');
if (!process.env.CRON_EXPRESSION) throw new Error('variavel de amb. CRON_EXPRESSION nao definida no arquivo .env');
