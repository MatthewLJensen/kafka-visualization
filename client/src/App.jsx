import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const socket = io(':4000')

function App() {
    const [message, setMessage] = useState('')
    const [producers, setProducers] = useState([])
    const [consumers, setConsumers] = useState([])
    const [messages, setMessages] = useState([])
    const [topics, setTopics] = useState([])

    useEffect(() => {
        socket.on('connect', () => console.log('Connected to server'))

        const producersUpdateListener = (data) => {
            setProducers(data)
        };
        const consumersUpdateListener = (data) => {
            console.log(consumers)
            setConsumers(data)
        };
        const messagesUpdateListener = (data) => {
            setMessages(data)
        };
        const topicsUpdateListener = (data) => {
            console.log(data)
            setTopics(data)
        };

        socket.on('producers', producersUpdateListener)
        socket.on('consumers', consumersUpdateListener)
        socket.on('messages', messagesUpdateListener)
        socket.on('topics', topicsUpdateListener)



        return () => {
            socket.off('producers', producersUpdateListener)
            socket.off('consumers', consumersUpdateListener)
            socket.off('messages', messagesUpdateListener)
            socket.off('topics', topicsUpdateListener)
        };

    }, [])

    return (
        <div className="App">

            <div className="EntityList">
                <h1>Producers</h1>
                {
                    Object.keys(producers).map((key, index) => {
                        let now = new Date()
                        let lastUpdated = new Date(producers[key].lastUpdated)
                        return (
                            // A producer is considered inactive if it hasn't produced in over 10 seconds.
                            <div className={(Math.abs(now - lastUpdated) < 10000) ? 'EntityItem' : 'InactiveEntityItem'} key={index}>
                                <h2>Name: {producers[key].id}</h2>
                                <h2>Created: {timeStamp(new Date(producers[key].createdAt))}</h2>
                                <h2>Produced Messages: {producers[key].produced}</h2>
                            </div>
                        )
                    })
                }
            </div>
            <div className="EntityList">
                <h1>Consumers</h1>
                {
                    
                    consumers.map((consumer, index) => {
                        return (
                            <div className='EntityItem' key={index}>
                                <h2>Name: {consumer.consumerId}</h2>
                                <h2>GroupID: {consumer.groupId}</h2>
                                <h2>Host: {consumer.host}</h2>
                            </div>
                        )
                    })
                }
            </div>
            <div className="EntityList">
                <h1>Topics</h1>
                {
                    
                    topics.map((topic, index) => {
                        return (
                            <div className='EntityItem' key={index}>
                                <h2>{topic}</h2>
                            </div>
                        )
                    })
                }
            </div>


            {/*  */}
        </div>
    )
}

function timeStamp(now) {
    // Create an array with the current month, day and time
    var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];

    // Create an array with the current hour, minute and second
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

    // Determine AM or PM suffix based on the hour
    var suffix = (time[0] < 12) ? "AM" : "PM";

    // Convert hour from military time
    time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

    // If hour is 0, set it to 12
    time[0] = time[0] || 12;

    // If seconds and minutes are less than 10, add a zero
    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }

    // Return the formatted string
    return date.join("/") + " " + time.join(":") + " " + suffix;
}

export default App
