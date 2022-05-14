# logistics-app

A client - server application for managing logistics

## Makefile

Most of the commands can be runned with a makefile. Get list of available commands by running `make help`

## Server

### Local Installation

For this repo to setup, you need to have bazel, go, docker-compose and gazelle preinstalled.

1. Clone this repo
2. Export environment variables, which are listed in `.env.template`
3. Run `make server`
4. If everything is fine, all apis will be available on the respective ports, use `/health` endpoints to check it
5. Run migrations for db `make migrate`
6. If needed, populate db with test data `make db-populate`
### Shutting down server

To shut server down, run `make shutdown`
