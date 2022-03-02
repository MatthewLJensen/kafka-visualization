import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-jss'
import './index.css'
import App from './App'

const theme = {
    palette: {
        background: {
            primary: '#292E39',
            secondary: '#2E3440',
            highlight: '#434C5D'
        },
 
        accent: {
            red: '#BF616A',
            orange: '#D0866F',
            yellow: '#EBCB8B',
            green: '#A3BE8C',
            pink: '#B48DAD',
        },

        white: [
            '#D8DEE9', '#E5E9F0', '#ECEFF4', '#F5F7FA', '#F9F9F9', '#FFFFFF'
        ],

        frost: [
            '#8FBCBB', '#88C0D0', '#81A1C1', '#5E81AC', '#3E6C7E', '#1D4F5F'
        ],

        text: {
            primary: '#ECEFF4',
            secondary: '#E5E9F0',
            muted: '#D8DEE9'
        }
    },

    boxShadow: [
        'rgb(15 17 21 / 20%) 0px 3px 6px 0px'
    ],

    radius: [
        '0.25rem', '0.5rem', '0.75rem', '1rem', '1.25rem', '1.5rem'
    ]
}

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
