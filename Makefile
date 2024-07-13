all : up

up : 
	@docker-compose -f docker-compose.yml up -d

down : 
	@docker-compose -f docker-compose.yml down

build : 
	@docker-compose -f docker-compose.yml build

stop : 
	@docker-compose -f docker-compose.yml stop

start : 
	@docker-compose -f docker-compose.yml start

rmi : 
	@docker rmi $(docker images)

rmv:
	@docker volume rm $(docker volume ls)

prune:
	docker system prune

stat : 
	@docker ps
re : down  rmv prune build up