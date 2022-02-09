const { Kafka } = require("kafkajs")
const brokers = ["localhost:9092"]



const consume = async (topic, groupId, clientId) => {
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: groupId, clientId: clientId })

	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: ({ message }) => {
			console.log(message.value.toString())
		},
	})
}

module.exports = consume