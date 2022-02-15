const { Kafka } = require("kafkajs")
const brokers = ["localhost:9092"]

clientId = "JSAdmin"
const kafka = new Kafka({ clientId, brokers })
admin = kafka.admin()
admin.connect()

// async function describeKafka(){
//     let topics = await admin.listTopics()
//     console.log(topics)
//     for (let i = 0; i < topics.length; i++) {
//         let topic = topics[i]
//         let details = await admin.fetchTopicMetadata({ topics: [topic] })
//         console.log(details.topics[0])
//     }
// }

// describeKafka()

async function describeKafkaProducers() {
    let topics = await admin.listTopics()
    console.log(topics)
    for (let i = 0; i < topics.length; i++) {
        let topic = topics[i]
        let details = await admin.fetchTopicMetadata({ topics: [topic] })
        console.log(details.topics[0])
    }
}

describeKafkaProducers()