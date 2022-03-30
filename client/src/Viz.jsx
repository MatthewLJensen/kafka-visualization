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

            const edgeId = `producer_${producer.id}-topic_${producer.topic}`
            edgesArray.push({ id: edgeId, from: `producer_${producer.id}`, to: `topic_${producer.topic}`, arrows: 'to' })
        })
        consumers.forEach(consumer => { 
            nodesArray.push({ id: `consumer_${consumer.consumerId}`, label: consumer.consumerId }) 

            consumer.subscriptions.topics.forEach(topic => {
                const edgeId = `consumer_${consumer.consumerId}-topic_${topic}`
                edgesArray.push({ id: edgeId, from: `consumer_${consumer.consumerId}`, to: `topic_${topic}`, arrows: 'to' })
            })
        })
        topics.forEach(topic => nodesArray.push({ id: `topic_${topic}`, label: topic }) )
        
        network.current && nodesArray.forEach((node, index) => {
            const positions = network.current.getPositions()
            const nodeId = node.id
            nodesArray[index].x = positions[nodeId]?.x
            nodesArray[index].y = positions[nodeId]?.y
        })

        if (!network.current) {
            const nodes = new DataSet(nodesArray)
            const edges = new DataSet(edgesArray)
    
            const graph = {
                nodes: nodes, edges: edges
            }
    
            const options = { 
                interaction: { zoomView: false },
                physics: { stabilization: true }
            }
            
            network.current = visRef.current && new Network(visRef.current, graph, options)
        } else {
            network.current.body.data.nodes.update(nodesArray)
            network.current.body.data.edges.update(edgesArray)
        }
    }

    useEffect(() => {
        window.addEventListener('producersUpdate', startNetwork)
        window.addEventListener('consumersUpdate', startNetwork)
        window.addEventListener('topicsUpdate', startNetwork)
    }, [])

    return (
        <div id="network" ref={visRef} style={{ width: '100%', height: '600px' }}></div>
    )
}

export default Viz