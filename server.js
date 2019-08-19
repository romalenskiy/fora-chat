const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')
const uniqid = require('uniqid')
const port = process.env.PORT || 5000

// =========================
// Routes
// =========================
// Test route
app.get('/api/test', (req, res) => {
  res.send('This test string come from server!')
})

// Client can get new chat room ID generated at the server
app.get('/api/generateRoomId', (req, res) => {
  res.send(uniqid())
})

// =========================
// Production environment adjustment
// =========================
if(process.env.NODE_ENV === 'production') {
  // Serving static files
  app.use(express.static(path.join(__dirname, 'client/build')))

  // Sending client bundle on first connection 
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
  })
}

// =========================
// Server start
// =========================
server.listen(port, () => {
  console.log(`server listening on port: ${port}`)
})

// =========================
// Socket.io
// =========================
// Storing chat rooms with users
let rooms = {}

// Listening on connection
io.on('connection', (socket) => {
  console.log('a user connected')

  // Receiving room ID from client, then joining client to the room
  const { roomId } = socket.handshake.query
  socket.join(roomId)

  // Listening on room join
  socket.on('user connected chat room', (username) => {
    console.log(`user ${username} connected to room ${roomId}`)

    // If there is no room with that ID, then creating empty one
    // Else adding new client to the room and emitting data to other users at room
    if (rooms[roomId] === undefined) { rooms[roomId] = [] }
    rooms[roomId].push({ id: socket.id, username })
    io.to(roomId).emit('user connected chat room', rooms[roomId])

    console.log(rooms)
  })

  // Listening on users typing
  socket.on('user started typing', (username) => {
    socket.broadcast.to(roomId).emit('add typing user', username)
  })

  socket.on('user stopped typing', (username) => {
    socket.broadcast.to(roomId).emit('delete typing user', username)
  })

  // Listening on new message in the room
  socket.on('chat message', (message) => {
    console.log(`message: ${message.value}`)

    // Emitting message to other users in the room
    socket.broadcast.to(roomId).emit('chat message', message)
  })

  // Listening on user disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected')

    const currentRoom = rooms[roomId]
    if (currentRoom !== undefined) {
      // Deleting disconnected user from the room
      const updatedCurrentRoom = currentRoom.filter((user) => user.id !== socket.id)

      // If after this action room is empty, deleting room
      if (updatedCurrentRoom.length === 0) {
        const { [roomId]: omit, ...updatedRooms } = rooms
        rooms = updatedRooms
      } else {
        rooms[roomId] = updatedCurrentRoom
      }

      // Emitting new state of the room to connected users
      socket.broadcast.to(roomId).emit('user disconnected chat room', updatedCurrentRoom)
    }

    socket.leave(roomId)

    console.log(rooms)
  })
})
