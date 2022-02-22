import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const socket = io(':4000')

function App() {
    const [message, setMessage] = useState('')
    
    useEffect(() => {
        socket.on('count', data => {
            setMessage(data)
        })

        socket.on('connect', () => console.log('Connected to server'))
    }, [])

    return (
        <div className="App">
            <h1>Messages Sent: {message}</h1>
        </div>
    )
}

export default App
