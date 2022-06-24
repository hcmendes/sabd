## Descrição

Backend do sabd

## Programas necessários

Certifique-se de ter instalado os programas

- node v16.15.1
- npm 8.11.0
- mysql 5.7.32

## Preparando o ambiente

- crie uma cópia do arquivo `.env.example` e salve com o nome `.env`. Preencha o arquivo com as credenciais de conexão com o mysql e com a expressão cron desejada

- atualize o arquivo `dados.csv` com os contratos a serem inseridos na base

- instale as dependências com o comando `npm install`

## Executando o cron

Execute o comando `node cron-ler-arquivo`

## Forçar processamento

Para processar o `dados.csv` imediatamente, execute `node ler-arquivo-agora`

## Executando o web server

O web server precisa ser executado para que o frontend da aplicação funcione. 
Para rodar o webserver, execute o comando `node iniciar-express.js`