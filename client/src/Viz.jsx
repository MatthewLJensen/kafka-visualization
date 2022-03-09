import React, { useEffect, useRef } from 'react'
import { Network } from 'vis-network'
import { DataSet } from 'vis-data'

const Viz = ({ data }) => {
    const visRef = useRef(null)
    
    const { producers, consumers, topics } = data.current

    const startNetwork = () => {
        if (data.current)
            return

        let nodesArray = []
        let edgesArray = []
        Object.keys(producers).forEach(key => { 
            const producer = producers[key]
            nodesArray.push({ id: `producer_${producer.id}`, label: producer.id }) 
            edgesArray.push({ from: `producer_${producer.id}`, to: `topic_${producer.topic}`, arrows: 'to' })
        })
        consumers.forEach(consumer => { 
            nodesArray.push({ id: `consumer_${consumer.consumerId}`, label: consumer.consumerId }) 

            consumer.subscriptions.topics.forEach(topic => {
                edgesArray.push({ from: `consumer_${consumer.consumerId}`, to: `topic_${topic}`, arrows: 'to' })
            })
        })
        topics.forEach(topic => nodesArray.push({ id: `topic_${topic}`, label: topic }) )

        const nodes = new DataSet(nodesArray)
        const edges = new DataSet(edgesArray)

        const visData = {
            nodes: nodes, edges: edges
        }

        console.log(nodesArray, edgesArray)

        const options = {}

        const network = new Network(visRef.current, visData, options)
    }

    useEffect(() => {
        startNetwork()
    }, [visRef])

    return (
        <div>
            <div id="network" ref={visRef} style={{ width: '100%', height: '600px' }}></div>
        </div>
    )
}

export default Viz