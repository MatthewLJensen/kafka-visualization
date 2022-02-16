const { Kafka } = require("kafkajs")
const brokers = ["localhost:9092"]

const scanProducers = require("./scanProducers")

// Global variables
let topics = []
let consumerGroups = []
let consumers = []
let producers = []


// Setup Kafka Connection
clientId = "JSAdmin"
const kafka = new Kafka({ clientId, brokers })
admin = kafka.admin()
admin.connect()

async function getTopics() {
    let temp_topics = await admin.listTopics()
    for (let i = 0; i < temp_topics.length; i++) {
        if (temp_topics[i] != "__consumer_offsets") {
            topics.push(temp_topics[i])
        }
    }
}

async function getConsumers() {
    consumerGroups = (await admin.listGroups())

    const groupIds = consumerGroups.groups.map(group => group.groupId)

    describedGroups = await admin.describeGroups(groupIds)
    for (let group of describedGroups.groups) {
        for (let consumer of group.members) {
            consumers.push({
                groupId: group.groupId,
                consumerId: consumer.clientID,
                host: consumer.clientHost,
                subscriptions: consumer.memberMetadata.toString()
            })
        }
    }
}

async function getProducers() {
    console.log("Getting producers...")

    const scan = async (groupId, clientId) => {
        const kafka = new Kafka({ clientId, brokers })
        const consumer = kafka.consumer({ groupId: groupId, clientId: clientId })

        consume(consumer)

        let timeout = setTimeout(() => {
            console.log("killing consumer")
            const func = async () => {
                (async () => {
                    await consumer.disconnect()
                })()
            }
            func()
        }, 5000)

    }

    const consume = async (consumer) => {

        await consumer.connect()
        for (let i = 0; i < topics.length; i++) {
            await consumer.subscribe({ topic: topics[i] })
        }

        await consumer.run({
            eachMessage: ({ message }) => {
                let producerId = message.headers.identifier.toString()
                if (!producers.includes(producerId)) {
                    producers.push(producerId)
                    console.log("Found producer: " + producerId)
                }
            },
        })
    }

    scan("test3", "test")

}

async function describeKafka() {
    await getTopics()
    await getConsumers()
    await getProducers()
    // console.log(topics)
    // console.log(consumerGroups)
    // console.log(consumers)
    console.log("_________________________________________")
    console.log(producers)
}

describeKafka()














