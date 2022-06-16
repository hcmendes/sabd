## Programas necessários

Certifique-se de ter instalado os programas

- node v16.15.1
- npm 8.11.0
- mysql 5.7.32

## Preparando o ambiente

- crie uma cópia do arquivo `.env.example` e salve com o nome `.env`. Preencha o arquivo com as credenciais de conexão com o mysql e com a expressão cron desejada

- atualize o arquivo `dados.csv` com os contratos a serem inseridos na base

## Executando o cron

- instale as dependências com o comando `npm install`

- execute o comando `node cron-ler-arquivo`

## Forçar processamento

Para processar o `dados.csv` imediatamente, execute `node ler-arquivo-agora`

## A Fazer

- definir estratégia de logs
- salvar relatório de inconsistências