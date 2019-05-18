const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')
const uniqid = require('uniqid')
const port = process.env.PORT || 5000

// Routes
app.get('/api/test', (req, res) => {
  res.send('This test string come from server!')
})

app.get('/api/generateRoomId', (req, res) => {
  res.send(uniqid())
})

// Production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  })
}

// Socket
let rooms = {}

io.on('connection', (socket) => {
  console.log('a user connected')
  const { roomId } = socket.handshake.query

  socket.join(roomId)

  socket.on('user connected chat room', (username) => {
    console.log(`user ${username} connected to room ${roomId}`)
    if (rooms[roomId] === undefined) { rooms[roomId] = [] }
    rooms[roomId].push({ id: socket.id, username })
    io.to(roomId).emit('user connected chat room', rooms[roomId])
    console.log(rooms)
  })

  socket.on('chat message', (message) => {
    console.log(`message: ${message.value}`)
    socket.broadcast.to(roomId).emit('chat message', message)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    const currentRoom = rooms[roomId]
    if (currentRoom !== undefined) {
      const updatedCurrentRoom = currentRoom.filter((user) => user.id !== socket.id)
      if (updatedCurrentRoom.length === 0) {
        const { [roomId]: omit, ...updatedRooms } = rooms
        rooms = updatedRooms
      } else {
        rooms[roomId] = updatedCurrentRoom
      }  
      socket.broadcast.to(roomId).emit('user disconnected chat room', updatedCurrentRoom)
    }
    socket.leave(roomId)

    console.log(rooms)
  })
})

// Start server
server.listen(port, () => {
  console.log(`server listening on port: ${port}`)
})