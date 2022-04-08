MODULE = $(shell go list -m)
PACKAGES := $(shell go list ./... | grep -v /vendor/)

DATABASE_CONNECTION_STRING=postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DB}?sslmode=${PG_SSL}
PID_FILE := './.pid'
FSWATCH_FILE := './fswatch.cfg'

MIGRATE := docker run -v $(shell pwd)/migrations:/migrations --network host migrate/migrate:v4.10.0 -path=/migrations/ -database "$(DATABASE_CONNECTION_STRING)"

.PHONY: default
default: help

# generate help info from comments: thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help: ## help information about make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# ========================== Fs management =========================

.PHONY: clean
clean: ## remove temporary files
	rm -rf server coverage.out coverage-all.out

.PHONY: gazelle
gazelle: ## update dependency management with gazelle
	bazel run //:gazelle      
	gazelle update-repos --from_file=go.mod -to_macro=go_third_party.bzl%go_deps

# ======================== Running ================================

.PHONY: addresses-run
addresses-run: ## run addresses service
	bazel run //services/addresses

# ========================= Building ===============================

.PHONY: addresses-build
addresses-build:  ## build all services binaries
	bazel build //services/addresses

.PHONY: build-docker
build-docker: ## build all services as a docker image with bazel
	bazel run //services/addresses:image

.PHONY: rebuild-docker
rebuild-docker: ## delete old docker image, then rebuild it
	docker image rm -f 2436ebf538e1
	make build-docker

# ========================= Linting =========================================

.PHONY: lint
lint: ## run golint on all Go package
	@golint $(PACKAGES)

.PHONY: fmt
fmt: ## run "go fmt" on all Go packages
	@go fmt $(PACKAGES)

# ===================== Database management ========================================

.PHONY: db-start
db-start: ## start the database server
	@mkdir -p database/postgres
	docker run --rm --name postgres -v $(shell pwd)/database:/database \
		-v $(shell pwd)/database/postgres:/var/lib/postgresql/data \
		-e POSTGRES_PASSWORD=${PG_PASSWORD} -e POSTGRES_DB=${PG_DB} -e POSTGRES_HOST=${PG_HOST} -e POSTGRES_USER=${PG_USER} -e POSTGRES_PORT=${PG_PORT} -d -p '${PG_PORT}:${PG_PORT}' postgres:14

.PHONY: db-stop
db-stop: ## stop the database server
	docker stop postgres

.PHONY: migrate
migrate: ## run all new database migrations
	@echo "Running all new database migrations..."
	@$(MIGRATE) up

.PHONY: migrate-down
migrate-down: ## revert database to the last migration step
	@echo "Reverting database to the last migration step..."
	@$(MIGRATE) down 1

.PHONY: migrate-new
migrate-new: ## create a new database migration
	@read -p "Enter the name of the new migration: " name; \
	$(MIGRATE) create -ext sql -dir /migrations/ $${name// /_}

.PHONY: migrate-reset
migrate-reset: ## reset database and re-run all migrations
	@echo "Resetting database..."
	@$(MIGRATE) down 1
	@echo "Running all database migrations..."
	@$(MIGRATE) up

.PHONY: testdata
testdata: ## populate the database with test data
	@echo "Populating test data..."
	@docker exec -it postgres psql "$(DATABASE_CONNECTION_STRING)" -f /database/testdata/testdata.sql