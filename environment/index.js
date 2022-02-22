import { Server } from 'socket.io'
import { produce } from './producer.js'
import { consume } from './consumer.js'

const io = new Server({ cors: {
	origin: '*',
} })
io.on('connection', socket => {
	console.log('Client connected')
})
io.listen(4000)

// call the `produce` function and log an error if it occurs
produce(count => {
	io.emit('count', count)
}).catch((err) => {
	console.error("error in producer: ", err)
})

// start the consumers, and log any errors
// We start 3 consumers, each with a different topic, 2 of them share the same groupId
//consume()
consume("locations", "geo", "client1").catch((err) => {
	console.error("error in consumer: ", err)
})

consume("access_log", "web", "client2").catch((err) => {
	console.error("error in consumer: ", err)
})

consume("error_log", "web", "client3").catch((err) => {
	console.error("error in consumer: ", err)
})