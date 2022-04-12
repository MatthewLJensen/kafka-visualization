import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { ToastContainer, toast, Flip } from 'react-toastify'
import { createUseStyles } from 'react-jss'
import clsx from 'clsx'

import Graph from './Graph'

import 'react-toastify/dist/ReactToastify.css'

const socket = io(':4000')

const useStyles = createUseStyles(theme => ({
    root: {
        minheight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.primary,
        flexWrap: 'wrap',

        '& h1': {
            color: theme.palette.text.primary,
            textAlign: 'center',
            margin: 0
        }
    },

    entityList: {
        margin: '20px',

        '&>div': {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxHeight: '80vh',
            overflowY: 'auto',
            marginTop: '20px',
        }
    },

    entity: {
        backgroundColor: theme.palette.background.highlight,
        color: theme.palette.text.muted,
        padding: '20px',
        borderRadius: theme.radius[2],
        boxShadow: theme.boxShadow[0]
    },

    inactive: {
        backgroundColor: theme.palette.background.secondary,
        color: theme.palette.background.highlight,
    },

    visualizerContainer:{
        width: '100%',
    },

    selected: {
        borderColor: theme.palette.accent.yellow,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: theme.radius[2],
    }
}))

function App() {
    const classes = useStyles()

    const [producers, setProducers] = useState([])
    const [consumers, setConsumers] = useState([])
    const [messages, setMessages] = useState([])
    const [topics, setTopics] = useState([])
    const [consumeTopic, setConsumeTopic] = useState(null)
    const [activeNode, setActiveNode] = useState(null)

    useEffect(() => {
        socket.on('connect', () => console.log('Connected to server'))

        const producersUpdateListener = (data) => {
            setProducers(data)

            const evt = new CustomEvent('producersUpdate', { detail: { producers: data } })
            window.dispatchEvent(evt)
        };
        const consumersUpdateListener = (data) => {
            setConsumers(data)

            const evt = new CustomEvent('consumersUpdate', { detail: { consumers: data } })
            window.dispatchEvent(evt)

        };
        const messagesUpdateListener = (data) => {
            setMessages(data)

            const evt = new CustomEvent('messagesUpdate', { detail: data })
            window.dispatchEvent(evt)

        };
        const topicsUpdateListener = (data) => {
            setTopics(data)

            const evt = new CustomEvent('topicsUpdate', { detail: { topics: data } })
            window.dispatchEvent(evt)
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

    useEffect(() => {
        if (consumeTopic !== null) {
            socket.emit('consume', consumeTopic)
            
            const topicsMessageListener = (data) => {
                // setMessages(prevMessages => {
                //     return [...prevMessages, data]
                // })
                console.log(data)
                toast(data)
            }

            socket.on('filtered_message', topicsMessageListener)

            return () => {
                socket.off('filtered_message', topicsMessageListener)
            }
        }
        else {
            socket.emit('stop_consume')
        }

    }, [consumeTopic])

    useEffect(() => {
        if (activeNode === null) {
            setConsumeTopic(null)
        }
    }, [activeNode])

    return (
        <div className={classes.root}>
            <ToastContainer
                theme="dark"
                position="bottom-right"
                pauseOnHover={true}
                newestOnTop={true}
                transition={Flip}
                
            />
            <div id="visualizer-parent" className={classes.visualizerContainer}>
                <Graph activeNode={activeNode} setActiveNode={setActiveNode}/>
            </div>

            <div className={classes.entityList}>
                <h1>Producers</h1>
                <div>
                    {
                        Object.keys(producers).map((key, index) => {
                            const now = Date.now()
                            const lastUpdated = new Date(producers[key].lastUpdated).getTime()
                            const concatId = `producer_${producers[key].id}`
                            const classCombination = clsx(classes.entity, Math.abs(now - lastUpdated) > 10000 ? classes.inactive : '', (concatId === activeNode) ? classes.selected : '' )

                            return (
                                // A producer is considered inactive if it hasn't produced in over 10 seconds.
                                <div 
                                    className={classCombination} 
                                    key={index}
                                    onClick={() => {
                                        setConsumeTopic(null)
                                        setActiveNode(concatId)
                                    }}
                                >
                                    <h2>Name: {producers[key].id}</h2>
                                    <h2>Created: {timeStamp(new Date(producers[key].createdAt))}</h2>
                                    <h2>Last Updated: {timeStamp(new Date(producers[key].lastUpdated))}</h2>
                                    <h2>Produced Messages: {producers[key].produced}</h2>
                                    <h2>Topic: {producers[key].topic}</h2>

                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className={classes.entityList}>
                <h1>Topics</h1>
                <div>
                    {
                        topics.map((topic, index) => {
                            const concatId = `topic_${topic}`
                            const classCombination = clsx(classes.entity, (concatId === activeNode) ? classes.selected : '' )
                            return (
                                <div 
                                    className={classCombination} 
                                    key={index} 
                                    onClick={() => {
                                        setConsumeTopic(topic)
                                        setActiveNode(concatId)
                                    }}>
                                    <h2>{topic}</h2>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className={classes.entityList}>
                <h1>Consumers</h1>
                <div>
                    {
                        consumers.map((consumer, index) => {
                            const concatId = `consumer_${consumer.consumerId}`
                            const classCombination = clsx(classes.entity, (concatId === activeNode) ? classes.selected : '' )
                            return (
                                <div 
                                    className={classCombination} 
                                    key={index}
                                    onClick={() => {
                                        setConsumeTopic(null)
                                        setActiveNode(concatId)
                                    }}
                                >
                                    <h2>Name: {consumer.consumerId}</h2>
                                    <h2>GroupID: {consumer.groupId}</h2>
                                    {/* <h2>Host: {consumer.host}</h2> */}
                                    <h2>Topic(s): {consumer.subscriptions.topics.join(', ')}</h2>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div>
                {
                    consumeTopic && messages.map((message, index) => {
                        return (
                            <div className={classes.entity} key={index}>
                                <h2>Message: {message}</h2>
                            </div>
                        )
                    })
                }
            </div>
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
