require('./validar-configuracao');
const cron = require('node-cron');
const lerArquivo = require('./ler-arquivo');

console.log('cron iniciado');
// Schedule tasks to be run on the server.
cron.schedule(process.env.CRON_EXPRESSION, function() {
  lerArquivo();
});