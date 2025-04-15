import { WebSocketServer } from 'ws'

const port = process.argv[2] ? parseInt(process.argv[2], 10) : 8080

const server = new WebSocketServer({ port })

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
})
console.log(`Listening on ws://localhost:${port}`)
