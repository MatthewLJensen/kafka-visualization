import React, { useEffect } from 'react'
import { Network } from 'vis-network'
import { DataSet } from 'vis-data'

const Viz = () => {
    
    const startNetwork = () => {
        const nodes = new DataSet([
            { id: '0', label: 'Node 0' },
            { id: '1', label: 'Node 1' },
            { id: '2', label: 'Node 2' },
            { id: '3', label: 'Node 3' },
            { id: '4', label: 'Node 4' },
            { id: '5', label: 'Node 5' },
            { id: '6', label: 'Node 6' },
            { id: '7', label: 'Node 7' },
            { id: '8', label: 'Node 8' },
            { id: '9', label: 'Node 9' },
            { id: '10', label: 'Node 10' },
            { id: '11', label: 'Node 11' },
            { id: '12', label: 'Node 12' },
            { id: '13', label: 'Node 13' },
            { id: '14', label: 'Node 14' },
            { id: '15', label: 'Node 15' },
            { id: '16', label: 'Node 16' },
            { id: '17', label: 'Node 17' },
            { id: '18', label: 'Node 18' },
            { id: '19', label: 'Node 19' },
            { id: '20', label: 'Node 20' },
            { id: '21', label: 'Node 21' },
            { id: '22', label: 'Node 22' },
            { id: '23', label: 'Node 23' },
            { id: '24', label: 'Node 24' },
            { id: '25', label: 'Node 25' },
            { id: '26', label: 'Node 26' },
            { id: '27', label: 'Node 27' },
            { id: '28', label: 'Node 28' },
            { id: '29', label: 'Node 29' },
            { id: '30', label: 'Node 30' },
            { id: '31', label: 'Node 31' },
            { id: '32', label: 'Node 32' },
        ])

        const edges = new DataSet([
            { from: '0', to: '1' },
            { from: '0', to: '2' },
            { from: '0', to: '3' },
            { from: '0', to: '4' },
            { from: '0', to: '5' },
            { from: '0', to: '6' },
        ])

        const container = document.getElementById('network')

        const data = {
            nodes: nodes, edges: edges
        }

        const options = {}

        const network = new Network(container, data, options)
    }

    useEffect(() => {
        startNetwork()
    }, [])

    return (
        <div>
            <div id="network" style={{ width: '100%', height: '600px' }}></div>
        </div>
    )
}

export default Viz