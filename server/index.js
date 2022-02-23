//import { consume } from "../services/scanProducers"
import { Server } from 'socket.io'
import { Kafka } from 'kafkajs'
import { Producer } from './entities/Producer.js'

const brokers = ["localhost:9092"]



const io = new Server({ cors: {
	origin: '*',
} })
io.on('connection', socket => {
	console.log('Client connected')
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
    for (let i = 0; i < temp_topics.length; i++) {
        if (temp_topics[i] != "__consumer_offsets") {
            current_topics.push(temp_topics[i])
        }
    }
    return current_topics
}

async function getConsumers() {
    let current_consumers = []
    consumerGroups = (await admin.listGroups())
    const groupIds = consumerGroups.groups.map(group => group.groupId)

    let describedGroups = await admin.describeGroups(groupIds)
    for (let group of describedGroups.groups) {
        for (let consumer of group.members) {
            current_consumers.push({
                groupId: group.groupId,
                consumerId: consumer.clientId,
                host: consumer.clientHost,
                subscriptions: consumer.memberMetadata.toString()
            })
        }
    }
    return current_consumers
}

const consume_metadata = async (topic, groupId, clientId) => {
    const consumer = kafka.consumer({ groupId: groupId, clientId: clientId })

	await consumer.connect()
	await consumer.subscribe({ topic })
    await consumer.run({
        eachMessage: ({ message }) => {
            let producerId = message.headers.producerId.toString()
            let createdAt = message.headers.startTime.toString()
            add_producer(producerId, createdAt)
            producers[producerId].updateProduced(JSON.parse(message.value.toString()).numProduced)

            // update frontend
            io.emit('producers', producers)
        },
    })
}

const add_producer = (producerId, createdAt) => {
    if (!producers.hasOwnProperty(producerId)) {
        producers[producerId] = new Producer(producerId, createdAt)
    }
}


const checkForOldProducers = async () => {
    //this function should periodically check for producers that have not produced in a while and remove them from the dictionary
}


async function describeKafka() {
    topics = await getTopics()
    consumers = await getConsumers()
    //await getProducers()
    // console.log(topics)
    // console.log(consumerGroups)
    // console.log(consumers)

    io.emit('topics', topics)
    io.emit('consumers', consumers)
}

setInterval(() => {
    describeKafka()
}, 5000)

consume_metadata("trace", "monitoring_consumer_group", "monitoring_server")





// async function getProducers() {
//     console.log("Getting producers...")

//     const scan = async (groupId, clientId) => {
//         const kafka = new Kafka({ clientId, brokers })
//         const consumer = kafka.consumer({ groupId: groupId, clientId: clientId })

//         consume(consumer)

//         let timeout = setTimeout(() => {
//             console.log("killing consumer")
//             const func = async () => {
//                 (async () => {
//                     await consumer.disconnect()
//                 })()
//             }
//             func()
//         }, 5000)

//     }

//     const consume = async (consumer) => {

//         await consumer.connect()
//         for (let i = 0; i < topics.length; i++) {
//             await consumer.subscribe({ topic: topics[i] })
//         }

//         await consumer.run({
//             eachMessage: ({ message }) => {
//                 let producerId = message.headers.identifier.toString()
//                 if (!producers.includes(producerId)) {
//                     producers.push(producerId)
//                     console.log("Found producer: " + producerId)
//                 }
//             },
//         })
//     }

//     scan("test3", "test")

// }