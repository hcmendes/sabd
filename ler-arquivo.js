const fs = require("fs");
const path = require('path');
const mysql = require("mysql");
const fastcsv = require("fast-csv");

module.exports = function lerArquivo() {
  console.log('*** INÍCIO: lendo arquivo ***');
  let stream = fs.createReadStream(path.resolve(__dirname, 'dados.csv'));
  let csvData = [];
  stream
    .pipe(fastcsv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on("data", function (data) {
      csvData.push(data);
    })
    .on("end", function () {
      // create a new connection to the database
      const connection = mysql.createConnection({
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        // database: process.env.DB_NAME
      });

      // open the connection
      connection.connect(error => {
        if (error) {
          console.error(error);
          return;
        }

        iniciar();

        function iniciar() {
          const criar = 'CREATE DATABASE IF NOT EXISTS sabd;';
          connection.query(criar, (error) => {
            if (error) {
              console.error(error);
              return;
            }

            conectarBase();
          });
        }

        function conectarBase() {
          const conectar = 'USE sabd;';
          connection.query(conectar, (error) => {
            if (error) {
              console.error(error);
              return;
            }

            criarTabela();
          });
        }

        function criarTabela() {
          const create = 'CREATE TABLE IF NOT EXISTS contratos (nome_beneficiario VARCHAR(255), tipo_pessoa_beneficiario VARCHAR(255), cpf_cnpj_beneficiario VARCHAR(255), cod_susep VARCHAR(255), cod_ramo_seguro VARCHAR(255), ag_contratacao_seguro VARCHAR(255), num_proposta_seguro VARCHAR(255) NOT NULL PRIMARY KEY, dt_efetiv_proposta_seguro DATETIME, dt_ini_vig_seguro DATETIME, dt_fim_vig_seguro DATETIME, dt_cancelamento_seguro DATETIME, num_apolice VARCHAR(255), num_apolice_renovada VARCHAR(255), dt_emissao_apolice_seguro DATETIME, num_endosso_seguro VARCHAR(255), dt_emissao_endosso_seguro DATETIME, cod_motivo_endosso VARCHAR(255), func_vendedor VARCHAR(255), valor_parcela DECIMAL(10, 2), dt_vencimento DATETIME, qtde_parcelas INT);';
          connection.query(create, (error) => {
            if (error) {
              console.error(error);
              return;
            }

            atualizarDb();
          });
        }

        function atualizarDb() {

          let inserts = [];
          let updates = [];
          csvData.map((linha, index) => {

            if (linha.acao === 'i') {
              inserirDados(linha, inserts);
            } else if (linha.acao === 'a') {
              atualizarDados(linha, updates);
            } else {
              throw new Error(`coluna "acao" inválida na linha ${index + 1}`);
            }
          });

          function realizarInserts(indice) {
            if (!inserts[indice]) {
              console.log(`base atualizada com sucesso. ${inserts.length} novas linhas inseridas.`);
              return; // ponto de parada
            }

            connection.query(inserts[indice].statement, inserts[indice].values, (error, response) => {
              if (error) {
                console.log(`erro ao inserir linha ${indice + 1}`);
                console.error(error);
              }

              realizarInserts(indice + 1);
            });
          }

          realizarInserts(0);

          function realizarUpdates(indice) {
            if (!updates[indice]) {
              console.log(`base atualizada com sucesso. ${updates.length} linhas existentes atualizadas.`);
              console.log('*** FIM: lendo arquivo ***');
              salvarArquivo();
              return; // ponto de parada
            }

            connection.query(updates[indice].statement, updates[indice].values, (error, response) => {
              if (error) {
                console.log(`erro ao atualizar linha ${indice + 1}`);
                console.error(error);
              }

              realizarUpdates(indice + 1);
            });
          }

          realizarUpdates(0);

          function salvarArquivo() {
            const stream = fastcsv.format();
            stream.pipe(fs.createWriteStream(`relatorios/${Date.now()}.csv`));

            stream.write(['acao', 'nome_beneficiario', 'tipo_pessoa_beneficiario', 'cpf_cnpj_beneficiario', 'cod_susep', 'cod_ramo_seguro', 'ag_contratacao_seguro', 'num_proposta_seguro', 'dt_efetiv_proposta_seguro', 'dt_ini_vig_seguro', 'dt_fim_vig_seguro', 'dt_cancelamento_seguro', 'num_apolice', 'num_apolice_renovada', 'dt_emissao_apolice_seguro', 'num_endosso_seguro', 'dt_emissao_endosso_seguro', 'cod_motivo_endosso', 'func_vendedor', 'valor_parcela', 'dt_vencimento', 'qtde_parcelas']);
            csvData.map(c => stream.write(c));
            stream.end();
          }
        }

        function inserirDados(linha, inserts) {
          const insert = {
            statement: 'INSERT INTO contratos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
            values: [
              linha.nome_beneficiario,
              linha.tipo_pessoa_beneficiario,
              linha.cpf_cnpj_beneficiario,
              linha.cod_susep,
              linha.cod_ramo_seguro,
              linha.ag_contratacao_seguro,
              linha.num_proposta_seguro,
              linha.dt_efetiv_proposta_seguro,
              linha.dt_ini_vig_seguro,
              linha.dt_fim_vig_seguro,
              linha.dt_cancelamento_seguro,
              linha.num_apolice,
              linha.num_apolice_renovada,
              linha.dt_emissao_apolice_seguro,
              linha.num_endosso_seguro,
              linha.dt_emissao_endosso_seguro,
              linha.cod_motivo_endosso,
              linha.func_vendedor,
              linha.valor_parcela,
              linha.dt_vencimento,
              linha.qtde_parcelas
            ]
          };
          insert.values = insert.values.map(v => {
            if (v === '') return null;
            return v;
          });
          inserts.push(insert);
        }

        function atualizarDados(linha, updates) {
          const update = {
            statement: `UPDATE contratos SET nome_beneficiario = ?,tipo_pessoa_beneficiario = ?,cpf_cnpj_beneficiario = ?,cod_susep = ?,cod_ramo_seguro = ?,ag_contratacao_seguro = ?,dt_efetiv_proposta_seguro = ?,dt_ini_vig_seguro = ?,dt_fim_vig_seguro = ?,dt_cancelamento_seguro = ?,num_apolice = ?,num_apolice_renovada = ?,dt_emissao_apolice_seguro = ?,num_endosso_seguro = ?,dt_emissao_endosso_seguro = ?,cod_motivo_endosso = ?,func_vendedor = ?,valor_parcela = ?,dt_vencimento = ?,qtde_parcelas = ? WHERE num_proposta_seguro = ?`,
            values: [
              linha.nome_beneficiario,
              linha.tipo_pessoa_beneficiario,
              linha.cpf_cnpj_beneficiario,
              linha.cod_susep,
              linha.cod_ramo_seguro,
              linha.ag_contratacao_seguro,
              linha.dt_efetiv_proposta_seguro,
              linha.dt_ini_vig_seguro,
              linha.dt_fim_vig_seguro,
              linha.dt_cancelamento_seguro,
              linha.num_apolice,
              linha.num_apolice_renovada,
              linha.dt_emissao_apolice_seguro,
              linha.num_endosso_seguro,
              linha.dt_emissao_endosso_seguro,
              linha.cod_motivo_endosso,
              linha.func_vendedor,
              linha.valor_parcela,
              linha.dt_vencimento,
              linha.qtde_parcelas,
              linha.num_proposta_seguro
            ]
          };
          update.values = update.values.map(v => {
            if (v === '') return null;
            return v;
          });
          updates.push(update);
        }

      });
    });
}