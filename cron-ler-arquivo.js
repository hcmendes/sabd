const cron = require('node-cron');

function lerArquivo() {
  console.log('lendo arquivo')
}

// Schedule tasks to be run on the server.
cron.schedule('0 0 * * *', function() {
  console.log('running a task every day');
  lerArquivo();
});