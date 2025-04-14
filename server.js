import { WebSocketServer } from 'ws'

const server = new WebSocketServer({ port: 8080 })

let clients = []

server.on('connection', (ws) => {
  clients.push(ws)
  ws.on('message', (message) => {
    clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message)
      }
    })
  })
  ws.on('close', () => {
    clients = clients.filter((client) => client !== ws)
  })
  ws.send('Connection established')
})
console.log('Listening on ws://localhost:8080')
