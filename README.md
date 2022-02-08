# The Kafka visualizer to rule them all.

## Getting Started
### Docker
 - Clone Repo
 - Run ```docker-compose up -d```
 
 Wait for it to finish. Then start the consumer and producer.
  - ```cd environment```
  - ```node index.js```


## Notes
The bash riles don't need to have the full path or the extension when running them from the docker exec command.

Run the following to get a list of consumer groups:
```docker exec --interactive --tty broker kafka-consumer-groups --list --bootstrap-server localhost:9092``` (localhost can be replaced with broker, apparently)

Then for each consumer group you can run:
```docker exec --interactive --tty broker kafka-consumer-groups --describe --group web-consumer --members --bootstrap-server localhost:9092```
or, for slightly different information:
```docker exec --interactive --tty broker kafka-consumer-groups --describe --group web-consumer --bootstrap-server localhost:9092```