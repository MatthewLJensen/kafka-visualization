const { Kafka } = require("kafkajs")
const brokers = ["localhost:9092"]



const consume = async (topic, groupId, clientId) => {
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: groupId, clientId: clientId })

	await consumer.connect()
    await consumer.subscribe({ topic: 'locations' })
	await consumer.run({
		eachMessage: ({ message }) => {
            //console.log(message)
            console.log("_________________________________________")
			console.log(message.key.toString())
            console.log(message.value.toString())
            console.log(message.headers.identifier.toString())
		},
	})
}

consume("test", "test", "test")

module.exports = consume