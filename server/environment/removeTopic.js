import { Kafka } from "kafkajs"
const brokers = ["localhost:9092"]
let clientId = "JSAdmin"
clientId = "JSAdmin"
const kafka = new Kafka({ clientId, brokers })
let admin = kafka.admin()
admin.connect()

await admin.deleteTopics({
    topics: ['geo'],
    timeout: 1000,
})