# The Kafka visualizer to rule them all.

## Research and Deliverable Timeline
- February 9: 
    - Research (see some research further down in this readme)
    - Familiarize ourselves with the Kafka protocol/tools
    - An email with our deliverable timeline.
    - First Version of the Tool. 
        - A javascript Application
            - Creates producers and consumers on a variety of topics and consumer groups.
        - A python Application
            - Monitoring Consumers
            - Capturing Kafka Architecture

- February 16:
    - An email with our chosen conference
    - Paper introduction
    - Second Version of the Tool. 
        - Extend python application to detect kafka producers
            - Note: This has complexity because kafka is a distributed system and isn't aware of the producers. We will likely need to create a consumer in order to get the producer's metadata.

- February 23:
    - An email with the "state of the art" section of the paper
        - Includes 5 recent research articles relating to our topic
    - In the same email, explanation of the improvements to the tool
    - Third Version of the Tool
        - Extend python application to capture events, and thus tying together the producers and the consumers

- March 2:
    - An email with the paper up to this point.
    - Conceptual map figure that connects underlying concepts of the paper/tool 
        - Added: the underpinnings of the approach section (theoretical framework)
    - In the same email, explanation of the improvements to the tool
    - Fourth Version of the Tool
        - Build a front end that enables the visualization of the producers, consumers, brokers, and topics.
        
- March 9: 
    - Present the complete tool.
        - It has been refined and the UI has been impoved. 
        - Detection of abnormal behavior has been added. Lost events or other errors are hopefully being detected.

## Other Resources
### Similar Projects
 - Netflix Inca
[Interview](https://www.infoq.com/presentations/netflix-streaming-data-infrastructure/)
[Blog](https://netflixtechblog.medium.com/inca-message-tracing-and-loss-detection-for-streaming-data-netflix-de4836fc38c9)

 - Offset Explorer
 Visually explor the architecture of your Kafka cluster.
 [Website](https://kafkatool.com/index.html)

### Interesting Papers/Use-Cases for Kafka
[Consistency and Completeness: Rethinking Distributed Stream Processing in Apache Kafka](https://dl.acm.org/doi/10.1145/3448016.3457556)
[Connecting the data stream with ML/AI frameworks](https://www.sciencedirect.com/science/article/pii/S0167739X21002995)


## Kafka Python Docs
Check them out [here](https://kafka-python.readthedocs.io/en/master/index.html).
Is [this](https://github.com/dpkp/kafka-python) the same? 
[From Clonfluent](https://docs.confluent.io/platform/current/clients/confluent-kafka-python/html/index.html#pythonclient-configuration)
They're kinda confusing, since there appear to be multiple docs with similar names. 


## Getting Started
We followed along the [Confluent Kafka Quickstart](https://developer.confluent.io/quickstart/kafka-docker/) guide  and utilized Docker.
Check out the [Kafka Docs](https://kafka.apache.org/documentation/#gettingStarted) for more information.
### Docker
 - Clone Repo
 - Run ```docker-compose up -d```
 
 Wait for it to finish. Then start the consumer and producer.
  - ```cd environment```
  - ```node index.js```


## Notes
The bash riles don't need to have the full path or the extension when running them from the docker exec command.

To get the brokers from zookeper:
```docker exec -it zookeeper zookeeper-shell localhost:2181 ls /brokers/ids```
or, using zkCli:
```zkCli.sh ls /brokers/ids```

Run the following to get a list of consumer groups:
```docker exec --interactive --tty broker kafka-consumer-groups --list --bootstrap-server localhost:9092``` (localhost can be replaced with broker, apparently)

Then for each consumer group you can run:
```docker exec --interactive --tty broker kafka-consumer-groups --describe --group web-consumer --members --bootstrap-server localhost:9092```
or, for slightly different information:
```docker exec --interactive --tty broker kafka-consumer-groups --describe --group web-consumer --bootstrap-server localhost:9092```