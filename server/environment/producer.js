// from https://www.sohamkamani.com/nodejs/working-with-kafka/
import { Kafka } from 'kafkajs'


// we can define the list of brokers in the cluster
const brokers = ["localhost:9092"]
// this is the topic to which we want to write messages
const TOPIC = "locations"

// we define an async function that writes a new message each second
const produce = async (clientId, primaryInterval, secondaryInterval) => {
    // initialize a new kafka client and initialize a producer from it
    const kafka = new Kafka({ clientId, brokers })
    const producer = kafka.producer()
    const traceProducer = kafka.producer()

    let mainIndex = 0
    let secondaryIndex = 0
    // the number of messaged that have been produced since the monitor was updated
    let produced = 0

    // the time at which the producer was created
    let createdAt = new Date().toString()

    // connect both producers
    await producer.connect()
    await traceProducer.connect()

    //  handle the primary producer
    setInterval(async () => {
        try {
            await produce_main(producer, TOPIC, generateMessage(mainIndex), numProduced => {
                produced += numProduced
            })
            mainIndex++
            console.log(`Produced message #${mainIndex}.`)
        } catch (err) {
            console.error("could not write message " + err)
        }
    }, primaryInterval)

    // handle the secondary producer
    setInterval(async () => {
        try {
            const send = async () => {
                await produce_secondary(traceProducer, "trace", await generateTraceMessage(secondaryIndex))
                secondaryIndex++
                console.log(`Produced trace message #${secondaryIndex}.`)
            }

            process.on('SIGINT', async () => {
                await send()
                console.log('Exiting')
                process.exit(1)
            })

            await send()

        } catch (err) {
            console.error("could not write message " + err)
        }
    }, secondaryInterval)

    function generateMessage(index) {
        return [
            {
                key: index.toString(),
                value: JSON.stringify({
                    latitude: getRandomInRange(-180, 180, 5),
                    longitude: getRandomInRange(-180, 180, 5)
                }),
                headers: {
                    'identifier': clientId
                }
            }
        ]
    }

    // making this async so it blocks and doesn't risk having the produced variable become modified before it is used
    async function generateTraceMessage(index) {
        let messages = [
            {
                key: index.toString(),
                value: JSON.stringify({
                    numProduced: produced,
                }),
                headers: {
                    'producerId': clientId,
                    'startTime': createdAt
                }
            }
        ]

        // reset produced
        produced = 0

        return messages
    }
}

const produce_main = async (producer, topic, messages, main_callback) => {
    await producer.send({
        topic,
        messages: messages
    })

    main_callback(messages.length)
}

const produce_secondary = async (producer, topic, messages) => {
    await producer.send({
        topic,
        messages: messages
    })
}




function getRandomInRange(from, to, fixed) {
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1
}

export {
    produce
}