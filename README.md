# Rinha de Backend - 2024/Q1

Projeto desenvolvido para o rinha de backend 2024 Q1 utilizando boas práticas de desenvolvimento e arquitetura de software como DDD, TDD, SOLID, Clean Code, Clean Architecture e etc.

## Stack Utilizada
- [`Node.js`](https://nodejs.org) - Plataforma de desenvolvimento
- [`TypeScript`](https://www.typescriptlang.org)
- [`Fastify`](https://fastify.dev) - Framework (API)
- [`Jest`](https://jestjs.io) - Testes
- [`Nginx`](https://www.nginx.com) - Servidor Web/Load Balancer
- [`Postgres`](https://www.postgresql.org) - Database
- [`@Databases`](https://www.atdatabases.org) - Database library

## Resultado
<img src="stress_test_result.png" width="60%" alt="Resultado do stress test">

## Instruções
Execute o comando abaixo para iniciar o projeto:
```
docker compose up
```

Execute o comando abaixo para obter o extrato de um cliente:
```
curl --location 'http://localhost:9999/clientes/1/extrato'
```

Resposta:
```json
{
    "saldo": {
        "total": 0,
        "data_extrato": "2024-02-28T03:11:22.573Z",
        "limite": 100000
    },
    "ultimas_transacoes": []
}
```

Execute o comando abaixo para criar uma nova transação (d - débito, c - crédito):
```
curl --location 'http://localhost:9999/clientes/1/transacoes' \
--header 'Content-Type: application/json' \
--data '{
    "valor": 3,
    "tipo": "d",
    "descricao": "asdasd"
}'
```

Resposta:
```json
{
    "saldo": -90219,
    "limite": 100000
}
```
