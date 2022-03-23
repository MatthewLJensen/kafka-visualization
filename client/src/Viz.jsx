import React, { useEffect, useRef } from 'react'
import { Network } from 'vis-network'
import { DataSet } from 'vis-data'

const Viz = () => {
    const visRef = useRef(null)
    const network = useRef(null)
    const data = useRef({})

    const startNetwork = ({ detail }) => {
        const key = Object.keys(detail)[0]
        
        if (key)
            data.current[key] = detail[key]

        if ( !(data.current.consumers && data.current.producers && data.current.topics) )
            return

        const { producers, consumers, topics } = data.current

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

        const graph = {
            nodes: nodes, edges: edges
        }

        const options = { interaction: { zoomView: false } }

        if (!network.current)
            network.current = visRef.current && new Network(visRef.current, graph, options)
        else
            network.current.setData(graph)
    }

    useEffect(() => {
        window.addEventListener('producersUpdate', startNetwork)
        window.addEventListener('consumersUpdate', startNetwork)
        window.addEventListener('topicsUpdate', startNetwork)
    }, [visRef])

    return (
        <div id="network" ref={visRef} style={{ width: '100%', height: '600px' }}></div>
    )
}

export default Viz