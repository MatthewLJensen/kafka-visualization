import { produce } from './producer.js'
import { consume } from './consumer.js'

// call the `produce` function and log an error if it occurs. This function creates a new primary and trace producer
produce("default producer", 2000, 5000, "locations").catch((err) => {
	console.error("error in producer: ", err)
})

produce("Apache Server Accesses", 1500, 4000, "access_log").catch((err) => {
	console.error("error in producer: ", err)
})

produce("Apache Server Errors", 1000, 6000, "error_log").catch((err) => {
	console.error("error in producer: ", err)
})

// start the consumers, and log any errors
// We start 3 consumers, each with a different topic, 2 of them share the same groupId
//consume()
consume(["locations", "access_log"], "geo", "client1").catch((err) => {
	console.error("error in consumer: ", err)
})

consume(["access_log", "error_log", "locations"], "web", "client2").catch((err) => {
	console.error("error in consumer: ", err)
})

consume(["error_log"], "web", "client3").catch((err) => {
	console.error("error in consumer: ", err)
})