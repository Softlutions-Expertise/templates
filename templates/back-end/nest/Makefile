.PHONY: up

upgrade:
	git submodule update --remote --force --merge;

up:
	docker compose up -d

up-build:
	docker compose up -d --build

down:
	docker compose down

cleanup:
	docker compose down -v;
	sudo rm -rf ./node_volumes;
	sudo rm -rf ./volumes;
	sudo rm -rf ./dist;

logs:
	docker compose logs -f api

bash:
	docker compose exec api bash

build:
	npm run build

ps:
	docker compose ps
