const express = require('express');
const app = express();
const port = 3030;
const fs = require("fs");
const path = require('path');
const fastcsv = require("fast-csv");
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {

  fs.readdir('relatorios/', function(err, filenames) {
    if (err) {
      console.log('erro ao ler arquivos');
      return res.send(err);
    }

    let csvData = [];

    function lerArquivo(indice) {
      if (!filenames[indice]) {
        res.send(csvData);
        return; // ponto de parada
      }

      let stream = fs.createReadStream(path.resolve(__dirname, 'relatorios', filenames[indice]));

      let linhas = [];
      stream
        .pipe(fastcsv.parse())
        .on('error', error => {
          console.error(error)
          return res.send(error); // outro ponto de parada
        })
        .on("data", function (data) {
          linhas.push(data);
        })
        .on("end", function () {
          csvData.push({
            timestamp: Number(filenames[indice].split('.')[0]),
            dados: linhas
          });
          lerArquivo(indice + 1);
        });
    }

    lerArquivo(0);

  });

  
});

app.listen(port, () => {
  console.log(`app rodando na porta ${port}`)
});