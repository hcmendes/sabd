const cron = require('node-cron');
const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("teste.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123456",
      database: "testdb"
    });

    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        let query =
          "INSERT INTO TABLE_NAME (id, name, description, created_at) VALUES ?";
        connection.query(query, [csvData], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });

function lerArquivo() {
  console.log('lendo arquivo');
  stream.pipe(csvStream);
}

// Schedule tasks to be run on the server.
cron.schedule('0 0 * * *', function() {
  console.log('running a task every day');
  lerArquivo();
});