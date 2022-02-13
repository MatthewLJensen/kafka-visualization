# The Kafka visualizer to rule them all.

## Overview
Kafka specializes in the transfer of incredibly large amounts of data in real-time between devices. For certain tasks, it is critical that this data reach its intended destinations accurately and without loss. Currently, most tools used to track and diagnose these issues are commercially licensed products without public, associated, research. To that end, we propose a tool which will monitor consumers, producers, and brokers within a Kafka architecture and allow for the detection of bottlenecks and errors within the network. By leveraging small data packets which provides information relevant to each node, this system should theoretically be capable of providing reliable monitoring data to a central tool even in potentially unreliable network conditions. In order to display this monitoring data, this system will implement a visualizer which will allow a user to rapidly see the flow of data between various Kafka nodes and discern where data is either missing or encountering some other error. This visualizer will also serve to reduce the complexity of Kafka and thus enable users unfamiliar with the platform and protocol to better understand how their arhictecture is configured, thus further reducing data loss from configuration errors.

## Research and Deliverable Timeline
- February 9: 
    - Research (see some research further down in this readme)
    - Familiarize ourselves with the Kafka protocol/tools
    - An email with our deliverable timeline.
    - First Version of the Tool. 
        - A javascript Application
            - Creates producers and consumers on a variety of topics and consumer groups.
        - A python Application
            - Will grab consumers, groups, and brokers, and monitor how they interact with each other.

- February 16:
    - Paper introduction and our chosen conference
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

### Python
 - pip install kafka-python
You may also need to install confluent-kafka
 - pip install confluent-kafka

Then, run the scraping script.
 - ```cd scrape```
 - python .\kafkaAdmin.py

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
