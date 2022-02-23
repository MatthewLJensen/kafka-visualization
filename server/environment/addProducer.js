import { produce } from './producer.js'



// call the `produce` function and log an error if it occurs. This function creates a new primary and trace producer
produce("new producer", 2000, 5000).catch((err) => {
	console.error("error in producer: ", err)
})