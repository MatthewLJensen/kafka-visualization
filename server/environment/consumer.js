import { Kafka } from "kafkajs"
const brokers = ["localhost:9092"]

const consume = async (topics, groupId, clientId, action) => {
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: groupId, clientId: clientId })

	await consumer.connect()
	for (let topic of topics){
		await consumer.subscribe({ topic })
	}
	await consumer.run({
		eachMessage: ({ message }) => {
			if (action)
				action(message)
			//console.log(message.value.toString())
		},
	})
}

export {
	consume
}