import React, { useEffect, useRef } from 'react'
import { Network } from 'vis-network'
import { DataSet } from 'vis-data'

const Viz = ({ producers, consumers, topics }) => {
    const visRef = useRef(null)
    

    const startNetwork = () => {

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

        const data = {
            nodes: nodes, edges: edges
        }

        const options = { interaction: { zoomView: false } }

        const network = new Network(visRef.current, data, options)
    }

    useEffect(() => {
        startNetwork()
    }, [visRef, producers, consumers, topics])

    return (
        <div>
            <div id="network" ref={visRef} style={{ width: '100%', height: '600px' }}></div>
        </div>
    )
}

export default Viz