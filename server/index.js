import { Server } from 'socket.io'
import { Kafka, AssignerProtocol } from 'kafkajs'
import { Producer } from './entities/Producer.js'

const brokers = ["localhost:9092"]



const io = new Server({
    cors: {
        origin: '*',
    }
})

io.on('connection', socket => {
    console.log('Client connected')
    let clientConsumer = null
    let groupId = 0
    socket.on("consume", async (topic) => {
        console.log("consume", topic)
        if (clientConsumer != null) {
            await clientConsumer.stop()
            clientConsumer = null
            groupId++
        }
        clientConsumer = kafka.consumer({ groupId: "client_consumer_group_" + groupId, clientId: "client_" + socket.id })
        consume_topic(topic, clientConsumer)
    })
})
io.listen(4000)





// Global variables
let topics = []
let consumerGroups = []
let consumers = []
let producers = {}


// Setup Kafka Connection
let clientId = "JSAdmin"
const kafka = new Kafka({ clientId, brokers })
let admin = kafka.admin()
admin.connect()

async function getTopics() {
    let temp_topics = await admin.listTopics()
    let current_topics = []

    temp_topics.forEach(topic => {
        if (topic !== '__consumer_offsets' && topic !== 'trace')
            current_topics.push(topic)
    })

    return current_topics
}

async function getConsumers() {
    let current_consumers = []
    consumerGroups = (await admin.listGroups())
    const groupIds = consumerGroups.groups.map(group => group.groupId)

    let describedGroups = await admin.describeGroups(groupIds)
    for (let group of describedGroups.groups) {
        for (let consumer of group.members) {
            if (consumer.clientId !== "JSAdmin") {
                let subscriptions = null
                try {
                    subscriptions = AssignerProtocol.MemberMetadata.decode(consumer.memberMetadata)
                }
                catch (error) {
                    console.log("failed to grab subscriptions")
                    console.log(error)
                }

                current_consumers.push({
                    groupId: group.groupId,
                    consumerId: consumer.clientId,
                    host: consumer.clientHost,
                    subscriptions: subscriptions
                })
            }

        }
    }
    return current_consumers
}

const consume_metadata = async (topic, groupId, id) => {
    const consumer = kafka.consumer({ groupId: groupId, clientId: id })

    await consumer.connect()
    await consumer.subscribe({ topic })
    await consumer.run({
        eachMessage: ({ message }) => {
            let producerId = message.headers.producerId.toString()
            let createdAt = message.headers.startTime.toString()
            let topic = null
            if (message.headers.hasOwnProperty('topic'))
                topic = message.headers.topic.toString()

            add_producer(producerId, createdAt, topic)
            producers[producerId].updateProduced(JSON.parse(message.value.toString()).numProduced)
            producers[producerId].topic = topic

            // update frontend
            io.emit('producers', producers)
        },
    })
}

const consume_topic = async (topic, client_consumer) => {
    

    await client_consumer.connect()
    await client_consumer.subscribe({ topic, fromBeginning: false })
    await client_consumer.run({
        eachMessage: ({ message }) => {

            console.log("message received")
            console.log(message.value.toString())
            // update frontend
            io.emit('filtered_message', message.value.toString())
        },
    })
}

const add_producer = (producerId, createdAt, topic) => {
    if (!producers.hasOwnProperty(producerId)) {
        producers[producerId] = new Producer(producerId, createdAt, topic)
    }
}


const checkForOldProducers = async () => {
    //this function should periodically check for producers that have not produced in a while and remove them from the dictionary
}


async function describeKafka() {
    topics = await getTopics()
    consumers = await getConsumers()

    io.emit('topics', topics)
    io.emit('consumers', consumers)
}

setInterval(() => {
    describeKafka()
}, 5000)

consume_metadata("trace", "monitoring_consumer_group", "monitoring_server")