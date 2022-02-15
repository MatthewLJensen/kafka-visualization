// from https://www.sohamkamani.com/nodejs/working-with-kafka/
const { Kafka } = require("kafkajs")

// the client ID lets kafka know who's producing the messages
const clientId = "web-producer"
// we can define the list of brokers in the cluster
const brokers = ["localhost:9092"]
// this is the topic to which we want to write messages
const topic = "locations"

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()

// we define an async function that writes a new message each second
const produce = async () => {
    await producer.connect()
    let i = 0

    // after the produce has connected, we start an interval timer
    setInterval(async () => {
        try {
            await producer.send({
                topic,
                messages: [
                    {
                        key: i.toString(),
                        value: JSON.stringify({
                            latitude: getRandomInRange(-180, 180, 5),
                            longitude: getRandomInRange(-180, 180, 5)
                        }),
                        headers: JSON.stringify({
                            identifier: clientId
                        })
                    }
                ],
            })

            i++

            console.log(`Produced ${i}.`)

        } catch (err) {
            console.error("could not write message " + err)
        }
    }, 2000)
}

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

module.exports = produce