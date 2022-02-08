const { Kafka } = require("kafkajs")

// the client ID lets kafka know who's producing the messages
const clientId = "web-consumer"
// we can define the list of brokers in the cluster
const brokers = ["localhost:9092"]
// this is the topic from which we want to consume messages
const topic = "locations"

// initialize a new kafka client and initialize a consumer from it
const kafka = new Kafka({ clientId, brokers })
const consumer = kafka.consumer({ groupId: clientId })

const consume = async () => {
	// first, we wait for the client to connect and subscribe to the given topic
	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		// this function is called every time the consumer gets a new message
		eachMessage: ({ message }) => {
			// here, we just log the message to the standard output
			console.log(`received message: ${message.value}`)
		},
	})
}

module.exports = consume